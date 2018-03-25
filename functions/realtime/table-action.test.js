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
    
    describe('next round', () => {
        let valueStub
        
        beforeEach(() => {
            valueStub = sinon.stub()
            fakeWriteEvent.data.val = () => 'next round'
            fakeTableRef.once = sinon.stub().withArgs('value')
                .resolves({ val: valueStub })
        })
        
        it('should update initial round', done => {
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
                    pot: 250,
                    round: 1
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
        
        it('should update second round', done => {
            valueStub.returns({
                player: {
                    'first': { chips: { bet: 100 } },
                    'second': { chips: { bet: 150 } }
                },
                pot: 100,
                round: 1,
            })
            fakeTableRef.update = payload => {
                assert.deepStrictEqual(payload, {
                    'player/first/chips/bet': 0,
                    'player/second/chips/bet': 0,
                    pot: 350,
                    round: 2
                })
                done()
            }
            tableAction(fakeWriteEvent)
        })
    })
})