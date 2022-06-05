import Token from "../constants/token";

/*
 * compute the player's token associated to his position and the table round
 * - In heads-up play with two blinds, the small blind is on the dealer
 * - Order is :
 *     1. Dealer
 *     2. Small Blind
 *     3. Big Blind
 *
 * @param table { round: 0, round: 0, playerOrder: "1,2" }
 * @param players [{ id: "1" }]
 * @param player { id: "1" }
 * @returns Token
 */
export default function getToken(table, players, player) {
  let token;
  const dealerIndex = table.round % players.length;
  const playerIndex = players.indexOf(player);

  if (isHeadsUp(players)) {
    token = playerIndex === dealerIndex ? Token.DEALER_SMALL : Token.BIG_BLIND;
  } else {
    const smallBlindIndex = (dealerIndex + 1) % players.length;
    const bigBlindIndex = (dealerIndex + 2) % players.length;

    switch (playerIndex) {
      case dealerIndex:
        token = Token.DEALER;
        break;
      case smallBlindIndex:
        token = Token.SMALL_BLIND;
        break;
      case bigBlindIndex:
        token = Token.BIG_BLIND;
        break;
      default:
        token = null;
    }
  }

  return token;
}

function isHeadsUp(players) {
  const headsUpPlayerCount = 2;
  return players.length <= headsUpPlayerCount;
}
