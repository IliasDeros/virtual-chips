import Button from "../constants/button";

/*
 * compute the player's Button associated to his position and the table round
 * - In heads-up play with two blinds, the small blind is on the dealer
 * - Order is :
 *     1. Dealer
 *     2. Small Blind
 *     3. Big Blind
 *
 * @param table { round: 0, round: 0, playerOrder: "1,2" }
 * @param players [{ id: "1" }]
 * @param player { id: "1" }
 * @returns Button
 */
export default function getButton(table, players, player) {
  let button;
  const dealerIndex = (table.round || 0) % players.length;
  const playerIndex = players.indexOf(player);

  if (isHeadsUp(players)) {
    button =
      playerIndex === dealerIndex ? Button.DEALER_SMALL : Button.BIG_BLIND;
  } else {
    const smallBlindIndex = (dealerIndex + 1) % players.length;
    const bigBlindIndex = (dealerIndex + 2) % players.length;

    switch (playerIndex) {
      case dealerIndex:
        button = Button.DEALER;
        break;
      case smallBlindIndex:
        button = Button.SMALL_BLIND;
        break;
      case bigBlindIndex:
        button = Button.BIG_BLIND;
        break;
      default:
        button = null;
    }
  }

  return button;
}

function isHeadsUp(players) {
  const headsUpPlayerCount = 2;
  return players.length <= headsUpPlayerCount;
}
