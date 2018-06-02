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
                    'player/second/chips/bet': 0,
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
                    'first': { chips: { bet: 100 } },
                    'second': { chips: { bet: 150 } }
                },
                pot: 100,
                turn: 1,
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/bet': 0,
                    'player/second/chips/bet': 0,
                    pot: 350,
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

        it('should win round', done => {
            actionStub.returns({
                player: {
                    'first': { state: 'idle', chips: { bet: 100, total: 200 } },
                    'second': { state: 'folded', chips: { bet: 500, total: 500 } }
                },
                pot: 2000,
                turn: 2,
                round: 0
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/total': 2800,   // pot + bets
                    pot: 0,
                    round: 1,
                    turn: 0,
                    'player/first/bet': 0,
                    'player/first/state': 'idle',
                    'player/second/bet': 0,
                    'player/second/state': 'idle',
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
    })
})