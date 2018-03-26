import fire from '../fire'
import { allIn, call, idle } from './player-action'

function getChipsRef({ player, table }){
  let ref = `table/${table.id}/player/${player.id}/chips`
  return fire.database().ref(ref)
}

export function watchChips(){
  return (dispatch, getState) => {
    getChipsRef(getState()).on('value', snapshot => {
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
        getChipsRef(state).set({
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

    getChipsRef(state).transaction((currentValue = chips) => ({
        ...currentValue,
        bet: currentValue.bet + value,
        total: currentValue.total - value
      })
    )
  }
}

export function callBet(){
  return (dispatch, getState) => {
    const state = getState(),
          { chips, opponents } = state

    const betToCall = Math.max(...opponents.map(p => p.chips.bet))

    getChipsRef(state).transaction((currentValue = chips) => {
      const { bet, total } = currentValue,
            amountMissingForCall = betToCall - bet,
            betAmount = Math.min(total, amountMissingForCall)

      return {
        ...currentValue,
        bet: currentValue.bet + betAmount,
        total: currentValue.total - betAmount
      }
    }, function onComplete(_, commited, snapshot){
      const { bet } = snapshot.val()
      commited && dispatch(bet < betToCall ? allIn() : call())
    })
  }
}