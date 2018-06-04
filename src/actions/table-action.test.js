import fire from 'virtual-chips/src/fire'
import * as actions from './table-action'
import Turn from '../constants/turn'

describe('watchTable', () => {
  let updateAction, updatePot, updateTurn

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => ({
        on: (event, cb) => {
          switch (path){
            case 'table/default/action':
              updateAction = cb
              break
            case 'table/default/pot':
              updatePot = cb
              break
            case 'table/default/turn':
              updateTurn = cb
              break
            default:
              throw new Error('Unsupported ref:', path)
          }
        }
      })
    })
  })

  it('should update action on action update', () => {
    const dispatchMock = jest.fn()

    actions.watchTable()(dispatchMock)
    updateAction({
      val: () => 'action'
    })

    expect(dispatchMock).toBeCalledWith({
      type: 'SET_ACTION',
      payload: 'action'
    })
  })

  it('should set pot to 0 by default', () => {
    const dispatchMock = jest.fn()

    actions.watchTable()(dispatchMock)
    updatePot({
      val: () => undefined
    })

    expect(dispatchMock).toBeCalledWith({
      type: 'SET_POT',
      payload: 0
    })
  })

  it('should update pot on pot update', () => {
    const dispatchMock = jest.fn()

    actions.watchTable()(dispatchMock)
    updatePot({
      val: () => 2
    })

    expect(dispatchMock).toBeCalledWith({
      type: 'SET_POT',
      payload: 2
    })
  })

  it('should set turn to pre flop by defualt', () => {
    const dispatchMock = jest.fn()

    actions.watchTable()(dispatchMock)
    updateTurn({
      val: () => undefined
    })

    expect(dispatchMock).toBeCalledWith({
      type: 'SET_TURN',
      payload: Turn.PRE_FLOP
    })
  })

  it('should update turn on turn update', () => {
    const dispatchMock = jest.fn()

    actions.watchTable()(dispatchMock)
    updateTurn({
      val: () => 2
    })

    expect(dispatchMock).toBeCalledWith({
      type: 'SET_TURN',
      payload: 2
    })
  })
})