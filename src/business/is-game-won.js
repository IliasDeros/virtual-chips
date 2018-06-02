import State from '../constants/state'

/*
* Check if the round is finished.
* A player wins if :
* - He is the only one that isn't folded on the table
* - All remaining players are tied
*/
export default function isGameWon(table){
  const players = Object.keys(table.player).map(key => table.player[key])
  if (players.length <= 1){ return }

  const states = players.map(p => p.state),
        nonFolded = states.filter(s => s !== State.FOLDED),
        allTied = nonFolded.every(s => s === State.TIED)

  return nonFolded.length === 1 || allTied
}