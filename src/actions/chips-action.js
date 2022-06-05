import { getDatabase, runTransaction, onValue, ref, set } from "firebase/database";
import Token from '../constants/token'
import Turn from '../constants/turn'
import { allIn, call } from './player-action'

function getFireRef(endpoint, { player, table }){
  let url = `table/${table.id}/player/${player.id}/${endpoint}`
  return ref(getDatabase(), url)
}

export function watchChips(){
  return (dispatch, getState) => {
    onValue(getFireRef('chips', getState()), snapshot => {
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
        set(getFireRef('chips', state), {
          bet: 0,
          total: 2500
        })
      }
    })
  }
}

export function watchToken(){
  return (dispatch, getState) => {
    onValue(getFireRef('token', getState()), snapshot => {
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

    runTransaction(getFireRef('chips', state), (currentValue = chips) => ({
        ...currentValue,
        bet: currentValue.bet + value,
        total: currentValue.total - value
      })
    )
  }
}

export function addToRaise(value){
  return (dispatch, getState) => {
    const state = getState()
    const { chips } = state

    const raise = (chips.raise || 0) + value

    dispatch({
      type: 'SET_CHIPS',
      payload: {
        ...chips,
        raise
      }
    })
  }
}

export function callBet(){
  return (dispatch, getState) => {
    const state = getState(),
          { chips, opponents } = state

    const betToCall = Math.max(...opponents.map(p => p.chips.bet))

    runTransaction(getFireRef('chips', state), (currentValue = chips) => {
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

export function allInBet(){
  return (dispatch, getState) => {
    const state = getState(),
          { chips } = state

    runTransaction(getFireRef('chips', state), (currentValue = chips) => {
      const { bet, total } = currentValue,
            totalBet = total + bet

      return {
        ...currentValue,
        bet: totalBet,
        total: 0
      }
    }, function onComplete(_, commited, snapshot){
      commited && dispatch(allIn())
    })
  }
}

