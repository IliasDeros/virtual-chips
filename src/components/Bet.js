import React from 'react'

export default props => {
  return (
    <div>
      <label>Your Bet: </label>
      <span>{props.bet}</span>
    </div>
  )
}