import React, { Component } from 'react'
import Nav from './Nav'
import Player from './Player'
import PlayerMoves from './PlayerMoves'
import Action from '../constants/action'
import LoadingPlayer from '../components/LoadingPlayer'
import TableScreen from 'features/TableScreen/components/TableScreen'

class App extends Component {
  renderAppContents() {
    switch(this.props.table.action){
      case Action.NEXT_TURN:
        return <h1>Next Turn!</h1>
      case Action.WIN_ROUND:
        return <h1>Next ROUND</h1>
      default:
        return <main className="application">
          {this.props.player.id && <Nav />}
          {this.props.player.id ? <Player /> : <LoadingPlayer />}
          <PlayerMoves />
        </main>
    }
  }

  render() {
    return <React.Fragment>
      <TableScreen />
    </React.Fragment>
  }
}

export default App
