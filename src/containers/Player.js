import React, { Component } from 'react'
import { connect } from 'react-redux'
import Turn from '../constants/turn'
import PlayerMoves from './PlayerMoves'
import PlayerToken from './PlayerToken'
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

  componentDidUpdate(prevProps){
    this.setupToken(prevProps)
  }

  // update token on round 0, turn 0 when opponents are updated
  setupToken(prevProps){
    if (isGameStarting(this.props) && playersAddedOrRemoved(this.props)){
      this.props.loadPlayerToken()
    }

    function isGameStarting(props){
      let round = props.table.round, turn = props.table.turn,
          isInitialRound = isNaN(round) || round === 0,
          isInitialTurn = isNaN(turn) || turn === Turn.PRE_FLOP

      return isInitialRound && isInitialTurn
    }

    function playersAddedOrRemoved(props){
      let prevLength = prevProps.opponents && prevProps.opponents.length,
          curLength = props.opponents && props.opponents.length

      return prevLength && prevLength !== curLength
    }
  }

  render() {
    return (
      this.props.chips
      ? <div className="container">
          <h2>{this.props.player.name || this.props.player.id}
            ({this.props.player.state || 'idle'})
            <PlayerToken />
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
    loadPlayerToken: () => dispatch(loadPlayerToken()),
    watchChips: () => dispatch(watchChips()),
    watchToken: () => dispatch(watchToken())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Player)