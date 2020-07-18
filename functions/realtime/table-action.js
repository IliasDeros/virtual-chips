const { calculateSidePots } = require('../business/calculate-sidepots')

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
       })
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
    return Object.keys(table.player)
      .reduce((hash, id) => {
        const player = table.player[id]

        hash[`player/${id}/chips/bet`] = 0
        hash[`player/${id}/chips/totalBet`] =
          (player.chips.totalBet || 0) + player.chips.bet

        if (player.state !== 'folded'){
          hash[`player/${id}/state`] = 'idle'
        }
      return hash
    }, {})
  }
}

function winRoundUpdates(table){
  const updates = {}

  const players = getPlayers(table)
  const sidepots = calculateSidePots(players)
  const winnerIds = getWinnerIds(table)
  const isWinner = player => winnerIds.includes(player.id)
  const addToTotal = gains => player => {
    const key = `player/${player.id}/chips/total`
    const playerTotal = updates[key] || player.chips.total
    updates[key] = playerTotal + gains
  }

  const distributeSidepotToPlayers = sidepot => {
    const winningPlayers = sidepot.players.filter(isWinner)

    // Distribute pot between winners
    if (winningPlayers.length) {
      winningPlayers.forEach(addToTotal(sidepot.pot / winningPlayers.length))
    }

    // Distribute pot between non-winners
    else {
      sidepot.players.forEach(addToTotal(sidepot.pot / sidepot.players.length))
    }
  }

  sidepots.forEach(distributeSidepotToPlayers)
  Object.assign(updates,
    nextRoundUpdates(table),
    ...players.map(resetPlayerUpdates)
  )

  return updates
}

function nextRoundUpdates({ round }){
  // TODO: Move the player token forward
  return {
    pot: 0,
    round: (round || 0) + 1,
    turn: 0
  }
}

function getPlayers(table) {
  return Object.keys(table.player)
    .map(id => Object.assign({ id }, table.player[id]))
}

function resetPlayerUpdates({ id }){
  const updates = {}
  updates[`player/${id}/chips/bet`] = 0
  updates[`player/${id}/chips/totalBet`] = 0
  updates[`player/${id}/state`] = 'idle'
  return updates
}

function getWinnerIds(table) {
  return Object.keys(table.player).filter(id =>
    table.player[id].state !== 'folded'
  )
}
