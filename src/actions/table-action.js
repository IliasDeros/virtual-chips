import fire from '../fire'

function playerIsFirst(getState, players){
  const playerId = getState().player.id
  return Object.keys(players)[0] === playerId
}

export function controlGame(){
  return (dispatch, getState) => {
    // set buttons if unexisting


    // move on to next round


    // call "win"

  }
}

// the game flow is handled by the first player in the table
export function controlGameIfFirst(){
  return (dispatch, getState) => {
    const tableId = getState().table.id

    fire.database().ref(`table/${tableId}/player`).once('value').then(snapshot =>
      playerIsFirst(getState, snapshot.val()) && dispatch(controlGame())
    )
  }
}
