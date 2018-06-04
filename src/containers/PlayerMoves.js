import React, { Component } from 'react'
import canCheck from '../business/can-check'
import Turn from '../constants/turn'
import { connect } from 'react-redux'
import { callBet } from '../actions/chips-action'
import { check, fold, tie } from '../actions/player-action'
import CallMove from '../components/CallMove'
import CheckMove from '../components/CheckMove'
import FoldMove from '../components/FoldMove'
import TieMove from '../components/TieMove'

class PlayerMoves extends Component {
  callMove = <CallMove onClick={() => this.props.call()} />
  checkMove = <CheckMove onClick={() => this.props.check()} />
  tieMove = <TieMove onClick={() => this.props.tie()} />

  static getDerivedStateFromProps(props, state){
    return {
      canCheck: canCheck(props),
      isRoundFinished: props.table.turn === Turn.FINISHED
    }
  }

  render() {
    return (
      <div className="player-moves">
        {(() => this.getMove())()}
        <FoldMove onClick={() => this.props.fold()} />
      </div>
    )
  }

  getMove(){
    if (this.state.isRoundFinished){
      return this.tieMove
    } else {
      return this.state.canCheck ? this.checkMove : this.callMove
    }
  }
}

function mapStateToProps({ chips, opponents, player, table }){
  return { chips, opponents, player, table }
}

function mapDispatchToProps(dispatch){
  return {
    call: () => dispatch(callBet()),
    check: () => dispatch(check()),
    fold: () => dispatch(fold()),
    tie: () => dispatch(tie())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerMoves)