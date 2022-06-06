import Button from "../constants/button";
import Turn from "../constants/turn";

export default function canCheck({ chips, opponents, player, table }) {
  const isAlone = opponents.length === 0,
    isFirstTurn = table.turn === Turn.PRE_FLOP,
    isBigBlind = player.button === Button.BIG_BLIND,
    noRaise = opponents.every(({ chips: { bet } }) => bet <= 200);

  if (isAlone) {
    return true;
  }

  if (isFirstTurn && isBigBlind) {
    // can check if big blind and noone else has raised
    return noRaise;
  } else {
    // can check if all players bet 0
    return chips.bet === 0 && opponents.every(({ chips }) => chips.bet === 0);
  }
}
