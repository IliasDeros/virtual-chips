import * as actions from './chips-action'
import fire from 'virtual-chips/src/fire'

describe('watchChips', () => {
  let updateChips

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => path === 'chips' && {
        on: (event, cb) => event === 'value' && (updateChips = cb)
      }
    })
  })

  it('should update chips on database update', () => {
    const expectedPayload = {},
          dispatchMock = jest.fn(),
          snapshotMock = { val(){ return expectedPayload }}

    actions.watchChips()(dispatchMock)
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
          chips: {
            bet: 20,
            total: 100
          }
        }

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({ ref: refMock })
  })

  it('should add to bet', () => {
    const setMock = jest.fn()
    refMock.mockImplementation(path => ({
      set: path === 'chips/bet' ? setMock : jest.fn()
    }))

    actions.addToBet(10)(undefined, () => initialState)

    expect(setMock).toBeCalledWith(30)
  })

  it('should update total', () => {
    const setMock = jest.fn()
    refMock.mockImplementation(path => ({
      set: path === 'chips/total' ? setMock : jest.fn()
    }))

    actions.addToBet(10)(undefined, () => initialState)

    expect(setMock).toBeCalledWith(90)
  })
})