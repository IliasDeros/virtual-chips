import fire from '../fire'

function onUpdate(snapshot, dispatch, player){
  const opponents = snapshot.val()

  delete opponents[player.id]

  dispatch({
    type: 'SET_OPPONENTS',
    payload: opponents
  })
}

export function watchOpponents(){
  return (dispatch, getState) => {
    const { player, table } = getState()

    fire.database().ref(`table/${table.id}/player`).once('value').then(snapshot =>
      onUpdate(snapshot, dispatch, player)
    )
  }
}