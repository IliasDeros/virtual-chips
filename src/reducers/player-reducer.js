export default function(state = {}, action){
  switch (action.type){
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
    // no default
  }

  return state
}