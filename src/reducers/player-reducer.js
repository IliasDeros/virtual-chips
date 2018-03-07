export default function(state = {}, action){
  switch (action.type){
    case 'SET_PLAYER_ID':
      state = {
        ...state,
        id: action.payload
      }
      break
    // no default
  }

  return state
}