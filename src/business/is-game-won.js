import State from "constants/state";

const isActive = ({ state }) => state !== State.FOLDED;
const isTied = ({ state }) => state === State.TIED;

/*
 * Check if the round is finished.
 * A player wins if :
 * - He is the only one that isn't folded on the table
 * - All remaining players are tied
 */
export default function isGameWon(players) {
  const isAlone = players.length <= 1;

  if (isAlone) {
    return false;
  }

  const activePlayers = players.filter(isActive);
  const isLastActivePlayer = activePlayers.length === 1;
  if (isLastActivePlayer) {
    return true;
  }

  const areAllActivePlayersTied = activePlayers.every(isTied);
  return areAllActivePlayersTied;
}
