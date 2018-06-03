import reducer from './table-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toMatchObject({
    id: 'default',
    pot: 0
  })
})

describe('SET_ACTION', () => {
  it('should update action', () => {
    expect(reducer({}, {
      type: 'SET_ACTION',
      payload: 'action'
    })).toEqual({
      action: 'action'
    })
  })
})

describe('SET_POT', () => {
  it('should update pot', () => {
    expect(reducer({}, {
      type: 'SET_POT',
      payload: 1000
    })).toEqual({
      pot: 1000
    })
  })
})

describe('SET_TURN', () => {
  it('should update turn', () => {
    expect(reducer({}, {
      type: 'SET_TURN',
      payload: 2
    })).toEqual({
      turn: 2
    })
  })
})