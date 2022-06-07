import isTurnFinished from "business/is-turn-finished";
import State from "constants/state";
import Turn from "constants/turn";
import { compose, increment, _get, _update } from "./utils";

const canBet = (p) => ![State.ALL_IN, State.FOLDED].includes(_get(p, "state"));

const isShowdown = (players, table) =>
  _get(table, "turn") === Turn.FINISHED || players.filter(canBet).length <= 1;

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
