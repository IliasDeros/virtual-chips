import * as actions from './chips-action'
import * as playerActions from './player-action'
import fire from 'virtual-chips/src/fire'
import Token from '../constants/token'
import Turn from '../constants/turn'

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
})

describe('watchToken', () => {
  let transactionMock, updateToken
  const initialState = {
          player: { id: 42 },
          table: { id: 1, turn: Turn.PRE_FLOP },
          chips: {
            bet: 0,
            total: 2500
          }
        }

  beforeEach(() => {
    transactionMock = jest.fn()
    fire.database = jest.fn().mockReturnValue({
      ref: path => {
        switch (path){
          case 'table/1/player/42/chips':
            return { transaction: transactionMock }
          case 'table/1/player/42/token':
            return {
              on: (event, cb) => event === 'value' && (updateToken = cb)
            }
        }
      }
    })
  })

  it('should set small blind bet', () => {
    actions.watchToken()(jest.fn(), () => initialState)
    updateToken({ val: () => Token.SMALL_BLIND })

    let transactionFn = transactionMock.mock.calls[0][0]
    const transactionValue = transactionFn()

    expect(transactionValue).toEqual({
      bet: 100,
      total: 2400
    })
  })

  it('should set big blind bet', () => {
    actions.watchToken()(jest.fn(), () => initialState)
    updateToken({ val: () => Token.BIG_BLIND })

    let transactionFn = transactionMock.mock.calls[0][0]
    const transactionValue = transactionFn()

    expect(transactionValue).toEqual({
      bet: 200,
      total: 2300
    })
  })

  it('should not set blind after PRE_FLOP', () => {
    initialState.table.turn = Turn.FLOP
    actions.watchToken()(jest.fn(), () => initialState)
    updateToken({ val: () => Token.BIG_BLIND })

    expect(transactionMock).not.toHaveBeenCalled()
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

describe('addToRaise', () => {
  let dispatchMock
  let initialState

  beforeEach(() => {
    dispatchMock = jest.fn()
    initialState = {
      player: { id: 10 },
      table: { id: 1 },
      chips: {
        bet: 20,
        total: 100
      }
    }
  })

  it('initializes a raise', () => {
    const action = actions.addToRaise(200)
    action(dispatchMock, () => initialState)

    expect(dispatchMock.mock.calls[0][0]).toEqual({
      type: 'SET_CHIPS',
      payload: {
        bet: 20,
        raise: 200,
        total: 100,
      }
    })
  })

  it('increments a raise', () => {
    initialState.chips.raise = 100

    const action = actions.addToRaise(200)
    action(dispatchMock, () => initialState)

    expect(dispatchMock.mock.calls[0][0]).toEqual({
      type: 'SET_CHIPS',
      payload: {
        bet: 20,
        raise: 300,
        total: 100,
      }
    })
  })

  it('decrements a raise', () => {
    initialState.chips.raise = 100

    const action = actions.addToRaise(-100)
    action(dispatchMock, () => initialState)

    expect(dispatchMock.mock.calls[0][0]).toEqual({
      type: 'SET_CHIPS',
      payload: {
        bet: 20,
        raise: 0,
        total: 100,
      }
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

describe('allInBet', () => {
  const refMock = jest.fn()
  let initialState

  beforeEach(() => {
    initialState = {
      player: { id: 10 },
      table: { id: 1 },
      chips: {
        bet: 20,
        total: 100
      }
    }
    fire.database = jest.fn().mockReturnValue({ ref: refMock })
  })

  it('should bet all the remaining money', () => {
    const dispatchMock = jest.fn(),
          setMock = jest.fn()
    refMock.mockImplementation(path => ({
      transaction: path === `table/1/player/10/chips` ? setMock : jest.fn()
    }))

    actions.allInBet()(dispatchMock, () => initialState)

    let transactionFn = setMock.mock.calls[0][0]
    const transactionValue = transactionFn()

    expect(transactionValue).toEqual({
      bet: 120,
      total: 0
    })
  })
})