import { getDatabase, onValue, ref, set } from "firebase/database";
import Turn from '../constants/turn'

function getTableRef(id, path){
  let url = `table/${id}/${path}`
  const db = getDatabase();
  return ref(db, url)
}

export function watchTable(id = 'default'){
  return (dispatch, getState) => {
    // watch action
    onValue(getTableRef(id, 'action'), snapshot => {
      dispatch({
        type: 'SET_ACTION',
        payload: snapshot.val()
      })
    })

    // watch pot
    onValue(getTableRef(id, 'pot'), snapshot => {
      dispatch({
        type: 'SET_POT',
        payload: snapshot.val() || 0
      })
    })

    // watch turn
    onValue(getTableRef(id, 'turn'), snapshot => {
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
    const db = getDatabase()
    const url = `table/${table.id}/action`
    set(ref(db, url), action)
  }
}
