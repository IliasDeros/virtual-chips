import React, { Component } from 'react'
import canCheck from '../business/can-check'
import Turn from '../constants/turn'
import { connect } from 'react-redux'
import { callBet } from '../actions/chips-action'
import { check, fold } from '../actions/player-action'
import CallMove from '../components/CallMove'
import CheckMove from '../components/CheckMove'
import FoldMove from '../components/FoldMove'

class PlayerMoves extends Component {
  callMove = <CallMove onClick={() => this.props.call()} />
  checkMove = <CheckMove onClick={() => this.props.check()} />
  state = {}

  static getDerivedStateFromProps(props, state){
    return {
      canCheck: canCheck(props),
      isLastTurn: props.table.turn === Turn.RIVER
    }
  }

  render() {
    const move = this.state.canCheck ? this.checkMove : this.callMove

    return (
      <div className="player-moves">
        {(() => this.state.isLastTurn || move)()}
        <FoldMove onClick={() => this.props.fold()} />
      </div>
    )
  }
}

function mapStateToProps({ chips, opponents, player, table }){
  return { chips, opponents, player, table }
}

function mapDispatchToProps(dispatch){
  return {
    call: () => dispatch(callBet()),
    check: () => dispatch(check()),
    fold: () => dispatch(fold())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerMoves)