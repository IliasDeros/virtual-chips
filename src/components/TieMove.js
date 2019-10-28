import React from 'react'

export default props => {
  return (
    <button 
      className="player-moves__move player-moves__move--tie" 
      onClick={props.onClick}
    >
      TIE
    </button>
  )
}
