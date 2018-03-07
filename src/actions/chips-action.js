import fire from '../fire'

export function watchChips(){
  return (dispatch, getState) => {
    const { player, table } = getState(),
          ref = `table/${table.id}/player/${player.id}/chips`

    fire.database().ref(ref).on('value', snapshot => {
      const chips = snapshot.val()

      if (chips){
        dispatch({
          type: 'SET_CHIPS',
          payload: chips
        })
      } else {
        fire.database().ref(ref).set({
          bet: 0,
          total: 2500
        })
      }
    })
  }
}

export function addToBet(value){
  return (_, getState) => {
    const { chips, player, table } = getState()

    fire.database().ref(`table/${table.id}/player/${player.id}/chips`).set({
      ...chips,
      bet: chips.bet + value,
      total: chips.total - value
    })
  }
}