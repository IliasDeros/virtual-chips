import React, { Component } from 'react'
import { connect } from 'react-redux'
import { watchOpponents } from '../actions/opponents-action'
import OpponentsList from '../components/OpponentsList'

class Nav extends Component {
  componentDidMount(){
    this.props.watchOpponents()
  }

  render() {
    return (
      <OpponentsList opponents={this.props.opponents} />
    );
  }
}

function mapStateToProps({ opponents }){
  return { opponents }
}

function mapDispatchToProps(dispatch){
  return {
    watchOpponents: payload => dispatch(watchOpponents(payload))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Nav)