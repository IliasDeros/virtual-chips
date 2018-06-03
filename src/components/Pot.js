import React from 'react'

export default props => {
  return (
    <div className="pot-container">
      <label>Pot: </label>
      <span>{props.pot}</span>
    </div>
  )
}
