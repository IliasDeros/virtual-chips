import Fingerprint from 'fingerprintjs2'

export function loadPlayerId(){
  return (dispatch, getState) => {
    new Fingerprint().get(result => {
      dispatch({
          type: 'SET_PLAYER_ID',
          payload: result
        })})
  }
}
