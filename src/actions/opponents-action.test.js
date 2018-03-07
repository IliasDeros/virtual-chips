import * as actions from './opponents-action'
import fire from 'virtual-chips/src/fire'

describe('watchChips', () => {
  let addChild, updateChild

  beforeEach(() => {
    const childAddedMock = {
            on: (path, cb) => path === 'child_added' && (addChild = cb)
          },
          childUpdatedMock = {
            on: (path, cb) => path === 'value' && (updateChild = cb)
          }

    fire.database = jest.fn().mockReturnValue({
      ref: path => {
        switch (path){
          case 'table/1/player':
            return childAddedMock
          case 'table/1/player/id':
            return childUpdatedMock
          default:
            throw 'Unexpected ref() path, got: ', path
        }
      }
    })
  })

  it('should ignore current player', () => {
    const dispatchMock = jest.fn(),
          getStateMock = () => ({ table: { id: 1 } })

    actions.watchOpponents()(dispatchMock, getStateMock)

    expect(dispatchMock).toHaveBeenCalledTimes(0)
  })

  it('should add opponents', () => {
    const dispatchMock = jest.fn(),
          getStateMock = () => ({
            table: { id: 1 },
            player: {}
          })

    actions.watchOpponents()(dispatchMock, getStateMock)
    addChild({ key: 'id', val: () => ({ name: 'Albert' }) })

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'ADD_OPPONENT',
      payload: { id: 'id', name: 'Albert' }
    })
  })

  it('should update opponents', () => {
    const dispatchMock = jest.fn(),
          getStateMock = () => ({
            table: { id: 1 },
            player: {}
          })

    actions.watchOpponents()(dispatchMock, getStateMock)
    addChild({ key: 'id', val: () => ({ name: 'John Doe' }) })
    updateChild({ key: 'id', val: () => ({ name: 'Veronica' }) })

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'UPDATE_OPPONENT',
      payload: { id: 'id', name: 'Veronica' }
    })
  })
})
