'use strict'

const assert = require('assert')
const action = require('./table-action')
const tableAction = action.onWrite
const sinon = require('sinon')

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
        let valueStub
        
        beforeEach(() => {
            valueStub = sinon.stub()
            fakeWriteEvent.data.val = () => 'next turn'
            fakeTableRef.once = sinon.stub().withArgs('value')
                .resolves({ val: valueStub })
        })
        
        it('should update initial turn', done => {
            valueStub.returns({
                player: {
                    'first': { chips: { bet: 100 } },
                    'second': { chips: { bet: 150 } }
                }
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/bet': 0,
                    'player/second/chips/bet': 0,
                    'player/first/state': 'idle',
                    'player/second/state': 'idle',
                    pot: 250,
                    turn: 1
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
        
        it('should update second turn', done => {
            valueStub.returns({
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
                    'player/first/state': 'idle',
                    'player/second/state': 'idle',
                    pot: 350,
                    turn: 2
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
    })
})