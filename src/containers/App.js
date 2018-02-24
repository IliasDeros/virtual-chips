import React, { Component } from 'react'
import { connect } from 'react-redux'
import Number from '../components/Number'
import { addToBet } from '../actions/chips-action'

class App extends Component {
  render() {
    return (
      <div className="container">
        <Number value={this.props.chips} />
        <button onClick={() => this.props.addToBet(10)}>Add 10</button>
      </div>
    );
  }
}

function mapStateToProps({ chips }){
  return { chips }
}

function mapDispatchToProps(dispatch){
  return {
    addToBet: payload => dispatch(addToBet(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)