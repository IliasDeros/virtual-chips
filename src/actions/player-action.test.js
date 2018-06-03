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
  let updateRound, setMock = jest.fn()

  beforeEach(() => {
    const tableRoundMock = {
      on: (event, cb) => event === 'value' && (updateRound = cb),
      set: setMock
    },
    tablePlayerMock = {
      once: event => event === 'value' && Promise.resolve({
        val: () => ({ 42: { id: 42 } })
      })
    },
    tablePlayerTokenMock = {
      set: setMock
    }
    fire.database = jest.fn().mockReturnValue({
      ref: path => {
        switch (path){
          case 'table/1/round':
            return tableRoundMock
          case 'table/1/player':
            return tablePlayerMock
          case 'table/1/player/42/token':
            return tablePlayerTokenMock
        }
      }
    })
  })

  it('should update token', done => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }

    const loadPromise = new Promise(resolve =>
      actions.loadPlayerToken()(dispatchMock, () => initialState, resolve)
    )
    updateRound({ val: () => 0 })

    loadPromise.then(() => {
      expect(dispatchMock).toHaveBeenCalledWith({
        type: 'SET_PLAYER_TOKEN',
        payload: 'big blind'
      })
      done()
    })
  })

  it('should update the token in db', () => {
    const dispatchMock = jest.fn(),
          initialState = {
            player: { id: 42 },
            table: { id: 1 }
          }

    const loadPromise = new Promise(resolve =>
      actions.loadPlayerToken()(dispatchMock, () => initialState, resolve)
    )
    updateRound({ val: () => 0 })

    loadPromise.then(() => {
      expect(setMock).toHaveBeenCalledWith('big blind')
      done()
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

describe('check', () => {
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
    actions.check()(undefined, () => initialState)
    expect(setMock).toHaveBeenCalledWith('checked')
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

describe('setPlayerHost', () => {
  it('should be the expected type', () => {
    expect(actions.setPlayerHost()).toEqual({ type: 'SET_PLAYER_HOST' })
  })
})