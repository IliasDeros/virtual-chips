import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bet from '../components/Bet'
import Total from '../components/Total'
import { addToBet, watchChips } from '../actions/chips-action'
import { fold, loadPlayerName, loadPlayerState } from '../actions/player-action'

class Table extends Component {
  componentDidMount(){
    this.props.watchChips()
    this.props.loadPlayerName()
    this.props.loadPlayerState()
  }

  render() {
    return (
      this.props.chips
      ? <div className="container">
          <h2>{this.props.player.name || this.props.player.id}</h2>
          <Bet bet={this.props.chips.bet} />
          <button onClick={() => this.props.addToBet(10)}>Add 10</button>
          <br/>
          <button onClick={() => this.props.addToBet(-10)}>Remove 10</button>
          <br/><br/>
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
    addToBet: payload => dispatch(addToBet(payload)),
    fold: () => dispatch(fold()),
    loadPlayerName: () => dispatch(loadPlayerName()),
    loadPlayerState: () => dispatch(loadPlayerState()),
    watchChips: () => dispatch(watchChips())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)