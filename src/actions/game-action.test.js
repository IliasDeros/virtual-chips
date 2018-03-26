import * as actions from './game-action'
import fire from 'virtual-chips/src/fire'

describe('watchChips', () => {
  let getPlayersOnce, getPlayersPromise

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => path === 'table/1/player' && {
        once: (event) => event === 'value' && (getPlayersPromise = new Promise(res =>
          getPlayersOnce = res
        ))
      }
    })
  })

  it('should control game flow if first player on table', async () => {
    expect.assertions(1)
    const initialState = {
            player: { id: '20' },
            table: { id: 1 }
          },
          dispatchMock = jest.fn()

    actions.controlGameIfFirst()(dispatchMock, () => initialState)
    getPlayersOnce({
      val: () => ({
        '20': {},
        'another player': {}
      })
    })

    await getPlayersPromise
    expect(dispatchMock).toHaveBeenCalled()
  })
})
