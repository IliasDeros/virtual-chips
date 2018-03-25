import Fingerprint from 'fingerprintjs2'
import fire from '../fire'
import State from '../constants/state'

function getFireRef(endpoint, { table, player }){
  let ref = `table/${table.id}/player/${player.id}/${endpoint}`
  return fire.database().ref(ref)
}

export function loadPlayerId(){
  return (dispatch, getState) => {
    new Fingerprint().get(result =>
      dispatch({
          type: 'SET_PLAYER_ID',
          payload: result
        })
    )
  }
}

export function loadPlayerName(){
  return (dispatch, getState) => {
    const state = getState()

    getFireRef('name', state).on('value', async snapshot => {
      let playerName = snapshot.val()

      if (playerName){
        dispatch({
          type: 'SET_PLAYER_NAME',
          payload: playerName
        })
      } else {
        // generate a random player name
        let res = await fetch('https://cors-anywhere.herokuapp.com/http://namey.muffinlabs.com/name.json')
        const [name] = await res.json()

        getFireRef('name', state).set(name)
      }
    })
  }
}

export function loadPlayerState(){
  return (dispatch, getState) => {
    const state = getState()

    getFireRef('state', state).on('value', snapshot => {
      let playerState = snapshot.val()

      if (playerState){
        dispatch({
          type: 'SET_PLAYER_STATE',
          payload: playerState
        })
      } else {
        getFireRef('state', state).set(State.IDLE)
      }
    })
  }
}

export function bet(){
  return (_, getState) => {
    getFireRef('state', getState()).set(State.BET)
  }
}

export function fold(){
  return (_, getState) => {
    getFireRef('state', getState()).set(State.FOLDED)
  }
}

export function idle(){
  return (_, getState) => {
    getFireRef('state', getState()).set(State.IDLE)
  }
}