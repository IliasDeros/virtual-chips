import { getDatabase, onValue, ref, set } from "firebase/database";

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

    // TODO: listen for children added
    // onValue(ref(getDatabase(), playerRef)).on('child_added', data => {
    //   const opponentId = data.key
    //   if (opponentId === player.id) { return }
    //   if (getState().opponents.some(({ id }) => opponentId === id)) { return }

    //   addOpponent(dispatch, data)

    //   fire.database().ref(`${playerRef}/${opponentId}`).on('value', snapshot =>
    //     updateOpponent(dispatch, snapshot, opponentId)
    //   )
    // })
  }
}
