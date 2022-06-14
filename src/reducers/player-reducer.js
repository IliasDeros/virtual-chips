const initialState = {
  selectedBet: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "RESET_BET":
      state = {
        ...state,
        selectedBet: 0,
      };
      break;
    case "SELECT_BET":
      state = {
        ...state,
        selectedBet: action.payload,
      };
      break;

    // no default
  }

  return state;
}
