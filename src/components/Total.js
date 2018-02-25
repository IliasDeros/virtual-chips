import React from 'react'

export default props => {
  return (
    <div>
      <label>Your Chips: </label>
      <span>{props.total}</span>
    </div>
  )
}