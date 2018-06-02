import fire from '../fire'
import Action from '../constants/action'
import Turn from '../constants/turn'
import isTurnFinished from '../business/is-turn-finished'
import isGameWon from '../business/is-game-won'

export function controlGame(){
  return (dispatch, getState) => {
    const { table } = getState(),
          setAction = a => fire.database().ref(`table/${table.id}/action`).set(a)

    // this function is run for every single table-wide update
    fire.database().ref(`table/${table.id}`).on('value', snapshot => {
      switch (table.turn || Turn.PRE_FLOP){
        case Turn.PRE_FLOP:
        case Turn.FLOP:
        case Turn.TURN:
          isTurnFinished(snapshot.val()) && setAction(Action.NEXT_TURN)
        default:
          isGameWon(snapshot.val()) && setAction(Action.WIN_ROUND)
      }
    })
  }
}

// the game flow is handled by the first player in the table
export function controlGameIfFirst(){
  function playerIsFirst(getState, players){
    const playerId = getState().player.id
    return Object.keys(players)[0] === playerId
  }

  return async (dispatch, getState) => {
    const tableId = getState().table.id

    let snapshot = await fire.database().ref(`table/${tableId}/player`).once('value')
    const players = snapshot.val()

    if (playerIsFirst(getState, players)){
      dispatch(controlGame())
    }
  }
}
