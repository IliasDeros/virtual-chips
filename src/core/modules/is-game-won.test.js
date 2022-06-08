import isGameWon from './is-game-won'
import State from '../constants/state'

describe('isGameWon', () => {
    let table

    describe('truthy', () => {
      beforeEach(() => { table = {} })
      afterEach(() => expect(isGameWon(table)).toBeTruthy())

      it('should be won when all other players are folded', () => {
        table.player = {
          0: { state: State.FOLDED },
          1: { state: State.IDLE }
        }
      })

      it('should be won when all players are tied', () => {
        table.player = {
          0: { state: State.TIED },
          1: { state: State.TIED }
        }
      })

      it('should be won when all remaining players are tied', () => {
        table.player = {
          0: { state: State.TIED },
          1: { state: State.TIED },
          2: { state: State.FOLDED }
        }
      })
    })

    describe('falsy', () => {
      beforeEach(() => { table = {} })
      afterEach(() => expect(isGameWon(table)).toBeFalsy())

      it('when not all players folded', () => {
        table.player = {
          0: { state: State.IDLE },
          1: { state: State.IDLE },
          2: { state: State.FOLDED }
        }
      })

      it('when not all players tied', () => {
        table.player = {
          0: { state: State.TIED },
          1: { state: State.IDLE }
        }
      })

      it('when there is only 1 player', () => {
        table.player = { 0: { state: State.TIED } }
      })
    })
})