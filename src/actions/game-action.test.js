import * as actions from './game-action'
import fire from 'virtual-chips/src/fire'

describe('controlGame', () => {
  let getPlayersOnce, getPlayersPromise

  beforeEach(() => {
    fire.database = jest.fn().mockReturnValue({
      ref: path => path === 'table/1/player' && {
        once: (event) => event === 'value' && new Promise(res =>
          getPlayersOnce = res
        )
      }
    })
  })

  it.only('should control game flow if first player on table', async () => {
    expect.assertions(1)
    const initialState = {
            player: { id: '20' },
            table: { id: 1 }
          },
          dispatchMock = jest.fn()

    const actionPromise = actions.controlGameIfFirst()(
      dispatchMock, () => initialState
    )
    await getPlayersOnce({
      val: () => ({
        '20': {},
        'another player': {}
      })
    })

    await actionPromise
    expect(dispatchMock).toHaveBeenCalled()
  })
})
