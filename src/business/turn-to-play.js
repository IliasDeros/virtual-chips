import State from '../constants/state'
import isTurnFinished from './is-turn-finished'

function isActive(player) {
  return ![State.ALL_IN, State.FOLDED].includes(player.state)
}

/**
 * Returns the ID of the player who's turn it is to play.
 *
 * Before flop - the last player to act is always the Big Blind.
 * After flop - the last player to act is always the Button
 * Straddle - the pre-flop order of play can be slightly altered if
 *            there is a player who straddles. A straddle is when the
 *            player seated just to the left of the Big Blind (usually
 *            UTG) posts a double big blind bet in front of him prior
 *            to the cards being dealt.
 *            Essentially, he is buying the right to act last before
 *            the flop. In the case of a straddle, the person seated
 *            just to the left of the “straddler,” goes first pre-flop
 *            once the straddle has been wagered.
 * Rules: https://automaticpoker.com/poker-basics/texas-holdem-order-of-play/
 */
export default function turnToPlay(table){
  if (isTurnFinished(table)) {
    return null
  }

  let firstToPlay
  const playerIds = Object.keys(table.player)
  const players = playerIds.map(key => table.player[key])
  const activePlayers = players.filter(isActive)
  const wrap = (index) => index % players.length
  const dealerIndex = wrap(table.round)
  const bigBlindIndex = dealerIndex + 2
  const isHeadsUp = activePlayers.length === 2

  // PRE-FLOP
  if (!table.turn) {
    // The dealer plays first, otherwise "under the gun" plays first
    if (isHeadsUp) {
      firstToPlay = dealerIndex
    } else {
      firstToPlay = wrap(bigBlindIndex + 1)
    }
  }

  // POST-FLOP
  if (table.turn) {
    // Left of dealer plays first
    firstToPlay = wrap(dealerIndex + 1)
  }

  // Go around table to find the next player
  let indexToPlay = firstToPlay
  let player = players[indexToPlay]
  while (!isActive(player)) {
    if (++indexToPlay === players.length) {
      indexToPlay = 0
    }

    player = players[indexToPlay]
  }

  return playerIds[indexToPlay]
}
