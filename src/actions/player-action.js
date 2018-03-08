import Fingerprint from 'fingerprintjs2'
import fire from '../fire'

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
    const { player, table } = getState(),
          nameRef = `table/${table.id}/player/${player.id}/name`

    fire.database().ref(nameRef).on('value', snapshot => {
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
          .then(([name]) => fire.database().ref(nameRef).set(name))
      }
    })
  }
}