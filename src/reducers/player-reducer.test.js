import reducer from './player-reducer'
import State from '../constants/state'

it('should return initial state', () => {
  expect(reducer(undefined, { state: State.IDLE })).toMatchObject({})
})

describe('SET_PLAYER_ID', () => {
  it('should update player id', () => {
    expect(reducer(undefined, {
      type: 'SET_PLAYER_ID',
      payload: 42
    })).toEqual({ id: 42, state: State.IDLE })
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

describe('SET_PLAYER_TOKEN', () => {
  it('should unset token by default', () => {
    expect(reducer(undefined, {
      type: 'SET_PLAYER_TOKEN',
      payload: 'dealer'
    })).toEqual(({ token: 'dealer', state: State.IDLE }))
  })
})

describe('SET_PLAYER_HOST', () => {
  it('should set player host', () => {
    expect(reducer(undefined, {
      type: 'SET_PLAYER_HOST'
    })).toEqual(({ host: true, state: State.IDLE }))
  })
})