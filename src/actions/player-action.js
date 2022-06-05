import Fingerprint from "fingerprintjs2";
import { get, getDatabase, onValue, ref, set } from "firebase/database";
import State from "../constants/state";
import getToken from "../business/get-token";
import selectors from "reducers/selectors";

function getFireRef(endpoint, state) {
  const [me] = selectors.getPlayers(state);
  let url = `table/${state.table.id}/player/${me.id}/${endpoint}`;
  const db = getDatabase();
  return ref(db, url);
}

export function loadPlayerId() {
  return (dispatch, getState) => {
    new Fingerprint().get((result) =>
      dispatch({
        type: "SET_PLAYER_ID",
        payload: result,
      })
    );
  };
}

export function loadPlayerName() {
  return (dispatch, getState) => {
    const state = getState();

    onValue(getFireRef("name", state), async (snapshot) => {
      let playerName = snapshot.val();

      if (playerName) {
        dispatch({
          type: "SET_PLAYER_NAME",
          payload: playerName,
        });
      } else {
        // generate a random player name
        let res = await fetch(
          "https://cors-anywhere.herokuapp.com/http://namey.muffinlabs.com/name.json"
        );
        const [name] = await res.json();

        set(getFireRef("name", state), name);
      }
    });
  };
}

export function loadPlayerState() {
  return (dispatch, getState) => {
    const state = getState();

    onValue(getFireRef("state", state), (snapshot) => {
      let playerState = snapshot.val();

      if (playerState) {
        dispatch({
          type: "SET_PLAYER_STATE",
          payload: playerState,
        });
      } else {
        set(getFireRef("state", state), State.IDLE);
      }
    });
  };
}

export function loadPlayerToken() {
  return (dispatch, getState, done = function () {}) => {
    onRoundUpdate(getState().table, (table) => {
      updateToken(table);
      done();
    });

    function updateToken(table) {
      const state = getState(),
        token = getToken(table, state.player);

      dispatch({
        type: "SET_PLAYER_TOKEN",
        payload: token,
      });
      set(getFireRef("token", state), token);
    }
  };
}

export function allIn() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.ALL_IN);
  };
}

export function bet() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.BET);
  };
}

export function call() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.CALLED);
  };
}

export function check() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.CHECKED);
  };
}

export function fold() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.FOLDED);
  };
}

export function idle() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.IDLE);
  };
}

export function tie() {
  return (_, getState) => {
    set(getFireRef("state", getState()), State.TIED);
  };
}

// Watch table round update and execute a callback with the table
function onRoundUpdate(table, cb) {
  let roundRef = `table/${table.id}/round`;

  // watch table round
  const db = getDatabase();
  onValue(ref(db, roundRef), async (roundSnapshot) => {
    const playerSnapshot = await loadPlayers(table),
      updatedTable = {
        player: playerSnapshot.val(),
        round: roundSnapshot.val(),
      };

    cb(updatedTable);
  });
}

function loadPlayers(table) {
  let playerRef = `table/${table.id}/player`;
  const db = getDatabase();
  return get(ref(db, playerRef));
}
