import React, { Component } from 'react'
import { connect } from 'react-redux'
import { watchToken } from '../actions/chips-action'
import { loadPlayerToken } from '../actions/player-action'
import Turn from '../constants/turn'

class PlayerToken extends Component {
  componentDidMount(){
    this.props.watchToken()
    this.props.loadPlayerToken()
  }
  
  componentDidUpdate(prevProps) {
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
    const { player } = this.props

    if (!player.token) {
      return null
    }
  
    return <span> - {player.token}</span>
  }
}

function mapStateToProps({ opponents, player, table }){
  return { opponents, player, table }
}

function mapDispatchToProps(dispatch){
  return {
    loadPlayerToken: () => dispatch(loadPlayerToken()),
    watchToken: () => dispatch(watchToken())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerToken)