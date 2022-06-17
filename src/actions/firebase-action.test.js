import { waitFor } from "@testing-library/react";
import { printReceived } from "jest-matcher-utils";
import "shared/modules/jest-mock-firebase";
import { uid } from "firebase/auth";
import { mockSetData } from "firebase/database";
import Button from "constants/button";
import State from "constants/state";
import Turn from "constants/turn";
import * as unit from "actions/firebase-action";
import { setPlayersMeFirst, setTurn } from "actions/table-action";

const tableId = "table_id";

/**
 * Jest only shows the first 3 calls to a spy.
 * This logs the entire call history
 */
const logCalls = (spy) => {
  const receivedCalls = spy.mock.calls.map(
    (call, i) => `${i}: ${printReceived(call)}`
  );
  console.error(`All Received:\n${receivedCalls.join("\n")}`);
};

describe("Hosting a table", () => {
  const player1 = { chips: 2500, name: "Player 1 (Me)" };
  const player2 = { chips: 2500, name: "Player 2" };
  const bigBlind = 50;
  const smallBlind = 25;
  let dispatch;
  let initialData;

  const connectToTable = (getState = () => {}) => {
    dispatch = jest.fn();
    mockSetData(initialData);
    return unit.connectToTable(tableId)(dispatch, getState);
  };

  const expectSetPlayer = async (playerData) => {
    const action = setPlayersMeFirst(
      expect.arrayContaining([expect.objectContaining(playerData)])
    );

    try {
      await waitFor(() =>
        expect(dispatch).toHaveBeenCalledWith(expect.objectContaining(action))
      );
    } catch (e) {
      logCalls(dispatch);
      throw e;
    }
  };

  beforeEach(() => {
    initialData = {
      table: {
        [tableId]: {},
      },
    };
  });

  describe("When there are 2 players", () => {
    beforeEach(async () => {
      initialData.table[tableId].player = {
        [uid]: player1,
        player_2: player2,
      };
      await connectToTable();
    });

    it("I play first", () =>
      expectSetPlayer({
        name: player1.name,
        isTurn: true,
      }));

    it("I am the dealer & small blind", () =>
      expectSetPlayer({
        name: player1.name,
        button: Button.DEALER_SMALL,
        turnBet: smallBlind,
        roundBet: smallBlind,
      }));

    it("D+1 is big blind", () =>
      expectSetPlayer({
        name: player2.name,
        button: Button.BIG_BLIND,
        turnBet: bigBlind,
        roundBet: bigBlind,
      }));

    describe("When I win the round", () => {
      const player1Winner = {
        ...player1,
        chips: 100,
        turnBet: bigBlind,
        roundBet: bigBlind * 2,
        state: State.CALLED,
      };

      const player2Folded = {
        ...player2,
        turnBet: bigBlind,
        roundBet: bigBlind,
        state: State.FOLDED,
      };

      const setupPlayers = () => {
        initialData.table[tableId].player = {
          [uid]: player1Winner,
          player_2: player2Folded,
        };
      };

      const setupTable = () => {
        initialData.table.round = 1;
        initialData.table.turn = Turn.TURN;
      };

      beforeEach(async () => {
        setupPlayers();
        setupTable();
        await connectToTable();
      });

      it("Resets turn to pre flop", () => {
        expect(dispatch).toHaveBeenCalledWith(setTurn(Turn.PRE_FLOP));
      });

      it("I am now the big blind", () =>
        expectSetPlayer({
          name: player1.name,
          button: Button.BIG_BLIND,
          turnBet: bigBlind,
          roundBet: bigBlind,
        }));

      it("D+1 is now dealer and small blind", () =>
        expectSetPlayer({
          button: Button.DEALER_SMALL,
          isTurn: true,
          name: player2.name,
          roundBet: smallBlind,
          turnBet: smallBlind,
        }));

      it("Distributes the pot to me", () =>
        expectSetPlayer({
          name: player1.name,
          chips:
            player1Winner.chips +
            player1Winner.roundBet +
            player2Folded.roundBet -
            bigBlind,
        }));

      it("Resets player 2's round bet", () =>
        expectSetPlayer({
          name: player2.name,
          chips: player2Folded.chips - smallBlind,
        }));
    });
  });

  describe("When there are 4 players", () => {
    const player3 = { chips: 2500, name: "Player 3" };
    const player4 = { chips: 2500, name: "Player 4" };

    beforeEach(async () => {
      initialData.table[tableId].player = {
        [uid]: player1,
        player_2: player2,
        player_3: player3,
        player_4: player4,
      };
      await connectToTable();
    });

    it("I am the dealer", () =>
      expectSetPlayer({
        name: player1.name,
        button: Button.DEALER,
      }));

    it("D+1 is small blind", () =>
      expectSetPlayer({
        name: player2.name,
        button: Button.SMALL_BLIND,
        turnBet: smallBlind,
        roundBet: smallBlind,
      }));

    it("D+2 is big blind", () =>
      expectSetPlayer({
        name: player3.name,
        button: Button.BIG_BLIND,
        turnBet: bigBlind,
        roundBet: bigBlind,
      }));
  });
});
