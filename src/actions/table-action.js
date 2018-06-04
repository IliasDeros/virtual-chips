import fire from '../fire'
import Turn from '../constants/turn'

function getTableRef(id, path){
  let ref = `table/${id}/${path}`
  return fire.database().ref(ref)
}

export function watchTable(id = 'default'){
  return (dispatch, getState) => {
    // watch action
    getTableRef(id, 'action').on('value', snapshot => {
      dispatch({
        type: 'SET_ACTION',
        payload: snapshot.val()
      })
    })

    // watch pot
    getTableRef(id, 'pot').on('value', snapshot => {
      dispatch({
        type: 'SET_POT',
        payload: snapshot.val() || 0
      })
    })

    // watch turn
    getTableRef(id, 'turn').on('value', snapshot => {
      dispatch({
        type: 'SET_TURN',
        payload: snapshot.val() || Turn.PRE_FLOP
      })
    })
  }
}

export function setAction(action){
  return (dispatch, getState) => {
    const table = getState().table
    fire.database().ref(`table/${table.id}/action`).set(action)
  }
}