export const resetBet = {
  type: "RESET_BET",
};

/**
 * Choose a bet. It needs to be confirmed before ending
 * the turn
 */
export const selectBet = (bet = 0) => ({
  type: "SELECT_BET",
  payload: bet,
});
