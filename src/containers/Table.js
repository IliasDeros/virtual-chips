import React, { Component } from 'react'
import { connect } from 'react-redux'
import Bet from '../components/Bet'
import Total from '../components/Total'
import { addToBet, watchChips } from '../actions/chips-action'

class Table extends Component {
  componentDidMount(){
    this.props.watchChips()
  }

  render() {
    return (
      this.props.chips
      ? <div className="container">
          <Bet bet={this.props.chips.bet} />
          <button onClick={() => this.props.addToBet(10)}>Add 10</button>
          <br/>
          <button onClick={() => this.props.addToBet(-10)}>Remove 10</button>
          <Total total={this.props.chips.total} />
        </div>
      : <span>Loading...</span>
    );
  }
}

function mapStateToProps({ chips }){
  return { chips }
}

function mapDispatchToProps(dispatch){
  return {
    addToBet: payload => dispatch(addToBet(payload)),
    watchChips: () => dispatch(watchChips())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Table)