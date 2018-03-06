import React, { Component } from 'react'
import Table from './Table'
import { connect } from 'react-redux'
import { loadPlayerId } from '../actions/table-action'

class App extends Component {
  componentDidMount(){
    this.props.loadPlayer()
  }

  render() {
    return (
      this.props.table.playerId
      ? <Table />
      : <span>Loading Player...</span>
    );
  }
}

function mapStateToProps({ table }){
  return { table }
}

function mapDispatchToProps(dispatch){
  return {
    loadPlayer(){ dispatch(loadPlayerId()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)