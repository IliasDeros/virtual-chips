import Turn from '../constants/turn'
import Token from '../constants/token'
import canCheck from './can-check'

describe('canCheck', () => {
  describe('is truthy', () => {
    it('for big blind when no other player raised', () => {
      const result = canCheck({
        chips: { bet: 200 },
        opponents: [{ chips: { bet: 100 } }],
        player: { token: Token.BIG_BLIND },
        table: { turn: Turn.PRE_FLOP }
      })

      expect(result).toBeTruthy()
    })
  })

  describe('is falsy', () => {
    it('for big blind when another player raised', () => {
      const result = canCheck({
        chips: { bet: 200 },
        opponents: [{ chips: { bet: 500 } }],
        player: { token: Token.BIG_BLIND },
        table: { turn: Turn.PRE_FLOP }
      })

      expect(result).toBeFalsy()
    })
  })
})