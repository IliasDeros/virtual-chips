import * as actions from './player-action'
import Fingerprint from 'fingerprintjs2'
import fire from 'virtual-chips/src/fire'

describe('loadPlayerId', () => {
  it('should load device fingerprint', () => {
    const dispatchMock = jest.fn()
    Fingerprint.prototype.get = jest.fn(cb => cb(12))

    actions.loadPlayerId()(dispatchMock)

    expect(dispatchMock).toBeCalledWith({
        type: 'SET_PLAYER_ID',
        payload: 12
      })
  })
})

describe('loadPlayerName', () => {
  let updateName

  beforeEach(() => {
    window.fetch = jest.fn(() => new Promise(function(){}))

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === 'table/1/player/42/name' && {
        on: (event, cb) => event === 'value' && (updateName = cb)
      }
    })
  })

  it('should generate random name', () => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }
    actions.loadPlayerName()(dispatchMock, () => initialState)
    updateName({ val(){} })

    expect(window.fetch).toHaveBeenCalled()
  })

  it('should update name', () => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }
    actions.loadPlayerName()(dispatchMock, () => initialState)
    updateName({ val(){ return 'player name' } })

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'SET_PLAYER_NAME',
      payload: 'player name'
    })
  })
})
