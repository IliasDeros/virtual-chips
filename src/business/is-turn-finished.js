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
        playerBets = players
          .filter(p => ![State.ALL_IN, State.FOLDED].includes(p.state))
          .map(p => p.chips.bet),
        
        allSameBet = !!playerBets.reduce((a, b) => a === b ? a : NaN),
        allDone = players.every(({ state }) =>
          [State.ALL_IN, State.CALLED, State.CHECKED, State.FOLDED].includes(state)
        )
  
  return players.length >= 2 && allSameBet && allDone
}