import * as actions from './table-action'
import Fingerprint from 'fingerprintjs2'

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
