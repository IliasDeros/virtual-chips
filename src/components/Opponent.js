import React from 'react'

export default props => {
  return (
    <div>
      <label>Opponent: {props.opponent.name || props.opponent.id}</label><br/>
      <span>Bet: {props.opponent.chips.bet}</span><br/>
      <span>Total: {props.opponent.chips.total}</span>
    </div>
  )
}