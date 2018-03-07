import reducer from './opponents-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toMatchObject([])
})

describe('ADD_OPPONENT', () => {
  it('should add opponent', () => {
    expect(reducer([{ name: 'Veronica' }], {
      type: 'ADD_OPPONENT',
      payload: { name: 'Albert' }
    })).toEqual([
      { name: 'Veronica' },
      { name: 'Albert' }
    ])
  })
})

describe('UPDATE_OPPONENT', () => {
  it('should do nothing if no existing opponent', () => {
    expect(reducer([{ name: 'Veronica', id: 10 }], {
      type: 'UPDATE_OPPONENT',
      payload: { name: 'Albert', id: 12 }
    })).toEqual([{ name: 'Veronica', id: 10 }])
  })

  it('should update existing opponent', () => {
    expect(reducer([{ name: 'Veronica', id: 10 }], {
      type: 'UPDATE_OPPONENT',
      payload: { name: 'Albert', id: 10 }
    })).toEqual([{ name: 'Albert', id: 10 }])
  })
})