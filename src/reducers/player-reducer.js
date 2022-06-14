const initialState = {
  selectedBet: 0,
};

export default function (state = initialState, action) {
  switch (action.type) {
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
