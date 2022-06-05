export const selectors = {
  getPot(state) {
    return state.table.pot;
  },
  getPlayers(state) {
    return state.table.players;
  },
};

export default selectors;
