import { selectors } from "reducers/selectors";
import reducer from "./table-reducer";
import Turn from "constants/turn";

const reduce = (action) => reducer({}, action);

it("Returns initial state", () => {
  expect(reducer(undefined, {})).toMatchObject({
    id: "alpha",
    pot: 0,
    players: [],
  });
});

describe("SET_POT", () => {
  it("Updates pot", () => {
    const payload = 1000;
    const table = reduce({ type: "SET_POT", payload });

    const actual = selectors.getPot({ table });

    expect(actual).toEqual(payload);
  });
});

describe("SET_TURN", () => {
  it("Updates turn", () => {
    const payload = Turn.PRE_FLOP;
    const table = reduce({ type: "SET_TURN", payload });

    const actual = selectors.getTableTurn({ table });

    expect(actual).toEqual(payload);
  });
});

describe("SET_PLAYERS_ME_FIRST", () => {
  it("Updates players", () => {
    const payload = ["player1", "player2"];
    const table = reduce({ type: "SET_PLAYERS_ME_FIRST", payload });

    const actual = selectors.getPlayers({ table });

    expect(actual).toEqual(payload);
  });
});

describe("SET_PLAYER_ORDER", () => {
  it("Updates player order", () => {
    const payload = "player1,player2";
    const table = reduce({ type: "SET_PLAYER_ORDER", payload });

    const actual = selectors.getPlayerOrder({ table });

    expect(actual).toEqual(payload);
  });
});
