import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Turn from '../constants/turn'
import PlayerToken from './PlayerToken'
import Bet from '../components/Bet'
import LoadingChips from '../components/LoadingChips'
import Total from '../components/Total'
import { watchChips } from '../actions/chips-action'
import { loadPlayerName, loadPlayerState } from '../actions/player-action'
import { controlGameIfFirst } from '../actions/game-action'
import BetMenu from './BetMenu'

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
        
        {canBet && <Fragment>
          <Bet bet={this.props.chips.bet} />
          <BetMenu />
        </Fragment>}

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
    controlGame: () => dispatch(controlGameIfFirst()),
    loadPlayerName: () => dispatch(loadPlayerName()),
    loadPlayerState: () => dispatch(loadPlayerState()),
    watchChips: () => dispatch(watchChips())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)