import React, { Component } from 'react'
import { connect } from 'react-redux'
import Turn from '../constants/turn'
import PlayerMoves from './PlayerMoves'
import Bet from '../components/Bet'
import Total from '../components/Total'
import { addToBet, watchToken, watchChips } from '../actions/chips-action'
import { bet, loadPlayerName, loadPlayerState, loadPlayerToken } from '../actions/player-action'
import { controlGameIfFirst } from '../actions/game-action'

class Player extends Component {
  componentDidMount(){
    this.props.controlGame()
    this.props.watchChips()
    this.props.watchToken()
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

          {(() => this.props.table && this.props.table.turn !== Turn.FINISHED && (
            <div>
              <Bet bet={this.props.chips.bet} />
              <button onClick={() => this.props.addToBet(100)}>Add 100</button>
              <br/>
              <button onClick={() => this.props.addToBet(-100)}>Remove 100</button>
              <br/><br/>
            </div>
          ))()}

          <PlayerMoves />
          <Total total={this.props.chips.total} />
        </div>
      : <span>Loading Chips...</span>
    );
  }
}

function mapStateToProps({ chips, player, table }){
  return { chips, player, table }
}

function mapDispatchToProps(dispatch){
  return {
    addToBet: payload => {
      dispatch(addToBet(payload)) // increase bet
      dispatch(bet())             // update player state
    },
    controlGame: () => dispatch(controlGameIfFirst()),
    loadPlayerName: () => dispatch(loadPlayerName()),
    loadPlayerState: () => dispatch(loadPlayerState()),
    loadPlayerToken: () => dispatch(loadPlayerToken()),
    watchChips: () => dispatch(watchChips()),
    watchToken: () => dispatch(watchToken())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)