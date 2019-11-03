import React from 'react'
import { connect } from 'react-redux'
import { addToBet } from '../actions/chips-action'
import { bet } from '../actions/player-action'

function BetMenu(props) {
  const add100 = () => props.addToBet(100)
  const remove100 = () => props.addToBet(-100)

  return (
    <div className="player__bet-menu">
      <button className="player__bet player__bet--add" onClick={add100}>
        Add 100
      </button>
      <br/>
      <button className="player__bet player__bet--remove" onClick={remove100}>
        Remove 100
      </button>
    </div>
  )
}

function mapStateToProps(){ 
  return {}
}

function mapDispatchToProps(dispatch){
  return {
    addToBet: payload => {
      dispatch(addToBet(payload)) // increase bet
      dispatch(bet())             // update player state
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BetMenu)

