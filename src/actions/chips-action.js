import fire from '../fire'
import Token from '../constants/token'
import Turn from '../constants/turn'
import { allIn, call } from './player-action'

function getFireRef(endpoint, { player, table }){
  let ref = `table/${table.id}/player/${player.id}/${endpoint}`
  return fire.database().ref(ref)
}

export function watchChips(){
  return (dispatch, getState) => {
    getFireRef('chips', getState()).on('value', snapshot => {
      const chips = snapshot.val(),
            state = getState()

      if (chips){
        // update chips
        dispatch({
          type: 'SET_CHIPS',
          payload: chips
        })
      } else {
        // initialize chips
        getFireRef('chips', state).set({
          bet: 0,
          total: 2500
        })
      }
    })
  }
}

export function watchToken(){
  return (dispatch, getState) => {
    getFireRef('token', getState()).on('value', snapshot => {
      const state = getState(),
            currentBet = state.chips.bet || 0

      if (state.table.turn !== Turn.PRE_FLOP){ return }

      let bet

      switch (snapshot.val()){
        case Token.DEALER_SMALL:
        case Token.SMALL_BLIND:
          bet = 100
          break
        case Token.BIG_BLIND:
          bet = 200
          break
        default:
          bet = 0
      }

      addToBet(bet - currentBet)(dispatch, getState)
    })
  }
}

export function addToBet(value){
  return (_, getState) => {
    const state = getState(),
          chips = state.chips

    getFireRef('chips', state).transaction((currentValue = chips) => ({
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

    getFireRef('chips', state).transaction((currentValue = chips) => {
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