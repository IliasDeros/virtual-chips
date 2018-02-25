import reducer from './chips-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toBeFalsy()
})

describe('SET_CHIPS', () => {
  it('should update chips', () => {
    expect(reducer(undefined, {
      type: 'SET_CHIPS',
      payload: { bet: 0 }
    })).toEqual({ bet: 0 })
  })
})