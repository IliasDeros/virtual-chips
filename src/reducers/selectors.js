export const selectors = {
  getPot(state) {
    return state.table.pot;
  },
  getPlayers(state) {
    return state.table.players;
  },
  getTableId(state) {
    return state.table.id;
  },
};

export default selectors;
