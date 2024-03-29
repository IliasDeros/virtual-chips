import Button from "constants/button";
import State from "constants/state";
import getButton from "business/get-button";
import updateRound from "./update-round";
import updateTurn from "./update-turn";
import { compose } from "shared/modules/utils";
import { _get, _update } from "./utils";

const defaultBigBlind = 50;

function _getBlindBet(table, button) {
  const { bigBlind = defaultBigBlind } = table;

  switch (button) {
    case Button.BIG_BLIND:
      return bigBlind;
    case Button.DEALER_SMALL:
    case Button.SMALL_BLIND:
      return Math.ceil(bigBlind / 2);
    default:
      return 0;
  }
}

function _updateButtons({ players, table }) {
  return {
    table,
    players: players.map((p) => {
      // If we won a game, compute button for next round
      const updatedTable = { ...table, ...table.gameUpdates };
      const button = getButton(updatedTable, players, p);
      const hasChangedButton = p.button !== button;
      return _update(p, hasChangedButton && { button: button || null });
    }),
  };
}

function _updateBlinds({ players, table }) {
  const getAllChips = (player) => {
    return _get(player, "chips", 0) + _get(player, "roundBet", 0);
  };

  return {
    table,
    players: players.map((p) => {
      const { button } = p.gameUpdates || {};
      const noChange = !button;

      if (noChange) {
        return p;
      }

      const blind = _getBlindBet(table, button);
      const chips = getAllChips(p);
      const isAllin = blind > chips;

      if (isAllin) {
        return _update(p, {
          chips: 0,
          roundBet: chips,
          turnBet: chips,
        });
      }

      return _update(p, {
        chips: chips - blind,
        roundBet: blind,
        turnBet: blind,
      });
    }),
  };
}

function _updatePlayerStates({ players, table }) {
  return {
    table,
    players: players.map((p) => {
      const { button, chips = 0, turnBet } = p.gameUpdates || {};
      const noButtonChange = !button;

      if (noButtonChange) {
        return p;
      }

      const isAllIn = chips === 0 && turnBet > 0;
      const isFolded = chips === 0 && !turnBet;

      let state = isAllIn && State.ALL_IN;
      state = state || (isFolded && State.FOLDED);
      state = state || State.IDLE;
      return _update(p, { state });
    }),
  };
}

function _initializePlayerOrder({ players, table }) {
  const playerOrderSeparator = ",";
  const missingIds = players
    .filter(({ id }) => !table.playerOrder?.includes(id))
    .map(({ id }) => id)
    .join(playerOrderSeparator);

  const newOrder =
    missingIds && [table.playerOrder, missingIds].filter((x) => x).join(",");

  return {
    players,
    table: _update(table, newOrder && { playerOrder: newOrder }),
  };
}

/**
 * Get the updates required to fix the state of the game:
 * - Set the buttons & blinds according to player # and round
 * - Proceed to next turn when everyone played
 * - Proceed to next round when all losers folded
 * - Add or remove players to the order of play
 *
 * @param table
 * @param players
 */
export function updateGame(table, players) {
  return compose(
    _initializePlayerOrder,
    _updatePlayerStates,
    _updateBlinds,
    _updateButtons,
    updateTurn,
    updateRound
  )({ players, table });
}

export function hasGameUpdates(updatedGame) {
  const { players, table } = updatedGame;
  return table.gameUpdates || players.some((p) => p.gameUpdates);
}
