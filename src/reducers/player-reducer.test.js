import reducer from './player-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toMatchObject({})
})

describe('SET_PLAYER_ID', () => {
  it('should update player id', () => {
    expect(reducer(undefined, {
      type: 'SET_PLAYER_ID',
      payload: 42
    })).toEqual({ id: 42 })
  })
})

describe('SET_PLAYER_STATE', () => {
  it('should update player state', () => {
    expect(reducer(undefined, {
      type: 'SET_PLAYER_STATE',
      payload: 'folded'
    })).toEqual({ state: 'folded' })
  })
})