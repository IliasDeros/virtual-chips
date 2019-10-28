import React, { Component } from 'react'
import { connect } from 'react-redux'
import { watchOpponents } from '../actions/opponents-action'
import OpponentsList from '../components/OpponentsList'
import Pot from '../components/Pot'
import Turn from '../components/Turn'

class Nav extends Component {
  componentDidMount(){
    this.props.watchOpponents()
  }

  render() {
    return (
      <div className="topnav">
        <OpponentsList opponents={this.props.opponents} />
        <div className="topnav__table-stats">
          <Pot pot={this.props.table.pot} />
          {!isNaN(this.props.table.turn) && <Turn turn={this.props.table.turn} />}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ opponents, table }){
  return { opponents, table }
}

function mapDispatchToProps(dispatch){
  return {
    watchOpponents: payload => dispatch(watchOpponents(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)