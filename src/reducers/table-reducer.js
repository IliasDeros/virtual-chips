const initialState = {
  id: 'default',
  pot: 0
}

export default function(state = initialState, action){
  switch (action.type){
    case 'SET_ACTION':
      state = {
        ...state,
        action: action.payload
      }
      break
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