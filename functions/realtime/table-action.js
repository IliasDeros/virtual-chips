/*
* do things when the table's "action" is updated
*/

const ACTION_UPDATE = {
  'next turn': nextTurnUpdates,
  'win round': winRoundUpdates
}

exports.onWrite = writeEvent => {
  // Exit when the data is deleted.
  if (!writeEvent.data.exists()) { return null }

  const action = writeEvent.data.val(),
        tableRef = writeEvent.data.ref.parent,
        actionUpdate = ACTION_UPDATE[action]

  if (actionUpdate){
    tableRef.once('value')
      .then(snapshot => {
          tableRef.update(actionUpdate(snapshot.val()))
          return tableRef.child('action').remove()
        }, error => console.error('Error reading table:', error.stack))
      .catch(error => console.error('Error updating table', error.stack))
  } else {
    const availableActions = `[${Object.keys(ACTION_UPDATE).join(',')}]`
    throw new Error(`Unexpected action ${action}. Available actions: ${availableActions}`)
  }

  return action
}

function nextTurnUpdates(table){
  const updates = makePlayerUpdatesHash(table)
  updates.turn = (table.turn || 0) + 1
  updates.pot = makePotUpdate(table)
  return updates

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
      hash[`player/${id}/state`] = 'idle'
      return hash
    }, {})
  }
}

function winRoundUpdates(table){
  const updates = {}

  // give bets + pot to unfolded player
  const unfoldedId = Object.keys(table.player).find(id => {
          let player = table.player[id]
          return player.state !== 'folded'
        }),
        playerTotal = table.player[unfoldedId].chips.total,
        tableTotal = Object.keys(table.player).reduce((total, id) => {
            let playerBet = table.player[id].chips.bet
            return total + playerBet
        }, table.pot || 0)
  updates[`player/${unfoldedId}/chips/total`] = playerTotal + tableTotal

  // proceed table to next round
  Object.assign(updates, {
    pot: 0,
    round: (table.round || 0) + 1,
    turn: 0
  })

  // reset players
  Object.keys(table.player).forEach(id => {
    updates[`player/${id}/chips/bet`] = 0
    updates[`player/${id}/state`] = 'idle'
  })

  return updates
}