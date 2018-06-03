import React from 'react'
import Turn from '../constants/turn'

export default props => {
  const card = <span>[ ] </span>

  switch (props.turn){
    case Turn.FLOP:
      return <div className="turn turn-flop">
        {card}{card}{card}
      </div>
    case Turn.TURN:
      return <div className="turn turn-turn">
        {card}{card}{card}{card}
      </div>
    case Turn.RIVER:
    case Turn.FINISHED:
      return <div className="turn turn-river">
        {card}{card}{card}{card}{card}
      </div>
    default:
      return <div className="turn turn-pre-flop"></div>
  }
}
