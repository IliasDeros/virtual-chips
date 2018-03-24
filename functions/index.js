const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

exports.progressRounds = functions.database.ref('table/{tableId}/action').onWrite(event => {
  // Exit when the data is deleted.
  if (!event.data.exists()) { return null }

  const action = event.data.val(),
        tableRef = event.data.ref.parent

  switch (action){
    case 'next round':
      nextRound(tableRef)
      break
    default:
      console.error(`Unexpected action ${action}. Available actions: ['next round']`)
  }

  return action
})

function nextRound(tableRef){
  tableRef.once('value').then(snapshot => {
    const table = snapshot.val()
    
    increasePot(tableRef, table)
    resetPlayerBets(tableRef, table)
    
    return tableRef.child('action').remove()
  }).catch(error => console.error('Error reading "table"', error))
}

function increasePot(tableRef, { player, pot = 0 }){
  const bets = Object.keys(player).reduce((sum, id) => 
    sum + player[id].chips.bet
  , 0)
  
  return tableRef.child('pot').set(bets + pot)
}

function resetPlayerBets(tableRef, { player }){
  const playerUpdates = Object.keys(player).reduce((hash, id) => {
    hash[`player/${id}/chips/bet`] = 0
    return hash
  }, {})
  
  tableRef.update(playerUpdates)
}