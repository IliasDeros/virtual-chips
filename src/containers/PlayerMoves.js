import React, { Component } from 'react'
import canCheck from '../business/can-check'
import { connect } from 'react-redux'
import { callBet } from '../actions/chips-action'
import { check, fold } from '../actions/player-action'
import CallMove from '../components/CallMove'
import CheckMove from '../components/CheckMove'
import FoldMove from '../components/FoldMove'

class PlayerMoves extends Component {
  state = {}

  static getDerivedStateFromProps(props, state){
    return {
      canCheck: canCheck(props)
    }
  }

  render() {
    const callBtn = <CallMove onClick={() => this.props.call()} />,
          checkBtn = <CheckMove onClick={() => this.props.check()} />

    return (
      <div className="player-moves-container">
        {(() => this.state.canCheck ? checkBtn : callBtn)()}
        <br/>
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