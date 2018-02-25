import { database } from '../fire'

export function watchChips(){
  return dispatch => {
    database.ref('chips').on('value', snapshot => {
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

    database.ref('chips/bet').set(bet + value)
    database.ref('chips/total').set(total - value)
  }
}