import { Component } from 'react'
import { loadPlayerId } from '../actions/player-action'
import { connect } from 'react-redux'

/**
 * Maintains player state
 */
class PlayerManager extends Component {
  componentDidMount(){
    this.props.loadPlayerId()
  }

  render() {
    return null
  }
}

function mapStateToProps(){
  return {}
}

function mapDispatchToProps(dispatch){
  return {
    loadPlayerId(){ dispatch(loadPlayerId()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerManager)
