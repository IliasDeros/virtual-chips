import State from '../constants/state'

export default function(state = { state: State.IDLE }, action){
  switch (action.type){
    case 'SET_PLAYER_HOST':
      state = {
        ...state,
        host: true
      }
      break
    case 'SET_PLAYER_ID':
      state = {
        ...state,
        id: action.payload
      }
      break
    case 'SET_PLAYER_NAME':
      state = {
        ...state,
        name: action.payload
      }
      break
    case 'SET_PLAYER_STATE':
      state = {
        ...state,
        state: action.payload
      }
      break
    case 'SET_PLAYER_TOKEN':
      state = {
        ...state,
        token: action.payload
      }
    // no default
  }

  return state
}
