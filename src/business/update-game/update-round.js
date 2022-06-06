import Turn from "constants/turn";
import State from "constants/state";
import { calculateSidePots } from "business/calculate-sidepots";
import isGameWon from "business/is-game-won";
import { compose, increment, _update } from "./utils";

function _initializePlayerBet(player) {
  const state = player.chips > 0 ? State.IDLE : State.FOLDED;
  return _update(player, {
    state,
    roundBet: 0,
    turnBet: 0,
  });
}

function _updateLastRoundChips(player) {
  return _update(player, { lastRoundChips: player.chips || 0 });
}

function _winRoundUpdates(players) {
  const sidepots = calculateSidePots(players);
  const winners = players.filter(({ state }) => state !== State.FOLDED);
  const isWinner = (player) => winners.includes(player);
  const addToTotal = (updates, gains) => (player) => {
    const key = `player/${player.id}/chips`;
    const playerTotal = updates[key] || player.chips;
    updates[key] = playerTotal + gains;
  };

  const distributeSidepotToPlayers = (updates, sidepot) => {
    const winningPlayers = sidepot.players.filter(isWinner);

    // Distribute pot between winners
    if (winningPlayers.length) {
      winningPlayers.forEach(
        addToTotal(updates, sidepot.pot / winningPlayers.length)
      );
    }

    // Distribute pot between non-winners
    else {
      sidepot.players.forEach(
        addToTotal(updates, sidepot.pot / sidepot.players.length)
      );
    }

    return updates;
  };

  return sidepots.reduce(distributeSidepotToPlayers, {});
}

function _updateRound(table) {
  return _update(table, { round: increment(table.round) });
}

function _updateTurn(table) {
  return _update(table, { turn: Turn.PRE_FLOP });
}

const _updatePlayerChips = (players) => {
  const sidepots = calculateSidePots(players);

  return (player) => {
    const winners = players.filter(({ state }) => state !== State.FOLDED);
    const earnings = sidepots.reduce((sum, sidepot) => {
      const isWinner = winners.includes(player);
      const noWinners = !winners.some((w) => sidepot.players.includes(w));
      let share = 0;

      // I'm a winner: get my share
      if (isWinner) {
        share = sidepot.pot / winners.length;
      }

      // Sidepot has no winner: earn back my share
      if (noWinners) {
        share = sidepot.pot / sidepot.players.length;
      }

      return sum + share;
    }, 0);

    const existingChips = player.chips || 0 + player.roundBet || 0;
    return _update(player, earnings && { chips: existingChips + earnings });
  };
};

export default function updateRound({ players, table }) {
  if (!isGameWon(players)) {
    return { players, table };
  }

  return {
    players: players.map(
      compose(
        _initializePlayerBet,
        _updateLastRoundChips,
        _updatePlayerChips(players)
      )
    ),
    table: compose(_updateTurn, _updateRound)(table),
  };
}
