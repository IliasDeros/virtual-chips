import { getAuth, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  onValue,
  ref,
  runTransaction,
  update,
} from "firebase/database";
import { setPlayersMeFirst, setPot, setTurn } from "../actions/table-action";
import { getCurrentTurnPlayer } from "../business/get-turn";
import { updateGame } from "../business/update-game";

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

function watchPot(id, { dispatch, getState }) {
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

function _formatGameUpdates({ players, table }) {
  const firebaseUpdates = Object.assign(
    { ...table.gameUpdates },
    ...players.map(({ id, gameUpdates = [] }) =>
      Object.entries(gameUpdates).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`player/${id}/${key}`]: value,
        }),
        {}
      )
    )
  );

  return firebaseUpdates;
}

function _isHost(table, players) {
  const { host: hostId } = table;
  const meId = players[0]?.id;
  return hostId === meId;
}

function _hostGameUpdates(tableId, table, players) {
  if (!_isHost(table, players)) {
    return;
  }

  const updates = updateGame(table, players);
  const firebaseUpdates = _formatGameUpdates(updates);
  const hasUpdates = Object.keys(firebaseUpdates).length > 0;

  if (!hasUpdates) {
    return;
  }

  update(getTableRef(tableId), firebaseUpdates);
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

function watchPlayersAndHostTable(tableId, meId, { dispatch }) {
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

export function connectToTable(id) {
  return async (dispatch, getState) => {
    const dispatcher = { dispatch, getState };

    const playerId = await initializePlayer(id);
    initializeHost(id, playerId);
    watchPot(id, dispatcher);
    watchTurn(id, dispatcher);
    watchPlayersAndHostTable(id, playerId, dispatcher);
  };
}
