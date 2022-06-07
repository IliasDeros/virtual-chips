import isTurnFinished from "business/is-turn-finished";
import State from "constants/state";
import Turn from "constants/turn";
import { compose, increment, _get, _update } from "./utils";

const canBet = (p) => ![State.ALL_IN, State.FOLDED].includes(_get(p, "state"));
const calledEveryoneAllIn = (players) => {
  const isAlone = players.length === 1;
  const bettingPlayers = players.filter(canBet);
  const notEveryoneElseIsAllIn = bettingPlayers.length !== 1;
  const isEveryoneAllIn = bettingPlayers.length === 0;

  if (isEveryoneAllIn) {
    return true;
  }

  if (isAlone || notEveryoneElseIsAllIn) {
    return false;
  }
  const highestBet = players
    .filter((p) => _get(p, "state") !== State.FOLDED)
    .reduce((bet, p) => Math.max(bet, _get(p, "turnBet", 0)), 0);
  const hasCalledHighestBet = _get(bettingPlayers[0], "turnBet") >= highestBet;

  return hasCalledHighestBet;
};
const isShowdown = (players, table) =>
  _get(table, "turn") === Turn.FINISHED || calledEveryoneAllIn(players);

/**
 * Proceed to next turn when everyone played
 * - Increment table turn
 * - Clear player turnBets
 * - Reset player states
 *
 * @returns {object}
 * ```
 * {
 *   players: [{ ...player, gameUpdates: { state, turnBet } }],
 *   table: { ...table, gameUpdates: { turn } }
 * }
 * ```
 */
export default function updateTurn({ players, table }) {
  if (isShowdown(players, table)) {
    return {
      players,
      table: _update(table, { turn: Turn.FINISHED }),
    };
  }

  if (!isTurnFinished(players)) {
    return { players, table };
  }

  const clearBet = (p) => _update(p, { turnBet: 0 });
  const resetState = (p) => {
    const cannotBet = [State.ALL_IN, State.FOLDED].includes(_get(p, "state"));
    if (cannotBet) {
      return p;
    }

    return _update(p, { state: State.IDLE });
  };

  return {
    players: players.map(compose(resetState, clearBet)),
    table: _update(table, { turn: increment(table.turn) }),
  };
}
