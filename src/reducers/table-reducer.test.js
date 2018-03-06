import reducer from './table-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toMatchObject({})
})

describe('SET_PLAYER_ID', () => {
  it('should update playerId', () => {
    expect(reducer(undefined, {
      type: 'SET_PLAYER_ID',
      payload: 42
    })).toEqual({ playerId: 42 })
  })
})