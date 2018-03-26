export default function(state = { id: 'default' }, action){
  switch (action.type){
    case 'SET_POT':
      state = {
        ...state,
        pot: action.payload
      }
      break
    case 'SET_TURN':
      state = {
        ...state,
        turn: action.payload
      }
      break
    // no default
  }

  return state
}