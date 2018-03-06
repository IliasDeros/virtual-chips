import fire from '../fire'

export function watchChips(){
  return (dispatch, getState) => {
    const playerId = getState().table.playerId

    fire.database().ref(`player/${playerId}/chips`).on('value', snapshot => {
      const chips = snapshot.val()

      if (chips){
        dispatch({
          type: 'SET_CHIPS',
          payload: chips
        })
      } else {
        fire.database().ref(`player/${playerId}/chips`).set({
          bet: 0,
          total: 2500
        })
      }
    })
  }
}

export function addToBet(value){
  return (_, getState) => {
    const { chips, table } = getState()

    fire.database().ref(`player/${table.playerId}/chips`).set({
      ...chips,
      bet: chips.bet + value,
      total: chips.total - value
    })
  }
}