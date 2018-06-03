import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bet from '../components/Bet'
import Total from '../components/Total'
import { addToBet, callBet, watchToken, watchChips } from '../actions/chips-action'
import { bet, fold, loadPlayerName, loadPlayerState, loadPlayerToken } from '../actions/player-action'
import { controlGameIfFirst } from '../actions/game-action'

class Table extends Component {
  componentDidMount(){
    this.props.controlGame()
    this.props.watchChips(() => this.props.watchToken())
    this.props.loadPlayerName()
    this.props.loadPlayerState()
    this.props.loadPlayerToken()
  }

  render() {
    return (
      this.props.chips
      ? <div className="container">
          <h2>{this.props.player.name || this.props.player.id}
            ({this.props.player.state || 'idle'})
            {(() => this.props.player.token && ` - ${this.props.player.token}`)()}
          </h2>
          {(() => this.props.player.host && <p>You are the host.</p>)()}
          <Bet bet={this.props.chips.bet} />
          <button onClick={() => this.props.addToBet(100)}>Add 100</button>
          <br/>
          <button onClick={() => this.props.addToBet(-100)}>Remove 100</button>
          <br/><br/>
          <button onClick={() => this.props.call()}>CALL</button>
          <br/>
          <button onClick={() => this.props.fold()}>FOLD</button>
          <Total total={this.props.chips.total} />
        </div>
      : <span>Loading Chips...</span>
    );
  }
}

function mapStateToProps({ chips, player }){
  return { chips, player }
}

function mapDispatchToProps(dispatch){
  return {
    addToBet: payload => {
      dispatch(addToBet(payload)) // increase bet
      dispatch(bet())             // update player state
    },
    call: () => dispatch(callBet()),
    controlGame: () => dispatch(controlGameIfFirst()),
    fold: () => dispatch(fold()),
    loadPlayerName: () => dispatch(loadPlayerName()),
    loadPlayerState: () => dispatch(loadPlayerState()),
    loadPlayerToken: () => dispatch(loadPlayerToken()),
    watchChips: fn => dispatch(watchChips(fn)),
    watchToken: () => dispatch(watchToken())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)