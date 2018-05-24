import Token from '../constants/token'

/*
* compute the player's token associated to his position and the table round
* - In heads-up play with two blinds, the small blind is on the dealer
* - Order is :
*     1. Dealer
*     2. Small Blind
*     3. Big Blind
*
* @param table { player: { id: {} }, round: 0 }
* @param player { id: 123 }
* @returns Token
*/
export default function getToken(table, player){
  let token,
      playerIds = Object.keys(table.player)
  const dealerIndex = table.round % playerIds.length,
        playerIndex = playerIds.indexOf(player.id)

  if (isHeadsUp(table)){
    token = playerIndex === dealerIndex ? Token.DEALER_SMALL : Token.BIG_BLIND
  } else {
    const smallBlindIndex = (dealerIndex + 1) % playerIds.length,
          bigBlindIndex = (dealerIndex + 2) % playerIds.length

    switch (playerIndex){
      case dealerIndex:
        token = Token.DEALER
        break
      case smallBlindIndex:
        token = Token.SMALL_BLIND
        break
      case bigBlindIndex:
        token = Token.BIG_BLIND
        break
      default:
        token = null
    }
  }

  return token
}

function isHeadsUp(table){
  return Object.keys(table.player).length <= 2
}