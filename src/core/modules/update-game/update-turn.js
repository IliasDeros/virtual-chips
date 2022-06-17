import State from "constants/state";
import Turn from "constants/turn";
import { compose } from "shared/modules/utils";
import { increment, _get, _update } from "./utils";

/**
 * Can't proceed to next turn if we are at the last turn
 */
const stayShowdown = (data) => {
  const { table } = data;
  const isShowdownTurn = _get(table, "turn") === Turn.FINISHED;
  return isShowdownTurn && data;
};

const findHighestBet = (players) => {
  const maxBet = (bet, p) => Math.max(bet, _get(p, "turnBet", 0));
  return players.reduce(maxBet, 0);
};
const isAllIn = (p) => {
  const chips = _get(p, "chips", 0);
  const roundBet = _get(p, "roundBet", 0);
  return chips <= 0 && roundBet > 0;
};
const isIdle = (p) => _get(p, "state") === State.IDLE;
const isFolded = (p) => _get(p, "state") === State.FOLDED;
const hasCalledHighestBet = (players) => {
  const bet = findHighestBet(players);
  return (p) => !isIdle(p) && _get(p, "turnBet", 0) >= bet;
};

/**
 * Ignoring folded players:
 *
 * Proceed to next turn if everyone called the highest bet.
 *
 * Skip straight to the final turn if:
 * - 0 or 1 player called the highest bet
 * - 1+ people are all-in
 */
const goToNextTurn = (data) => {
  const { players, table } = data;
  const hasCalled = hasCalledHighestBet(players);
  const activePlayers = players.filter((p) => !isFolded(p));
  const isTurnFinished = activePlayers.every(hasCalled);
  const isShowdown = activePlayers.filter((p) => !isAllIn(p)).length <= 1;
  const nextTurn = isShowdown ? Turn.FINISHED : increment(table.turn);

  if (!isTurnFinished && !isShowdown) {
    return data;
  }

  const hasBet = (p) => _get(p, "turnBet", 0) > 0;
  const clearBet = (p) => (hasBet(p) ? _update(p, { turnBet: 0 }) : p);
  const resetActiveState = (p) =>
    isFolded(p) ? p : _update(p, { state: State.IDLE });

  return {
    players: players.map(compose(resetActiveState, clearBet)),
    table: _update(table, { turn: nextTurn }),
  };
};

const stayAlone = (data) => {
  const { players } = data;
  const isAlone = players.length === 1;
  return isAlone && data;
};

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
export default function updateTurn(data) {
  return stayAlone(data) || stayShowdown(data) || goToNextTurn(data);
}
