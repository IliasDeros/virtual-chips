import fire from '../fire'
import { idle } from './player-action'

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
        // update player state
        if (state.chips){
          chips.bet === 0 && dispatch(idle())
        }

        // update chips
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

    getFireRef(state).transaction((currentValue = chips) => ({
        ...currentValue,
        bet: currentValue.bet + value,
        total: currentValue.total - value
      })
    )
  }
}