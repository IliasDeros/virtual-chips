import reducer from './table-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toMatchObject({ id: 'default' })
})

describe('SET_POT', () => {
  it('should update pot', () => {
    expect(reducer(undefined, {
      type: 'SET_POT',
      payload: 1000
    })).toEqual({
      id: 'default',
      pot: 1000
    })
  })
})

describe('SET_TURN', () => {
  it('should update turn', () => {
    expect(reducer(undefined, {
      type: 'SET_TURN',
      payload: 2
    })).toEqual({
      id: 'default',
      turn: 2
    })
  })
})