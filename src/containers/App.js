import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bet from '../components/Bet'
import { addToBet, fetchChips } from '../actions/chips-action'

class App extends Component {
  componentDidMount(){
    this.props.fetchChips()
  }

  render() {
    return (
      <div className="container">
        <Bet bet={this.props.chips} />
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
    addToBet: payload => dispatch(addToBet(payload)),
    fetchChips: () => dispatch(fetchChips())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)