import isTurnFinished from './is-turn-finished'

describe('isTurnFinished', () => {
    let players
    
    describe('truthy', () => {
        beforeEach(() => { players = {} })
        afterEach(() => expect(isTurnFinished()).toBeTruthy())
        it('should be finished when all players called', () => {
            
        })  
    })
})