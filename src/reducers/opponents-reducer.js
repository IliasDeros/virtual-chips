export default function(state = [], action){
  switch (action.type){
    case 'ADD_OPPONENT':
      state = [...state, action.payload]
      break
    case 'UPDATE_OPPONENT':
      const id = action.payload.id

      state = state.reduce((opponents, opponent) =>
        opponents.concat(opponent.id === id ? action.payload : opponent)
      , [])
      break
    // no default
  }

  return state
}