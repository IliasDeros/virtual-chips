export default function(state = false, action){
  switch (action.type){
    case 'SET_OPPONENTS':
      const opponents = action.payload && Object.keys(action.payload).map(id => ({
        ...action.payload[id],
        id
      }))
      state = opponents
      break
    // no default
  }

  return state
}