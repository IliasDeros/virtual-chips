import fire from '../fire'

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
        payload: snapshot.val()
      })
    })

    // watch turn
    getTableRef(id, 'turn').on('value', snapshot => {
      dispatch({
        type: 'SET_TURN',
        payload: snapshot.val()
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