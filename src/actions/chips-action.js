import fire from '../fire'

export function watchChips(){
  return dispatch => {
    fire.database().ref('chips').on('value', snapshot => {
      dispatch({
        type: 'SET_CHIPS',
        payload: snapshot.val()
      })
    })
  }
}

export function addToBet(value){
  return (_, getState) => {
    let { bet, total } = getState().chips

    fire.database().ref('chips/bet').set(bet + value)
    fire.database().ref('chips/total').set(total - value)
  }
}