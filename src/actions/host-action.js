import { get, getDatabase, onValue, ref, update } from "firebase/database";
import { setAction } from "./table-action";
import { setPlayerHost } from "./player-action";
import Action from "../constants/action";
import Turn from "../constants/turn";
import isTurnFinished from "../business/is-turn-finished";
import isGameWon from "../business/is-game-won";
import selectors from "reducers/selectors";
import State from "constants/state";
import Turn from "constants/turn";
import { calculateSidePots } from "../business/calculate-sidepots";
import getToken from "../business/get-token";

function getTableRef(id) {
  return ref(getDatabase(), `table/${id}`);
}

function _nextRoundUpdates({ round }) {
  return {
    pot: 0,
    round: (round || 0) + 1,
    turn: Turn.PRE_FLOP,
  };
}

function _resetPlayerUpdates({ id, chips }) {
  const updates = {};
  updates[`player/${id}/bet`] = 0;
  updates[`player/${id}/lastRoundChips`] = chips || 0;
  updates[`player/${id}/state`] = State.IDLE;
  updates[`player/${id}/totalBet`] = 0;
  return updates;
}

function _winRoundUpdates(players) {
  const sidepots = calculateSidePots(players);
  const winners = players.filter(({ state }) => state !== State.FOLDED);
  const isWinner = (player) => winners.includes(player);
  const addToTotal = (updates, gains) => (player) => {
    const key = `player/${player.id}/chips`;
    const playerTotal = updates[key] || player.chips;
    updates[key] = playerTotal + gains;
  };

  const distributeSidepotToPlayers = (updates, sidepot) => {
    const winningPlayers = sidepot.players.filter(isWinner);

    // Distribute pot between winners
    if (winningPlayers.length) {
      winningPlayers.forEach(
        addToTotal(updates, sidepot.pot / winningPlayers.length)
      );
    }

    // Distribute pot between non-winners
    else {
      sidepot.players.forEach(
        addToTotal(updates, sidepot.pot / sidepot.players.length)
      );
    }

    return updates;
  };

  return sidepots.reduce(distributeSidepotToPlayers, {});
}

export function winRound(table, players) {
  return (dispatch, getState) => {
    const tableId = selectors.getTableId(getState());
    const tableUpdates = Object.assign(
      _nextRoundUpdates(table),
      _winRoundUpdates(players),
      ...players.map(_resetPlayerUpdates)
    );
    dispatch({ type: "LOG_WIN_ROUND" });
    update(getTableRef(tableId), tableUpdates);
  };
}

function setTokens(table, players) {
  return (dispatch, getState) => {
    const noUpdates = {};
    const tableId = selectors.getTableId(getState());
    const tokenUpdates = players.reduce((updates, player) => {
      const token = getToken(table, players, player);
      const alreadyHasCorrectToken = player.token === token;

      if (alreadyHasCorrectToken) {
        return updates;
      }

      return {
        ...updates,
        [`player/${player.id}/token`]: token,
      };
    }, noUpdates);

    if (tokenUpdates === noUpdates) {
      return;
    }

    dispatch({ type: "LOG_SET_TOKENS" });
    update(getTableRef(tableId), tokenUpdates);
  };
}

export function updateGame(table, players) {
  return (dispatch) => {
    const isHost = table.host === players[0].id;

    if (!isHost) {
      return;
    }

    switch (table.turn || Turn.PRE_FLOP) {
      case Turn.PRE_FLOP:
        dispatch(setTokens(table, players));
      case Turn.FLOP:
      case Turn.TURN:
      case Turn.RIVER:
        // isTurnFinished(players) && dispatch(setAction(Action.NEXT_TURN));
        console.log("next turn? " + isTurnFinished(players));
      // eslint-disable-next-line
      default:
        isGameWon(players) && dispatch(winRound(table, players));
    }
  };
}

/** Deprecated */
export function controlGame() {
  return (dispatch, getState) => {
    const tableId = selectors.getTableId(getState());

    // this function is run for every single table-wide update
    onValue(getTableRef(tableId), (snapshot) => {
      const table = snapshot.val();

      // ignore self update
      if (table.action) {
        return;
      }

      switch (table.turn || Turn.PRE_FLOP) {
        case Turn.PRE_FLOP:
        case Turn.FLOP:
        case Turn.TURN:
        case Turn.RIVER:
          isTurnFinished(table) && dispatch(setAction(Action.NEXT_TURN));
        // eslint-disable-next-line
        default:
          isGameWon(table) && dispatch(setAction(Action.WIN_ROUND));
      }
    });
  };
}

/** Deprecated */
export function controlGameIfFirst() {
  function playerIsFirst(getState, players) {
    const playerId = getState().player.id;
    return Object.keys(players)[0] === playerId;
  }

  return async (dispatch, getState) => {
    const tableId = selectors.getTableId(getState());

    const snapshot = await get(ref(getDatabase(), `table/${tableId}/player`));
    const players = snapshot.val();

    if (playerIsFirst(getState, players)) {
      dispatch(controlGame());
      dispatch(setPlayerHost());
    }
  };
}
