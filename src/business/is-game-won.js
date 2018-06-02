import State from '../constants/state'

/*
* check if the round if finished.
* A player wins if :
* - He is the only one that isn't folded on the table
* - All remaining players are tied
*/
export default function isGameWon(table){
  const players = Object.keys(table.player).map(key => table.player[key]),
        states = players.map(p => p.state),
        nonFolded = states.filter(s => s !== State.FOLDED)

  return nonFolded.length === 1 || nonFolded.every(s => s === State.TIED)
}