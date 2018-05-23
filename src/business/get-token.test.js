import getToken from './get-token'
import Token from '../constants/token'

describe('getToken', () => {
  let table

  beforeEach(() => {
    table = {
      id: 'default',
      player: {
        'id0': { id: 'id0' },
        'id1': { id: 'id1' },
        'id2': { id: 'id2' },
        'id3': { id: 'id3' }
      },
      round: 0
    }
  })

  describe('heads-up', () => {
    beforeEach(() => {
      table.player = {
        'id0': { id: 'id0' },
        'id1': { id: 'id1' }
      }
    })

    it('should return dealer & small blind for player 0 on round 0', () => {
      expect(getToken(table, {
        id: 'id0' }
      )).toBe(Token.DEALER_SMALL)
    })

    it('should return big blind for player 1 on round 0', () => {
      expect(getToken(table, {
        id: 'id1' }
      )).toBe(Token.BIG_BLIND)
    })

    it('should return big blind for player 0 on round 1', () => {
      table.round = 1

      expect(getToken(table, {
        id: 'id0' }
      )).toBe(Token.BIG_BLIND)
    })
  })

  it('should return dealer for player 0 on round 0', () => {
    expect(getToken(table, {
      id: 'id0' }
    )).toBe(Token.DEALER)
  })

  it('should return small blind for player 1 on round 0', () => {
    expect(getToken(table, {
      id: 'id1' }
    )).toBe(Token.SMALL_BLIND)
  })

  it('should return big blind for player 2 on round 0', () => {
    expect(getToken(table, {
      id: 'id2' }
    )).toBe(Token.BIG_BLIND)
  })
})