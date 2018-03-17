import fire from '../fire'

function getFireRef({ player, table }){
  let ref = `table/${table.id}/player/${player.id}/chips`
  return fire.database().ref(ref)
}

export function watchChips(){
  return (dispatch, getState) => {
    const state = getState()

    getFireRef(state).on('value', snapshot => {
      const chips = snapshot.val()

      if (chips){
        dispatch({
          type: 'SET_CHIPS',
          payload: chips
        })
      } else {
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