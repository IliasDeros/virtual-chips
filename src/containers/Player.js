import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import Turn from '../constants/turn'
import PlayerToken from './PlayerToken'
import Bet from '../components/Bet'
import BetButton from '../components/BetButton'
import LoadingChips from '../components/LoadingChips'
import Total from '../components/Total'
import { watchChips } from '../actions/chips-action'
import { loadPlayerName, loadPlayerState } from '../actions/player-action'
import { controlGameIfFirst } from '../actions/game-action'
import BetMenu from './BetMenu'

class Player extends Component {
  state = {
    betMenuVisible: true
  }

  componentDidMount(){
    this.props.controlGame()
    this.props.watchChips()
    this.props.loadPlayerName()
    this.props.loadPlayerState()
  }

  render() {
    const {
      chips,
      table,
      player
    } = this.props
    const canBet = table && table.turn !== Turn.FINISHED
    const showBetMenu = (event) => {
      event.stopPropagation()
      this.setState({ betMenuVisible: true })
    }

    if (!chips) {
      return <LoadingChips />
    }

    return (
      <div className="player">
        {/* Details */}
        <h2>{player.name || player.id}
          ({player.state || 'idle'})
          <PlayerToken />
        </h2>
        {(() => player.host && <p>You are the host.</p>)()}
        
        {/* Bet */}
        {canBet && <Fragment>
          <Bet bet={chips.bet + (chips.raise || 0)} />
          {this.state.betMenuVisible ? <BetMenu /> : <BetButton onClick={showBetMenu} />}
        </Fragment>}

        {/* Total */}
        <Total total={chips.total} />
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