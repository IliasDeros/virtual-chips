import fire from '../fire'

function updateChips(newValue){
  fire.database().ref('chips').set(newValue)
}

export default function(state = 0, action){
  switch (action.type){
    case 'SET':
      state = action.payload
      break
    case 'ADD_TO_BET':
      state += action.payload
      break
    // no default
  }

  updateChips(state)

  return state
}