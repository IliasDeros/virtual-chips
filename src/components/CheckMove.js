import React from 'react'

export default props => {
  return (
    <button 
      className="player-moves__move player-moves__move--check" 
      onClick={props.onClick}
    >
      CHECK
    </button>
  )
}
