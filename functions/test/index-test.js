const assert = require('assert')
const indexFunctions = require('../index')
const functions = require('firebase-functions')

describe('index', () => {
  describe('progressRounds', () => {
    beforeEach(() => {
      this.fakeEvent = {
        data: new functions.database.DeltaSnapshot(null, null, null, 'input')
      }
    })

    it('should be defined', () => {
      assert.ok(indexFunctions.progressRounds, 'is true')
    })
  })
})