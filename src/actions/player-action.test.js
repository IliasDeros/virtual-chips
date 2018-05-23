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

describe('loadPlayerState', () => {
  let updateState, setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/player/42/state'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        on: (event, cb) => event === 'value' && (updateState = cb),
        set: setMock
      }
    })
  })

  it('should initialize state', () => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }
    actions.loadPlayerState()(dispatchMock, () => initialState)
    updateState({ val(){} })

    expect(setMock).toHaveBeenCalledWith('idle')
  })

  it('should update state', () => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }
    actions.loadPlayerState()(dispatchMock, () => initialState)
    updateState({ val: () => 'folded' })

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'SET_PLAYER_STATE',
      payload: 'folded'
    })
  })
})

describe('loadPlayerToken', () => {
  let updateState, setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/round'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        on: (event, cb) => event === 'value' && (updateState = cb),
        set: setMock
      }
    })
  })

  it('should update token', () => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }
    actions.loadPlayerToken()(dispatchMock, () => initialState)
    updateState({ val: () => 2 })

    expect(dispatchMock).toHaveBeenCalledWith({
      type: 'SET_PLAYER_TOKEN',
      payload: 2
    })
  })
})

describe('allIn', () => {
  let setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/player/42/state'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        set: setMock
      }
    })
  })

  it('should update state', () => {
    const initialState = {
      player: { id: 42 },
      table: { id: 1 }
    }
    actions.allIn()(undefined, () => initialState)
    expect(setMock).toHaveBeenCalledWith('all in')
  })
})

describe('bet', () => {
  let setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/player/42/state'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        set: setMock
      }
    })
  })

  it('should update state', () => {
    const initialState = {
      player: { id: 42 },
      table: { id: 1 }
    }
    actions.bet()(undefined, () => initialState)
    expect(setMock).toHaveBeenCalledWith('bet')
  })
})

describe('call', () => {
  let setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/player/42/state'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        set: setMock
      }
    })
  })

  it('should update state', () => {
    const initialState = {
      player: { id: 42 },
      table: { id: 1 }
    }
    actions.call()(undefined, () => initialState)
    expect(setMock).toHaveBeenCalledWith('called')
  })
})

describe('fold', () => {
  let setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/player/42/state'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        set: setMock
      }
    })
  })

  it('should update state', () => {
    const initialState = {
      player: { id: 42 },
      table: { id: 1 }
    }
    actions.fold()(undefined, () => initialState)
    expect(setMock).toHaveBeenCalledWith('folded')
  })
})

describe('idle', () => {
  let setMock = jest.fn()

  beforeEach(() => {
    const expectedPath = 'table/1/player/42/state'

    fire.database = jest.fn().mockReturnValue({
      ref: path => path === expectedPath && {
        set: setMock
      }
    })
  })

  it('should update state', () => {
    const initialState = {
      player: { id: 42 },
      table: { id: 1 }
    }
    actions.idle()(undefined, () => initialState)
    expect(setMock).toHaveBeenCalledWith('idle')
  })
})