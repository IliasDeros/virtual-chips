import React from 'react'
import { connect } from 'react-redux'

const PlayerToken = (props) => (
  props.token ? <span> - {props.token}</span> : null
)

function mapStateToProps({ player }){
  return { token: player.token }
}

export default connect(mapStateToProps)(PlayerToken)