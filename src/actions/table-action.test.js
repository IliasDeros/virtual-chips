import * as unit from "./table-action";

describe("setPlayerOrder", () => {
  it("Sets player order", () => {
    expect(unit.setPlayerOrder(["1", "2"])).toEqual({
      type: "SET_PLAYER_ORDER",
      payload: ["1", "2"],
    });
  });
});

describe("setPot", () => {
  let dispatch;
  let getState;
  let statePot;
  const setPot = (pot) => unit.setPot(pot)(dispatch, getState);

  beforeEach(() => {
    dispatch = jest.fn();
    getState = () => ({ table: { pot: statePot } });
  });

  it("Does nothing when pot is same as state", () => {
    statePot = 12;
    const pot = statePot;

    setPot(pot);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it("Dispatches pot update", () => {
    statePot = 12;
    const pot = 20;

    setPot(pot);

    expect(dispatch).toHaveBeenCalledWith({
      type: "SET_POT",
      payload: pot,
    });
  });
});
