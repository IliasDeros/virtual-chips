import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  onValue,
  ref,
  runTransaction,
  set,
} from "firebase/database";
import { resetBet } from "actions/player-action";
import {
  setPlayersMeFirst,
  setPot,
  setTableId,
  setTurn,
  updatePlayerOrder,
} from "../actions/table-action";
import { findHighestBet, getCurrentTurnPlayer } from "business/get-turn";
import { hasGameUpdates, updateGame } from "business/update-game";
import selectors from "reducers/selectors";
import State from "constants/state";
import { compose, getUrlParam } from "shared/modules/utils";

const uidParam = "player";

function getTableRef(id, path) {
  const url = `table/${id}${path ? `/${path}` : ""}`;
  return ref(getDatabase(), url);
}

function getPlayerRef(endpoint, state) {
  const [me] = selectors.getPlayers(state);
  let url = `table/${state.table.id}/player/${me.id}/${endpoint}`;
  const db = getDatabase();
  return ref(db, url);
}

export function check() {
  return (_, getState) => {
    set(getPlayerRef("state", getState()), State.CHECKED);
  };
}

export function fold() {
  return (_, getState) => {
    set(getPlayerRef("state", getState()), State.FOLDED);
  };
}

export function tie() {
  return (_, getState) => {
    set(getPlayerRef("state", getState()), State.TIED);
  };
}

function watchTurn(id, { dispatch }) {
  onValue(getTableRef(id, "turn"), (snapshot) => {
    dispatch(resetBet);
    dispatch(setTurn(snapshot.val()));
  });
}

function _sumBets(players) {
  return Object.entries(players).reduce(
    (sum, [, player]) => sum + (player.roundBet || 0),
    0
  );
}

function watchPot(id, { dispatch }) {
  onValue(getTableRef(id), (snapshot) => {
    const players = snapshot.val()?.player || [];
    const pot = _sumBets(players);
    dispatch(setPot(pot));
  });
}

function _orderMeFirst(meId, orderedPlayerIds) {
  return (indexedPlayers) => {
    const sortPlayers = ([idA], [idB]) =>
      orderedPlayerIds.indexOf(idA) - orderedPlayerIds.indexOf(idB);
    const isEntryMe = ([id]) => id === meId;
    const toValue = ([id, player]) => ({ id, ...player });
    const playerEntries = Object.entries(indexedPlayers).sort(sortPlayers);

    // Order players so that "me" is first
    const meIndex = playerEntries.findIndex(isEntryMe);
    const players = playerEntries
      .slice(meIndex)
      .concat(playerEntries.slice(0, meIndex))
      .map(toValue);

    return players;
  };
}

function _setPlayerHost(playerId) {
  return (players) => players.map((p) => ({ ...p, isHost: p.id === playerId }));
}

function _setPlayerTurn(players) {
  const turnPlayer = getCurrentTurnPlayer(players);
  const isTurn = (p) => p === turnPlayer;
  return players.map((p) => ({ ...p, isTurn: isTurn(p) }));
}

function _mergeUpdates(existingTable, { players, table }) {
  const mergeWithExistingPlayer = ({ id, gameUpdates = {} }) => {
    const existingPlayer = existingTable.player[id];

    return {
      [id]: {
        ...existingPlayer,
        ...gameUpdates,
      },
    };
  };

  return {
    ...existingTable,
    ...table.gameUpdates,
    player: Object.assign(
      {},
      existingTable.player,
      ...players.map(mergeWithExistingPlayer)
    ),
  };
}

function _isHost(table, players) {
  const { host: hostId } = table;
  const meId = players[0]?.id;
  return hostId === meId;
}

async function _hostGameUpdates(tableId, table, players) {
  if (!_isHost(table, players)) {
    return;
  }

  const updates = updateGame(table, players);
  if (!hasGameUpdates(updates)) {
    return;
  }

  runTransaction(getTableRef(tableId), (table) =>
    _mergeUpdates(table, updates)
  );
}

function _formatPlayers(firebaseTable, meId) {
  const { host: hostId, player, playerOrder } = firebaseTable;

  if (!player) {
    return;
  }

  return compose(
    _setPlayerTurn,
    _setPlayerHost(hostId),
    _orderMeFirst(meId, playerOrder)
  )(player);
}

function watchTable(tableId, meId, { dispatch }) {
  onValue(getTableRef(tableId), (snapshot) => {
    const table = snapshot.val();
    const playersMeFirst = _formatPlayers(table, meId);

    // Update local state
    dispatch(setPlayersMeFirst(playersMeFirst));
    dispatch(updatePlayerOrder(table.playerOrder));

    // Update remote state (database)
    _hostGameUpdates(tableId, table, playersMeFirst);
  });
}

function createPlayer(tableId, playerId) {
  const initialPlayer = {
    name: `Player #${playerId.slice(0, 4)}`,
    chips: 2500,
  };

  return runTransaction(
    getTableRef(tableId, `player/${playerId}`),
    (value) => value || initialPlayer
  );
}

async function initializePlayer(id) {
  const fakeUid = getUrlParam(uidParam);

  if (fakeUid) {
    await createPlayer(id, fakeUid);
    return fakeUid;
  }

  return new Promise((res) =>
    signInAnonymously(getAuth()).then(async (u) => {
      const uid = u.user.uid;
      // Create player if he doesnt exist
      await createPlayer(id, uid);
      res(uid);
    })
  );
}

async function initializeHost(tableId, playerId) {
  try {
    await runTransaction(
      getTableRef(tableId, "host"),
      (value) => value || playerId
    );
  } catch (e) {
    // Do nothing, you can't update host if it's already set
  }
}

function _callBetFor(playerId) {
  return (remotePlayers) => {
    const remotePlayer = remotePlayers[playerId];
    const highestBet = findHighestBet(Object.values(remotePlayers));
    const chipsDifference = highestBet - (remotePlayer.turnBet || 0);

    return {
      ...remotePlayers,
      [playerId]: {
        ...remotePlayer,
        state: State.CALLED,
        turnBet: highestBet,
        roundBet: (remotePlayer.roundBet || 0) + chipsDifference,
        chips: remotePlayer.chips - chipsDifference,
      },
    };
  };
}

export function call() {
  return async (dispatch, getState) => {
    const state = getState();
    const tableId = selectors.getTableId(state);
    const [me] = selectors.getPlayers(state);
    const meRef = getTableRef(tableId, `player`);

    await runTransaction(meRef, _callBetFor(me.id));
  };
}

function _raiseToAllIn(remotePlayer) {
  const { chips, roundBet = 0, turnBet = 0 } = remotePlayer;

  return {
    ...remotePlayer,
    state: State.ALL_IN,
    turnBet: turnBet + chips,
    roundBet: roundBet + chips,
    chips: 0,
  };
}

function _raiseToAmount(totalBet) {
  return (remotePlayer) => {
    const { chips, roundBet = 0, turnBet = 0 } = remotePlayer;
    // Eg: turnBet is 50
    //   + totalBet is 200
    //   = betDifference is 150
    const betDifference = totalBet - turnBet;
    const remainingChips = chips - betDifference;

    // All-in
    if (remainingChips <= 0) {
      return _raiseToAllIn(remotePlayer);
    }

    return {
      ...remotePlayer,
      state: State.BET,
      turnBet: turnBet + betDifference,
      roundBet: roundBet + betDifference,
      chips: remainingChips,
    };
  };
}

export function allIn() {
  return async (dispatch, getState) => {
    const state = getState();
    const tableId = selectors.getTableId(state);
    const [me] = selectors.getPlayers(state);
    const meRef = getTableRef(tableId, `player/${me.id}`);

    await runTransaction(meRef, _raiseToAllIn);
  };
}

function raiseTo(amount) {
  return async (dispatch, getState) => {
    const state = getState();
    const tableId = selectors.getTableId(state);
    const [me] = selectors.getPlayers(state);
    const meRef = getTableRef(tableId, `player/${me.id}`);

    await runTransaction(meRef, _raiseToAmount(amount));
  };
}

export function confirmPlayerBet() {
  return (dispatch, getState) => {
    const bet = selectors.getPlayerBet(getState());
    raiseTo(bet)(dispatch, getState);
    dispatch(resetBet);
  };
}

export function connectToTable(id) {
  return async (dispatch, getState) => {
    const dispatcher = { dispatch, getState };

    dispatch(setTableId(id));
    const playerId = await initializePlayer(id);
    initializeHost(id, playerId);
    watchPot(id, dispatcher);
    watchTurn(id, dispatcher);
    watchTable(id, playerId, dispatcher);
  };
}
