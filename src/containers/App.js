import React, { Component } from 'react'
import Table from './Table'
import { connect } from 'react-redux'

class App extends Component {
  render() {
    return (
      <Table />
    );
  }
}

function mapStateToProps(){
  return { }
}

function mapDispatchToProps(){
  return { }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)