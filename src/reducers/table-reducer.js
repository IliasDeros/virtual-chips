const initialState = {
  id: "alpha",
  pot: 0,
  players: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case "SET_TABLE_ID":
      state = {
        ...state,
        id: action.payload,
      };
      break;
    case "SET_POT":
      state = {
        ...state,
        pot: action.payload,
      };
      break;
    case "SET_TURN":
      state = {
        ...state,
        turn: action.payload,
      };
      break;
    // no default
    case "SET_PLAYERS_ME_FIRST":
      state = {
        ...state,
        players: action.payload,
      };
    // no default
  }

  return state;
}
