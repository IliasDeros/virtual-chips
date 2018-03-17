import Fingerprint from 'fingerprintjs2'
import fire from '../fire'

function getFireRef({ table, player }){
  let ref = `table/${table.id}/player/${player.id}/name`
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

    getFireRef(state).on('value', snapshot => {
      let playerName = snapshot.val()

      if (playerName){
        dispatch({
          type: 'SET_PLAYER_NAME',
          payload: playerName
        })
      } else {
        // generate a random player name
        fetch('https://cors-anywhere.herokuapp.com/http://namey.muffinlabs.com/name.json')
          .then(res => res.json())
          .then(([name]) => getFireRef(state).set(name))
      }
    })
  }
}