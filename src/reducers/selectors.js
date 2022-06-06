import canCheck from "business/can-check";

export const selectors = {
  canMeCheck(state) {
    const players = this.getPlayers(state);
    return canCheck(players);
  },
  getPot(state) {
    return this.getTable(state).pot;
  },
  getPlayers(state) {
    return this.getTable(state).players;
  },
  getTable(state) {
    return state.table;
  },
  getTableTurn(state) {
    return this.getTable(state).turn;
  },
  getTableId(state) {
    return this.getTable(state).id;
  },
};

export default selectors;
