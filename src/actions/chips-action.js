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
    const chips = getState().chips

    fire.database().ref('chips').set({
      ...chips,
      bet: chips.bet + value,
      total: chips.total - value
    })
  }
}