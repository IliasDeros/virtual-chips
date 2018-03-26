import fire from 'virtual-chips/src/fire'
import * as actions from './table-action'

describe('watchTable', () => {
  let updatePot, updateTurn

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => ({
        on: (event, cb) => {
          switch (path){
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