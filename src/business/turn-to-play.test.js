import turnToPlay from './turn-to-play'
import State from '../constants/state'
import Token from '../constants/token'
import isTurnFinished from './is-turn-finished'

jest.mock('./is-turn-finished', () => jest.fn())

describe('turnToPlay', () => {
  let table

  beforeEach(() => {
    isTurnFinished.mockReturnValue(false)
    table = {
      round: 1 // Index of the dealer
    }
  })

  describe('on first round', () => {
    it('returns the dealer in a heads up', () => {
      table.player = {
        'big blind': { token: Token.BIG_BLIND },
        'dealer': { token: Token.DEALER_SMALL },
      }
      expect(turnToPlay(table)).toEqual('dealer')
    })

    it('returns the player after the big blind', () => {
      table.player = {
        'index 0': {},
        'dealer': { token: Token.DEALER },
        'small blind': { token: Token.SMALL_BLIND },
        'big blind': { token: Token.BIG_BLIND },
        'under the gun': {}
      }
      expect(turnToPlay(table)).toEqual('under the gun')
    })

    it('returns the player after big blind, wrapping', () => {
      table.player = {
        'under the gun': {},
        'dealer': { token: Token.DEALER },
        'small blind': { token: Token.SMALL_BLIND },
        'big blind': { token: Token.BIG_BLIND }
      }
      expect(turnToPlay(table)).toEqual('under the gun')
    })

    it('returns the first available player after big blind', () => {
      table.player = {
        'under the gun FOLDED': { state: State.FOLDED },
        'under the gun': {},
        'dealer': { token: Token.DEALER },
        'small blind': { token: Token.SMALL_BLIND },
        'big blind': { state: State.FOLDED }
      }
      expect(turnToPlay(table)).toEqual('under the gun')
    })
  })

  describe('post-flop', () => {
    beforeEach(() => {
      table.turn = 1
    })

    it('returns the player on left of dealer in heads-up', () => {
      Object.assign(table, {
        player: {
          'dealer': { token: Token.DEALER },
          'big blind': { token: Token.BIG_BLIND },
        },
        round: 0
      })
      expect(turnToPlay(table)).toEqual('big blind')
    })

    it('returns the small blind', () => {
      table.player = {
        'player 0': {},
        'dealer': { token: Token.DEALER },
        'small blind': { token: Token.SMALL_BLIND },
        'big blind': { token: Token.BIG_BLIND },
        'under the gun': {}
      }
      expect(turnToPlay(table)).toEqual('small blind')
    })

    it('returns the small blind, wrapping', () => {
      Object.assign(table, {
        player: {
          'small blind': { token: Token.SMALL_BLIND },
          'big blind': { token: Token.BIG_BLIND },
          'dealer': { token: Token.DEALER }
        },
        round: 2
      })
      expect(turnToPlay(table)).toEqual('small blind')
    })

    it('returns the first available player after dealer', () => {
      Object.assign(table, {
        player: {
          'small blind': { state: State.FOLDED },
          'big blind': { token: Token.BIG_BLIND },
          'dealer': { token: Token.DEALER }
        },
        round: 2
      })
      expect(turnToPlay(table)).toEqual('big blind')
    })
  })

  describe.skip('after a player move', () => {
    it('returns player following a check', () => {
      table.player = {
        'player 0': { name: 'player 0' },
        'player 1': { name: 'dealer' },
        'player 2': { name: 'small blind' },
        'player 3': { name: 'big blind' },
        'player 4': { name: 'under the gun', state: State.CHECKED }
      }
      expect(turnToPlay(table)).toEqual('player 0')
    })

    // following a check

    // following a raise

    // following a re-raise
  })

  it('returns null when turn is finished', () => {
    isTurnFinished.mockReturnValue(true)
    expect(turnToPlay(table)).toBeNull()
  })
})
