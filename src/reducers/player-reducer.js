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
    // no default
  }

  return state
}