import fire from '../fire'

function addOpponent(dispatch, data){
  const id = data.key

  dispatch({
    type: 'ADD_OPPONENT',
    payload: {
      ...data.val(),
      id
    }
  })
}

function updateOpponent(dispatch, snapshot, id){
  dispatch({
    type: 'UPDATE_OPPONENT',
    payload: { ...snapshot.val(), id }
  })
}

export function watchOpponents(){
  return (dispatch, getState) => {
    const { player, table } = getState(),
          playerRef = `table/${table.id}/player`

    fire.database().ref(playerRef).on('child_added', data => {
      const opponentId = data.key
      if (opponentId === player.id) { return }

      addOpponent(dispatch, data)

      fire.database().ref(`${playerRef}/${opponentId}`).on('value', snapshot =>
        updateOpponent(dispatch, snapshot, opponentId)
      )
    })
  }
}