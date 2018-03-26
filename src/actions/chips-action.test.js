import * as actions from './chips-action'
import * as playerActions from './player-action'
import fire from 'virtual-chips/src/fire'

describe('watchChips', () => {
  let updateChips

  beforeEach(() => {
    playerActions.allIn = jest.fn().mockReturnValue('all in')
    playerActions.bet = jest.fn().mockReturnValue('bet')
    playerActions.call = jest.fn().mockReturnValue('call')
    playerActions.idle = jest.fn().mockReturnValue('idle')
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

  describe('update player state', () => {
    it('should not update state to "idle" when setting chips', () => {
      const dispatchMock = jest.fn(),
            snapshotMock = { val(){ return { bet: 100 } }}

      actions.watchChips()(dispatchMock, () => ({
        chips: {},
        player: { id: 42 },
        table: { id: 1 }
      }))
      updateChips(snapshotMock)

      expect(dispatchMock).not.toBeCalledWith('idle')
    })

    it('should set state to "idle" when setting chips to 0', () => {
      const dispatchMock = jest.fn(),
            snapshotMock = { val(){ return { bet: 0 } }}

      actions.watchChips()(dispatchMock, () => ({
        chips: {},
        player: { id: 42 },
        table: { id: 1 }
      }))
      updateChips(snapshotMock)

      expect(dispatchMock).toBeCalledWith('idle')
    })
  })

  it('should set state to "idle" when setting chips to 0', () => {
    const dispatchMock = jest.fn(),
          snapshotMock = { val(){ return { bet: 0 } }}

    actions.watchChips()(dispatchMock, () => ({
      chips: {},
      player: { id: 42 },
      table: { id: 1 }
    }))
    updateChips(snapshotMock)

    expect(dispatchMock).toBeCalledWith('idle')
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
  })

  it('should update chips atomically', () => {
    const setMock = jest.fn()
    refMock.mockImplementation(path => ({
      transaction: path === `table/1/player/10/chips` ? setMock : jest.fn()
    }))

    actions.addToBet(10)(undefined, () => initialState)

    let transactionFn = setMock.mock.calls[0][0]
    const transactionValue = transactionFn()

    expect(transactionValue).toEqual({
      bet: 30,
      total: 90
    })
  })
})

describe('callBet', () => {
  const refMock = jest.fn()
  let initialState

  beforeEach(() => {
    initialState = {
      player: { id: 10 },
      table: { id: 1 },
      opponents: [
        { chips: { bet: 100, total: 20 } },
        { chips: { bet: 80, total: 40 } }
      ],
      chips: {
        bet: 20,
        total: 100
      }
    }
    fire.database = jest.fn().mockReturnValue({ ref: refMock })
  })

  it('should call the highest opponent bet', () => {
    const dispatchMock = jest.fn(),
          setMock = jest.fn()
    refMock.mockImplementation(path => ({
      transaction: path === `table/1/player/10/chips` ? setMock : jest.fn()
    }))

    actions.callBet()(dispatchMock, () => initialState)

    let transactionFn = setMock.mock.calls[0][0]
    const transactionValue = transactionFn()

    expect(transactionValue).toEqual({
      bet: 100,
      total: 20
    })
  })
})