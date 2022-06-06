import State from "../constants/state";

const canBet = (p) => p.chips > 0;
const hasBet = (p) =>
  [State.ALL_IN, State.BET, State.CALLED, State.CHECKED, State.FOLDED].includes(
    p.state
  );
const getBet = (p) => p.turnBet;

/*
 * check if all players have finished their turn. A player has finished their
 * turn if :
 * - They called or checked the highest bet
 * - They are all-in
 * - They are folded
 */
export default function isTurnFinished(players) {
  const everyoneHasBet = players.every(hasBet);
  if (!everyoneHasBet) {
    return false;
  }

  const everyoneBetMax = players
    .filter(canBet)
    .every((p, i, others) => getBet(p) === getBet(others[0]));

  return everyoneBetMax;
}
