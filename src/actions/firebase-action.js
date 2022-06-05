import { getDatabase, onValue, ref, runTransaction } from "firebase/database";
import Fingerprint from "fingerprintjs2";
import Turn from "constants/turn";
import selectors from "reducers/selectors";
import { updateGame } from "actions/host-action";
import { setPlayerHost } from "actions/player-action";

const fingerprintMockParam = "player";

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

function watchAction(id, { dispatch }) {
  onValue(getTableRef(id, "action"), (snapshot) => {
    dispatch({
      type: "SET_ACTION",
      payload: snapshot.val(),
    });
  });
}

function watchTurn(id, { dispatch }) {
  onValue(getTableRef(id, "turn"), (snapshot) => {
    dispatch({
      type: "SET_TURN",
      payload: snapshot.val() || Turn.PRE_FLOP,
    });
  });
}

function _sumTotalBets(players) {
  return Object.entries(players).reduce(
    (sum, [, player]) => sum + (player.totalBet || 0),
    0
  );
}

function watchPot(id, { dispatch, getState }) {
  onValue(getTableRef(id), (snapshot) => {
    const players = snapshot.val().player || [];
    const payload = _sumTotalBets(players);
    const oldPot = selectors.getPot(getState());
    const isSamePot = payload === oldPot;

    if (isSamePot) {
      return;
    }

    dispatch({ type: "SET_POT", payload });
  });
}

function _orderMeFirst(indexedPlayers, meId) {
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
}

function watchPlayers(id, meId, { dispatch }) {
  onValue(getTableRef(id), (snapshot) => {
    const table = snapshot.val();
    const { player } = table;

    if (!player) {
      return;
    }

    const payload = _orderMeFirst(player, meId);
    dispatch({ type: "SET_PLAYERS_ME_FIRST", payload });
    dispatch(updateGame(table, payload));
  });
}

function createPlayer(tableId, playerId) {
  const initialPlayer = {
    name: `Player #${playerId.slice(0, 4)}`,
  };

  return runTransaction(
    getTableRef(tableId, `player/${playerId}`),
    (value) => value || initialPlayer
  );
}

function initializePlayer(id) {
  const fingerprintMock = getUrlParam(fingerprintMockParam);

  return new Promise((res) =>
    new Fingerprint().get(async (fingerprint) => {
      const playerId = fingerprintMock || fingerprint;

      // Create player if he doesnt exist
      await createPlayer(id, playerId);
      res(playerId);
    })
  );
}

function initializeHost(tableId, playerId) {
  return runTransaction(
    getTableRef(tableId, "host"),
    (value) => value || playerId
  );
}

function watchHost(id, playerId, dispatcher) {
  const { dispatch } = dispatcher;
  const hostRef = getTableRef(id, "host");

  onValue(hostRef, (snapshot) => {
    const host = snapshot.val();
    const isCurrentPlayerHost = host === playerId;

    if (!isCurrentPlayerHost) {
      return;
    }

    dispatch(setPlayerHost());
  });
}

export function watchTable(id = "default") {
  return async (dispatch, getState) => {
    const dispatcher = { dispatch, getState };

    watchAction(id, dispatcher);
    watchPot(id, dispatcher);
    watchTurn(id, dispatcher);
    const playerId = await initializePlayer(id);
    initializeHost(id, playerId);
    watchHost(id, playerId, dispatcher);
    watchPlayers(id, playerId, dispatcher);
  };
}
