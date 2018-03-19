import fire from '../fire'
import State from '../constants/state'
import Turn from '../constants/turn'

export function controlGame(){
  return (dispatch, getState) => {
    const { table } = getState()

    // this function is run for every single table-wide update
    fire.database().ref(`table/${table.id}`).on('value', snapshot => {
      const table = snapshot.val(),
            players = Object.keys(table.player).map(key => table.player[key]),
            playerBets = players.map(p => p.chips.bet)

      switch (table.turn || 0){
        case Turn.PRE_FLOP:
          // call functions.nextTurn if all called/checked
          const allSameBet = !!playerBets.reduce((a, b) => a === b ? a : NaN),
                allCallCheck = players.every(({ state }) =>
                  [State.CALLED, State.CHECKED].includes(state)
                )

          // call functions.nextTurn
          break
        case Turn.RIVER:
          // call functions.win if none is bet/idle
          break
        default:
          // call functions.nextTurn if all called, or all checked
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
