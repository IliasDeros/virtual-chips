import { database } from '../fire'

export function fetchChips(){
  return dispatch => {
    database.ref('chips').on('value', snapshot => {
      dispatch({
        type: 'SET_BET',
        payload: snapshot.val()
      })
    })
  }
}

export function addToBet(payload){
  return (_, getState) => {
    let chips = getState().chips
    database.ref('chips').set(chips + payload)
  }
}