import fire from '../fire'
import { bet, idle } from './player-action'

function getFireRef({ player, table }){
  let ref = `table/${table.id}/player/${player.id}/chips`
  return fire.database().ref(ref)
}

export function watchChips(){
  return (dispatch, getState) => {
    getFireRef(getState()).on('value', snapshot => {
      const chips = snapshot.val(),
            state = getState()

      if (chips){
        if (state.chips){
          dispatch(chips.bet > 0 ? bet() : idle())
        }

        dispatch({
          type: 'SET_CHIPS',
          payload: chips
        })
      } else {
        // initialize chips
        getFireRef(state).set({
          bet: 0,
          total: 2500
        })
      }
    })
  }
}

export function addToBet(value){
  return (_, getState) => {
    const state = getState(),
          chips = state.chips

    getFireRef(state).set({
      ...chips,
      bet: chips.bet + value,
      total: chips.total - value
    })
  }
}