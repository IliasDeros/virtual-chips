import React from 'react'
import Opponent from './Opponent'

export default props => {
  return (
    props.opponents && props.opponents.map(opponent =>
      <Opponent key={opponent.id} opponent={opponent} />
    )
  )
}