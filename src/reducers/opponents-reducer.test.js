import reducer from './opponents-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toBe(false)
})

describe('SET_OPPONENTS', () => {
  it('should update opponents mapped with IDs', () => {
    expect(reducer(undefined, {
      type: 'SET_OPPONENTS',
      payload: {'id42': { otherProp: 'value' } }
    })).toEqual([{ id: 'id42', otherProp: 'value' }])
  })
})