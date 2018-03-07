import reducer from './table-reducer'

it('should return initial state', () => {
  expect(reducer(undefined, {})).toMatchObject({ id: 'default' })
})
