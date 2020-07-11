import React from 'react'
import { connect } from 'react-redux'
import { addToBet, addToRaise } from '../actions/chips-action'
import { bet } from '../actions/player-action'

function BetMenu(props) {
  const raise = props.chips.raise
  const add100 = () => props.addToRaise(100)
  const remove100 = () => raise && props.addToRaise(-100)
  const confirmRaise = () => raise && props.addToBet(raise)

  return (
    <div className="player__bet-menu">
      <button className="player__bet player__bet--add" onClick={add100}>
        ↑ 100 $
      </button>
      <button 
        className={`player__bet player__bet--remove ${raise ? '' : 'invisible'}`} 
        onClick={remove100}
      >
        ↓ 100 $
      </button>
      <button 
        className={`player__bet player__bet--confirm ${raise ? '' : 'invisible'}`} 
        onClick={confirmRaise}
      >
        Confirm
      </button>
    </div>
  )
}

function mapStateToProps({ chips }){ 
  return { chips }
}

function mapDispatchToProps(dispatch){
  return {
    addToBet: payload => {
      dispatch(addToBet(payload)) // increase bet
      dispatch(bet())             // update player state
    },
    addToRaise: payload => dispatch(addToRaise(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetMenu)
