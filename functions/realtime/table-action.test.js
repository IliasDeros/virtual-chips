'use strict'

const assert = require('assert')
const action = require('./table-action')
const tableAction = action.onWrite
const sinon = require('sinon')

let actionStub

const fakeTableRef = {
        child: sinon.stub().returns({ remove: function(){} })
    },
    fakeWriteEvent = {
        data: {
            exists: () => true,
            val: () => 'testing',
            ref: { parent: fakeTableRef }
        }
    }

describe('tableAction', () => {
    describe('unsupported action', () => {
        beforeEach(() => fakeWriteEvent.val = () => 'testing')

        it('should throw error', () => {
            assert.throws(() => tableAction(fakeWriteEvent))
        })
    })

    describe('next turn', () => {
        beforeEach(() => {
            actionStub = sinon.stub()
            fakeWriteEvent.data.val = () => 'next turn'
            fakeTableRef.once = sinon.stub().withArgs('value')
                .resolves({ val: actionStub })
        })

        it('should update initial turn', done => {
            actionStub.returns({
                player: {
                    'first': { chips: { bet: 100 } },
                    'second': { chips: { bet: 150 } }
                }
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/bet': 0,
                    'player/first/chips/totalBet': 100,
                    'player/first/state': 'idle',
                    'player/second/chips/bet': 0,
                    'player/second/chips/totalBet': 150,
                    'player/second/state': 'idle',
                    pot: 250,
                    turn: 1
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })

        it('should update second turn', done => {
            actionStub.returns({
                player: {
                    'first': { chips: { bet: 100, totalBet: 100 } },
                    'second': { chips: { bet: 150, totalBet: 100 } }
                },
                pot: 100,
                turn: 1,
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/bet': 0,
                    'player/first/chips/totalBet': 200,
                    'player/first/state': 'idle',
                    'player/second/chips/bet': 0,
                    'player/second/chips/totalBet': 250,
                    'player/second/state': 'idle',
                    pot: 350,
                    turn: 2
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })

        it('should leave players folded', done => {
            actionStub.returns({
                player: {
                    'first': { chips: { bet: 100 } },
                    'second': { chips: { bet: 150 } },
                    'third': { chips: { bet: 300 }, state: 'folded' }
                },
                pot: 100,
                turn: 1,
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/bet': 0,
                    'player/first/chips/totalBet': 100,
                    'player/first/state': 'idle',
                    'player/second/chips/bet': 0,
                    'player/second/chips/totalBet': 150,
                    'player/second/state': 'idle',
                    'player/third/chips/bet': 0,
                    'player/third/chips/totalBet': 300,
                    pot: 650,
                    turn: 2
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
    })

    describe('win round', () => {
        beforeEach(() => {
            actionStub = sinon.stub()
            fakeWriteEvent.data.val = () => 'win round'
            fakeTableRef.once = sinon.stub().withArgs('value')
                .resolves({ val: actionStub })
        })

        it('first player should win round', done => {
            actionStub.returns({
                player: {
                    'first': { state: 'idle', chips: { totalBet: 1000, total: 200 } },
                    'second': { state: 'folded', chips: { totalBet: 500, total: 500 } }
                },
                pot: 2000,
                turn: 2,
                round: 0
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/total': 1700,   // player total + totalBets
                    pot: 0,
                    round: 1,
                    turn: 0,
                    'player/first/chips/bet': 0,
                    'player/first/chips/totalBet': 0,
                    'player/first/state': 'idle',
                    'player/second/chips/bet': 0,
                    'player/second/chips/totalBet': 0,
                    'player/second/state': 'idle',
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })

        it('should win round tied', done => {
            actionStub.returns({
                player: {
                    'first': { state: 'tied', chips: { totalBet: 1000, total: 200 } },
                    'second': { state: 'tied', chips: { totalBet: 1000, total: 500 } },
                    'third': { state: 'tied', chips: { totalBet: 1000, total: 800 } },
                    'fourth': { state: 'folded', chips: { totalBet: 0, total: 1000 } }
                },
                pot: 3000,
                turn: 3,
                round: 0
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/total': 1200,  // totalBet + total
                    'player/second/chips/total': 1500,
                    'player/third/chips/total': 1800,
                    pot: 0,
                    round: 1,
                    turn: 0,
                    'player/first/chips/bet': 0,
                    'player/first/chips/totalBet': 0,
                    'player/first/state': 'idle',
                    'player/second/chips/bet': 0,
                    'player/second/chips/totalBet': 0,
                    'player/second/state': 'idle',
                    'player/third/chips/bet': 0,
                    'player/third/chips/totalBet': 0,
                    'player/third/state': 'idle',
                    'player/fourth/chips/bet': 0,
                    'player/fourth/chips/totalBet': 0,
                    'player/fourth/state': 'idle',
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })

        it('should distribute side-pots between two ties', done => {
          actionStub.returns({
                player: {
                    'first': { name: 'Player 1', state: 'tied', chips: { totalBet: 200, total: 0 } },
                    'second': { name: 'Player 2', state: 'folded', chips: { totalBet: 400, total: 1 } },
                    'third': { name: 'Player 3', state: 'tied', chips: { totalBet: 600, total: 0 } },
                    'fourth': { name: 'Player 4', state: 'folded', chips: { totalBet: 600, total: 1 } }
                },
                pot: 1800,
                turn: 3,
                round: 0
            })

            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/total': 400,
                    'player/third/chips/total': 1200,
                    'player/second/chips/total': 101,
                    'player/fourth/chips/total': 101,
                    pot: 0,
                    round: 1,
                    turn: 0,
                    'player/first/chips/bet': 0,
                    'player/first/chips/totalBet': 0,
                    'player/first/state': 'idle',
                    'player/second/chips/bet': 0,
                    'player/second/chips/totalBet': 0,
                    'player/second/state': 'idle',
                    'player/third/chips/bet': 0,
                    'player/third/chips/totalBet': 0,
                    'player/third/state': 'idle',
                    'player/fourth/chips/bet': 0,
                    'player/fourth/chips/totalBet': 0,
                    'player/fourth/state': 'idle',
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
    })
})