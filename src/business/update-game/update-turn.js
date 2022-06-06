import isTurnFinished from "business/is-turn-finished";
import State from "constants/state";
import Turn from "constants/turn";
import { compose, increment, _update } from "./utils";

const isShowdown = ({ turn }) => turn === Turn.FINISHED;

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
  if (isShowdown(table) || !isTurnFinished(players)) {
    return { players, table };
  }

  const clearBet = (p) => _update(p, { turnBet: 0 });
  const resetState = (p) => {
    const isFolded = p.state === State.FOLDED;
    if (isFolded) {
      return p;
    }

    return _update(p, { state: State.IDLE });
  };

  return {
    players: players.map(compose(resetState, clearBet)),
    table: _update(table, { turn: increment(table.turn) }),
  };
}
