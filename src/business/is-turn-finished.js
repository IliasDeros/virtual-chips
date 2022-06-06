import State from "../constants/state";

const isPlayerActive = (p) => ![State.ALL_IN, State.FOLDED].includes(p.state);
const isPlayerCalled = ({ state }) => state === State.CALLED;
const isPlayerChecked = ({ state }) => state === State.CHECKED;
const hasPlayerBet = (p) => [State.BET, State.CHECKED].includes(p.state);
const getPlayerBet = (p) => p.turnBet;

/*
 * check if all players have finished their turn. A player has finished their
 * turn if :
 * - They called or checked the highest bet
 * - They are all-in
 * - They are folded
 */
export default function isTurnFinished(players) {
  const activePlayers = players.filter(isPlayerActive);
  const activeBets = activePlayers.map(getPlayerBet);
  const allSameBet =
    activeBets.reduce((a, b) => (a === b ? a : false), activeBets[0]) !== false;
  const allChecked = activePlayers.every(isPlayerChecked);
  const allCalled = activePlayers.every(isPlayerCalled);
  const onlyOneBet = activePlayers.filter(hasPlayerBet).length === 1;
  const othersCalled =
    activePlayers.filter(isPlayerCalled).length === activePlayers.length - 1;
  const calledHighestBet = onlyOneBet && othersCalled;

  return (
    activePlayers.length >= 2 &&
    allSameBet &&
    (allCalled || allChecked || calledHighestBet)
  );
}
