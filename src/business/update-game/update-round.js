import Turn from "constants/turn";
import State from "constants/state";
import { calculateSidePots } from "business/calculate-sidepots";
import isGameWon from "business/is-game-won";
import { compose, increment, _update } from "./utils";

function _initializePlayerBet(player) {
  const chips =
    player.gameUpdates?.chips !== undefined
      ? player.gameUpdates.chips
      : player.chips;
  const state = chips > 0 ? State.IDLE : State.FOLDED;

  return _update(player, {
    state,
    roundBet: 0,
    turnBet: 0,
  });
}

function _updateLastRoundChips(player) {
  return _update(player, { lastRoundChips: player.chips || 0 });
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

      if (!sidepot.pot || sidepot.players.length === 0) {
        return sum;
      }

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

    const existingChips = player.chips || 0;
    return _update(
      player,
      earnings && {
        chips: existingChips + earnings,
      }
    );
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
