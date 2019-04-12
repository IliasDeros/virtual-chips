'use strict'

const assert = require('assert')
const { calculateSidePots } = require('./calculate-sidepots')
const sinon = require('sinon')

// Debugging: outputs the pots in a way that is easier to read
function logPots(pots, label = 'pots') {
  pots.forEach(p => p.players = p.players.map(({ name }) => name))
  console.log(`${label}: ${JSON.stringify(pots)}`)
}

describe('calculateSidePots', () => {
  describe('Invalid cases', () => {
    let consoleError

    beforeEach(() => {
      consoleError = sinon.stub(console, 'error')
    })

    afterEach(() => {
      consoleError.restore()
    })

    it('should not work for less than two players', () => {
      calculateSidePots([])
      assert.ok(true, 'No error thrown for empty array of players')

      calculateSidePots([1])
      assert.ok(true, 'No error thrown for one player in the list')
    })
  })

  describe('Sidepot 4 players', () => {
    let players, p1, p2, p3, p4

    beforeEach(() => {
      // Initialize 4 players (sorted by total)
      p1 = { name: 'Player 1', chips: { total: 400 } }
      p2 = { name: 'Player 2', chips: { total: 1400 } }
      p3 = { name: 'Player 3', chips: { total: 2000 } }
      p4 = { name: 'Player 4', chips: { total: 5000 } }
      players = [p1, p2, p3, p4]
    })

    it('should create 1 sidepot with the main pot', () => {
      const expectedPots = [
        { pot: 1600, players: players },
        { pot: 1500, players: [p2, p3, p4] }
      ]

      // Player 1 is all-in
      Object.assign(p1.chips, { totalBet: 400, total: 0 })

      // Other players also bet 500 each
      Object.assign(p2.chips, { totalBet: 900, total: 500 })
      Object.assign(p3.chips, { totalBet: 900, total: 1100 })
      Object.assign(p4.chips, { totalBet: 900, total: 4100 })

      const pots = calculateSidePots(players)

      assert.deepEqual(pots, expectedPots, '2 pots calculated as expected')
    })

    it('should create 1 sidepot with 2 called players in the sidepot', () => {
      const expectedPots = [
        { pot: 1600, players: players },
        { pot: 1000, players: [p3, p4] }
      ]

      // Player 1 & 2 are all-in
      Object.assign(p1.chips, { totalBet: 400, total: 0 })
      Object.assign(p2.chips, { totalBet: 400, total: 0 })

      // Other players also bet 500 each
      Object.assign(p3.chips, { totalBet: 900, total: 1100 })
      Object.assign(p4.chips, { totalBet: 900, total: 4100 })

      const pots = calculateSidePots(players)

      assert.deepEqual(pots, expectedPots, '2 pots calculated with a tie in sidepot')
    })
  })
})