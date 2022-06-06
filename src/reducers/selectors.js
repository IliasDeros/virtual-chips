import canCheck from "business/can-check";

export const selectors = {
  canMeCheck(state) {
    const players = this.getPlayers(state);
    return canCheck(players);
  },
  isMyTurn(state) {
    const me = this.getMe(state);
    return me.isTurn;
  },
  getMe(state) {
    return this.getPlayers(state)[0];
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
