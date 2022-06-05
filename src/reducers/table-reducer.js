const initialState = {
  id: "default",
  pot: 0,
  players: [],
};

function setFirstPlayerHost(state) {
  if (!state.players.length) {
    return {
      ...state,
      isHost: true,
    };
  }
}

export default function (state = initialState, action) {
  switch (action.type) {
    case "SET_ACTION":
      state = {
        ...state,
        action: action.payload,
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
