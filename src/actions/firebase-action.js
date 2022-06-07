import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  onValue,
  ref,
  runTransaction,
  update,
} from "firebase/database";
import {
  setPlayersMeFirst,
  setPot,
  setTableId,
  setTurn,
} from "../actions/table-action";
import { findHighestBet, getCurrentTurnPlayer } from "../business/get-turn";
import { hasGameUpdates, updateGame } from "../business/update-game";
import selectors from "reducers/selectors";
import State from "constants/state";

const uidParam = "player";

function getUrlParam(paramName) {
  const params = new URLSearchParams(
    window.location.href.slice(window.location.href.indexOf("?"))
  );
  return params.get(paramName);
}

function getTableRef(id, path) {
  const url = `table/${id}${path ? `/${path}` : ""}`;
  return ref(getDatabase(), url);
}

function watchTurn(id, { dispatch }) {
  onValue(getTableRef(id, "turn"), (snapshot) =>
    dispatch(setTurn(snapshot.val()))
  );
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

function _orderMeFirst(meId) {
  return (indexedPlayers) => {
    const playerEntries = Object.entries(indexedPlayers);
    const isEntryMe = ([id]) => id === meId;
    const toValue = ([id, player]) => ({ id, ...player });

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

const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, f) => f(y), x);

function _setPlayerTurn(players) {
  const turnPlayer = getCurrentTurnPlayer(players);
  const isTurn = (p) => p === turnPlayer;
  return players.map((p) => ({ ...p, isTurn: isTurn(p) }));
}

function _mergeUpdates(existingTable, { players, table }) {
  const mergeExistingPlayer = ({ id, gameUpdates = {} }) => {
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
      ...players.map(mergeExistingPlayer)
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
  const { host: hostId, player } = firebaseTable;

  if (!player) {
    return;
  }

  return compose(
    _setPlayerTurn,
    _setPlayerHost(hostId),
    _orderMeFirst(meId)
  )(player);
}

function watchTable(tableId, meId, { dispatch }) {
  onValue(getTableRef(tableId), (snapshot) => {
    const table = snapshot.val();
    const playersMeFirst = _formatPlayers(table, meId);

    // Update local state
    dispatch(setPlayersMeFirst(playersMeFirst));

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

function _betAmount(amount) {
  return (remotePlayer) => {
    const { chips, roundBet = 0, turnBet = 0 } = remotePlayer;
    const chipsDifference = amount - turnBet;

    return {
      ...remotePlayer,
      state: State.BET,
      turnBet: amount,
      roundBet: roundBet + chipsDifference,
      chips: chips - chipsDifference,
    };
  };
}

export function bet(amount) {
  return async (dispatch, getState) => {
    const state = getState();
    const tableId = selectors.getTableId(state);
    const [me] = selectors.getPlayers(state);
    const meRef = getTableRef(tableId, `player/${me.id}`);

    await runTransaction(meRef, _betAmount(amount));
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
