import React, { Component } from 'react'
import Nav from './Nav'
import Player from './Player'
import { connect } from 'react-redux'
import { loadPlayerId } from '../actions/player-action'
import { watchTable } from '../actions/table-action'
import Action from '../constants/action'
import Pot from '../components/Pot'
import Turn from '../components/Turn'

class App extends Component {
  componentDidMount(){
    this.props.loadPlayerId()
    this.props.watchTable()
  }

  render() {
    switch(this.props.table.action){
      case Action.NEXT_TURN:
        return <h1>Next Turn!</h1>
      case Action.WIN_ROUND:
        return <h1>Next ROUND</h1>
      default:
        return [
          this.props.player.id && <Nav key='nav' />,
          !isNaN(this.props.table.turn) && <Turn key='turn' turn={this.props.table.turn} />,
          !isNaN(this.props.table.pot) && <Pot key='pot' pot={this.props.table.pot} />,
          this.props.player.id ? <Player key='player' /> : <span key='player-loading'>Loading Player...</span>
        ]
    }
  }
}

function mapStateToProps({ player, table }){
  return { player, table }
}

function mapDispatchToProps(dispatch){
  return {
    loadPlayerId(){ dispatch(loadPlayerId()) },
    watchTable(){ dispatch(watchTable()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)