import Token from "constants/token";
import State from "constants/state";

const isDealer = (p) => [Token.DEALER, Token.DEALER_SMALL].includes(p.token);
const incrementWrapper = (array) => (i) => (i + 1) % array.length;
const getDealerIndex = (players) => players.findIndex(isDealer);
const findHighestBet = (players) =>
  players.reduce((highest, { turnBet }) => Math.max(highest, turnBet), 0);

/**
 * Search an array, starting from "index", for the first
 * element matching predicate
 *
 * @param array the array to search
 * @param index the index to start searching from
 * @param predicate expression to match. If it returns true, the element is returned
 * @returns {T or undefined} - the first element matching predicate
 */
function findFirstFrom(array, index, predicate) {
  const increment = incrementWrapper(array);
  const lastIndex = index ? index - 1 : array.length - 1;

  for (let i = index; i !== lastIndex; i = increment(i)) {
    if (predicate(array[i])) {
      return array[i];
    }
  }
}

const canBet = ({ state }) => ![State.FOLDED, State.ALL_IN].includes(state);
const canCall = (highestBet) => (player) => {
  const { state, token, turnBet } = player;
  const hasToCall = turnBet < highestBet;

  /** If everyone calls the big blind, they can choose to check or raise */
  const hasBigBlindOption = token === Token.BIG_BLIND && state === State.IDLE;

  return (canBet(player) && hasToCall) || hasBigBlindOption;
};

export function getCurrentTurnPlayer(players) {
  const left = incrementWrapper(players);
  const highestBet = findHighestBet(players);
  const hasHighestBet = ({ turnBet }) => turnBet === highestBet;
  const highestBetter = players.findIndex(hasHighestBet);
  const highestBetterLeft = left(highestBetter);
  const isBettingStarted = highestBet > 0;

  if (isBettingStarted) {
    return findFirstFrom(players, highestBetterLeft, canCall(highestBet));
  }

  const dealerLeft = left(getDealerIndex(players));
  return findFirstFrom(players, dealerLeft, canBet);
}