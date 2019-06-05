'use strict'

const assert = require('assert')
const { calculateSidePots } = require('./calculate-sidepots')
const sinon = require('sinon')

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

  describe('1 main pot', () => {
    let players, p1, p2

    beforeEach(() => {
      p1 = { name: 'Player 1', chips: { totalBet: 500, total: 600 } }
      p2 = { name: 'Player 2', chips: { totalBet: 500, total: 1000 } }
      players = [p1, p2]
    })

    it('should create 1 pot', () => {
      const expectedPots = [{ pot: 1000, players }]
      const pots = calculateSidePots(players)
      assert.deepEqual(expectedPots, pots, 'only 1 main pot')
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
        { pot: 1600, players },
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

    it('should create sidepots for 2 tied players', () => {
      const expectedPots = [
        { pot: 800, players },
        { pot: 800, players: [p3, p4] },
        { pot: 200, players: [p2, p4] }
      ]

      // Player 1 & 3 are tied
      Object.assign(p1.chips, { totalBet: 200, total: 0 })
      Object.assign(p3.chips, { totalBet: 600, total: 0 })

      // Player 2 & 4 are folded
      Object.assign(p2.chips, { totalBet: 400, total: 999 })
      Object.assign(p4.chips, { totalBet: 600, total: 9999 })

      const pots = calculateSidePots(players)

      assert.deepEqual(pots, expectedPots)
    })

    it('should create 2 sidepots with 2 called players in the main pot', () => {
      // Add a 5th player
      const p5 = { name: 'Player 5', chips: { total: 0 } }
      players.push(p5)

      const expectedPots = [
        { pot: 2000, players: players },
        { pot: 600, players: [p3, p4, p5] },
        { pot: 800, players: [p4, p5] }
      ]

      // Player 1, 2 & 3 are all-in
      Object.assign(p1. chips, { totalBet: 400, total: 0 })
      Object.assign(p2.chips, { totalBet: 400, total: 0 })
      Object.assign(p3.chips, { totalBet: 600, total: 0 })

      // Player 4 called
      Object.assign(p4.chips, { totalBet: 1000, total: 100 })
      Object.assign(p5.chips, { totalBet: 1000, total: 200 })

      const pots = calculateSidePots(players)

      assert.deepEqual(pots, expectedPots, '1 tied side pot, 1 sidepot and 1 main pot')
    })
  })
})