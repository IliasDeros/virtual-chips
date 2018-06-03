import State from '../constants/state'

/*
* check if all players have finished their turn. A player has finished their
* turn if :
* - They called or checked the highest bet
* - They are all-in
* - They are folded
*/
export default function isTurnFinished(table){
  const players = Object.keys(table.player).map(key => table.player[key]),
        activePlayers = players
          .filter(p => ![State.ALL_IN, State.FOLDED].includes(p.state)),
        activeBets = activePlayers.map(p => p.chips.bet),

        allSameBet = !isNaN(activeBets.reduce((a, b) => a === b ? a : NaN)),
        allChecked = activePlayers.every(({ state }) => state === State.CHECKED),
        allCalled = activePlayers.every(({ state }) => state === State.CALLED),

        onlyOneBet = activePlayers
          .filter(p => [State.BET, State.CHECKED].includes(p.state))
          .length === 1,
        othersCalled = activePlayers
          .filter(({ state }) => state === State.CALLED)
          .length === activePlayers.length - 1,
        calledHighestBet = onlyOneBet && othersCalled

  return activeBets.length >= 2 &&
    allSameBet &&
    (allCalled || allChecked || calledHighestBet)
}