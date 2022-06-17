import { waitFor } from "@testing-library/react";
import { printReceived } from "jest-matcher-utils";
import "shared/modules/jest-mock-firebase";
import { uid } from "firebase/auth";
import { mockSetData } from "firebase/database";
import Button from "constants/button";
import * as unit from "actions/firebase-action";
import { setPlayersMeFirst } from "actions/table-action";

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
  const player1 = { name: "Player 1 (Me)" };
  const player2 = { name: "Player 2" };
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
        isTurn: false,
      }));

    it("I am the dealer & small blind", () =>
      expectSetPlayer({
        name: player1.name,
        button: Button.DEALER_SMALL,
      }));

    it("D+1 is big blind", () =>
      expectSetPlayer({
        name: player2.name,
        button: Button.BIG_BLIND,
      }));

    describe("When it is the second round", () => {
      beforeEach(async () => {
        // First round is "0"
        initialData.table[tableId].round = 1;
        await connectToTable();
      });

      it("D+1 plays first", () =>
        expectSetPlayer({
          name: player2.name,
          isTurn: false,
        }));

      it("I am the big blind", () =>
        expectSetPlayer({
          name: player1.name,
          button: Button.BIG_BLIND,
        }));

      it("D+1 is the dealer & small blind", () =>
        expectSetPlayer({
          name: player2.name,
          button: Button.DEALER_SMALL,
        }));
    });
  });

  describe("When there are 4 players", () => {
    const player3 = { name: "Player 3" };
    const player4 = { name: "Player 4" };

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
      }));

    it("D+2 is big blind", () =>
      expectSetPlayer({
        name: player3.name,
        button: Button.BIG_BLIND,
      }));
  });
});
