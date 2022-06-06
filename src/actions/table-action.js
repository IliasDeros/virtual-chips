import Turn from "constants/turn";
import selectors from "reducers/selectors";

export const setTurn = (turn) => ({
  type: "SET_TURN",
  payload: turn || Turn.PRE_FLOP,
});

export const setPot = (payload) => {
  return (dispatch, getState) => {
    const oldPot = selectors.getPot(getState());
    const isSamePot = payload === oldPot;

    if (isSamePot) {
      return;
    }

    dispatch({ type: "SET_POT", payload });
  };
};

export const setPlayersMeFirst = (payload) => ({
  type: "SET_PLAYERS_ME_FIRST",
  payload,
});

export const setTableId = (payload) => ({
  type: "SET_TABLE_ID",
  payload,
});
