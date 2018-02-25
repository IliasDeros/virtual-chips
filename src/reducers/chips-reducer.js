export default function(state = 0, action){
  switch (action.type){
    case 'SET_BET':
      state = action.payload
      break
    // no default
  }

  return state
}