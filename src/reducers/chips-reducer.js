export default function(state = false, action){
  switch (action.type){
    case 'SET_CHIPS':
      state = action.payload
      break
    // no default
  }

  return state
}