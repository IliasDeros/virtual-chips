import * as actions from './opponents-action'
import fire from 'virtual-chips/src/fire'

describe('watchChips', () => {
  let triggerValue
  const oncePromise = Promise.resolve(res => (triggerValue = res))

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => path === 'table/1/player' && {
        once: (event) => event === 'value' && oncePromise
      }
    })
  })

  it('should initialize with all players except current player', () => {
    const expectedPayload = { 9: 'other' },
          dispatchMock = jest.fn(),
          snapshotMock = { val(){ return { 9: 'other', 15: 'current' } }}

    actions.watchOpponents()(dispatchMock, () => ({
      player: { id: 15 },
      table: { id: 1 }
    }))
    oncePromise.then(() => {
      triggerValue(snapshotMock)

      expect(dispatchMock).toBeCalledWith({
        type: 'SET_OPPONENTS',
        payload: expectedPayload
      })
    })
  })
})
