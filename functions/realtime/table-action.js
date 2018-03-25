/*
* do things when the table's "action" is updated
*/
exports.onWrite = writeEvent => {
  // Exit when the data is deleted.
  if (!writeEvent.data.exists()) { return null }

  const action = writeEvent.data.val(),
        tableRef = writeEvent.data.ref.parent
  
  switch (action){
    case 'next round':
      tableRef.once('value')
        .then(snapshot => {
          tableRef.update(nextRoundUpdates(snapshot.val()))
          return tableRef.child('action').remove()
        })
        .catch(error => console.error('Error reading "table":', error.stack))
      break
    default:
      throw new Error(`Unexpected action ${action}. Available actions: ['next round']`)
  }
  
  return action
}

function nextRoundUpdates(table){
  const updates = makePlayerUpdatesHash(table)
  updates.round = (table.round || 0) + 1
  updates.pot = makePotUpdate(table)
  return updates
}

function makePotUpdate(table){
  const player = table.player,
        bets = Object.keys(player).reduce((sum, id) => 
          sum + player[id].chips.bet
        , 0)
  
  return bets + (table.pot || 0)
}

function makePlayerUpdatesHash(table){
  return Object.keys(table.player).reduce((hash, id) => {
    hash[`player/${id}/chips/bet`] = 0
    return hash
  }, {})
}