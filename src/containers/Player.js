import React, { Component } from 'react'
import { connect } from 'react-redux'
import Turn from '../constants/turn'
import PlayerToken from './PlayerToken'
import Bet from '../components/Bet'
import LoadingChips from '../components/LoadingChips'
import Total from '../components/Total'
import { addToBet, watchChips } from '../actions/chips-action'
import { bet, loadPlayerName, loadPlayerState } from '../actions/player-action'
import { controlGameIfFirst } from '../actions/game-action'

class Player extends Component {
  componentDidMount(){
    this.props.controlGame()
    this.props.watchChips()
    this.props.loadPlayerName()
    this.props.loadPlayerState()
  }

  render() {
    const canBet = this.props.table && this.props.table.turn !== Turn.FINISHED

    if (!this.props.chips) {
      return <LoadingChips />
    }

    return (
      <div className="player">
        <h2>{this.props.player.name || this.props.player.id}
          ({this.props.player.state || 'idle'})
          <PlayerToken />
        </h2>
        {(() => this.props.player.host && <p>You are the host.</p>)()}
        
        {canBet && <Bet bet={this.props.chips.bet} />}

        {canBet && <div>
          <button 
            className="player__bet player__bet--add" 
            onClick={() => this.props.addToBet(100)}
          >
            Add 100
          </button>
          <br/>
          <button 
            className="player__bet player__bet--remove" 
            onClick={() => this.props.addToBet(-100)}
          >
            Remove 100
          </button>
          <br/><br/>
        </div>}

        <Total total={this.props.chips.total} />
      </div>
    );
  }
}

function mapStateToProps({ chips, opponents, player, table }){
  return { chips, opponents, player, table }
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
    watchChips: () => dispatch(watchChips())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)