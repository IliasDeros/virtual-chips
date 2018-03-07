import * as actions from './chips-action'
import fire from 'virtual-chips/src/fire'

describe('watchChips', () => {
  let updateChips

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => path === 'table/1/player/42/chips' && {
        on: (event, cb) => event === 'value' && (updateChips = cb)
      }
    })
  })

  it('should update chips on database update', () => {
    const expectedPayload = {},
          dispatchMock = jest.fn(),
          snapshotMock = { val(){ return expectedPayload }}

    actions.watchChips()(dispatchMock, () => ({
      player: { id: 42 },
      table: { id: 1 }
    }))
    updateChips(snapshotMock)

    expect(dispatchMock).toBeCalledWith({
      type: 'SET_CHIPS',
      payload: expectedPayload
    })
  })
})

describe('addToBet', () => {
  const refMock = jest.fn(),
        initialState = {
          player: { id: 10 },
          table: { id: 1 },
          chips: {
            bet: 20,
            total: 100
          }
        }

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({ ref: refMock })
    refMock
  })

  it('should update chips', () => {
    const setMock = jest.fn()
    refMock.mockImplementation(path => ({
      set: path === `table/1/player/10/chips` ? setMock : jest.fn()
    }))

    actions.addToBet(10)(undefined, () => initialState)

    expect(setMock).toBeCalledWith({
      bet: 30,
      total: 90
    })
  })
})