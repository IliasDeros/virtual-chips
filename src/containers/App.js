import React, { Component } from 'react'
import Nav from './Nav'
import Player from './Player'
import { connect } from 'react-redux'
import { loadPlayerId } from '../actions/player-action'

class App extends Component {
  componentDidMount(){
    this.props.loadPlayer()
  }

  render() {
    return ([
      this.props.player.id && <Nav key='nav' />,
      this.props.player.id ? <Player key='player' /> : <span>Loading Player...</span>
    ])
  }
}

function mapStateToProps({ player }){
  return { player }
}

function mapDispatchToProps(dispatch){
  return {
    loadPlayer(){ dispatch(loadPlayerId()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)