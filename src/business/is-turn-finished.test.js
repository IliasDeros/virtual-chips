import isTurnFinished from './is-turn-finished'
import State from '../constants/state'

describe('isTurnFinished', () => {
    let table

    describe('truthy', () => {
        beforeEach(() => { table = {} })
        afterEach(() => expect(isTurnFinished(table)).toBeTruthy())

        it('should be finished when player calls the highest best', () => {
            table.player = {
                0: { chips: { bet: 500 }, state: State.BET },
                1: { chips: { bet: 500 }, state: State.CALLED }
            }
        })

        it('should be finished when all players called', () => {
            table.player = {
                0: { chips: { bet: 500 }, state: State.CALLED },
                1: { chips: { bet: 500 }, state: State.CALLED }
            }
        })

        it('should be finished when all players called or folded', () => {
            table.player = {
                0: { chips: { bet: 500 }, state: State.CALLED },
                1: { chips: { bet: 500 }, state: State.CALLED },
                2: { chips: { bet: 300 }, state: State.FOLDED }
            }
        })

        it('should be finished when all players called or folded or all-in', () => {
            table.player = {
                0: { chips: { bet: 500 }, state: State.CALLED },
                1: { chips: { bet: 500 }, state: State.CALLED },
                2: { chips: { bet: 300 }, state: State.FOLDED },
                3: { chips: { bet: 100 }, state: State.ALL_IN }
            }
        })

        it('should be finished when big blind is checked', () => {
            table.player = {
                0: { chips: { bet: 200 }, state: State.CHECKED },
                1: { chips: { bet: 200 }, state: State.CALLED }
            }
        })

        it('should be finished when all players are checked', () => {
            table.player = {
                0: { chips: { bet: 0 }, state: State.CHECKED },
                1: { chips: { bet: 0 }, state: State.CHECKED }
            }
        })
    })

    describe('falsy', () => {
        beforeEach(() => { table = {} })
        afterEach(() => expect(isTurnFinished(table)).toBeFalsy())

        it('should not be finished when not all players called', () => {
            table.player = {
                0: { chips: { bet: 300 }, state: State.CALLED },
                1: { chips: { bet: 500 }, state: State.BET }
            }
        })

        it('should not be finished when all players called different bets', () => {
            table.player = {
                0: { chips: { bet: 500 }, state: State.CALLED },
                1: { chips: { bet: 300 }, state: State.CALLED },
                2: { chips: { bet: 500 }, state: State.CALLED }
            }
        })

        it('should not be finished when one player is checked', () => {
            table.player = {
                0: { chips: { bet: 500 }, state: State.CHECKED }
            }
        })

        it('should not be finished when all players are betting', () => {
             table.player = {
                0: { chips: { bet: 500 }, state: State.BET },
                1: { chips: { bet: 500 }, state: State.BET }
            }
        })
    })
})