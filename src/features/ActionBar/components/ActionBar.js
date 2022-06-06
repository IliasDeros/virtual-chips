import { Component } from "react";
import { connect } from "react-redux";
import { call } from "actions/firebase-action";
import { check, fold, tie } from "actions/player-action";
import selectors from "reducers/selectors";
import State from "constants/state";
import Turn from "constants/turn";

const getState = (props) => {
  const { isAlone, canCheck } = props;
  const isFolded = props.me.state === State.FOLDED;
  const isTied = props.me.state === State.TIED;
  const isWaitingTurn = !props.me.isTurn;
  const isShowdown = props.isShowdown;

  if (isAlone) {
    return "WAITING_FOR_PLAYERS";
  }

  if (isFolded) {
    return "IS_FOLDED";
  }

  if (isTied) {
    return "IS_TIED";
  }

  if (isShowdown) {
    return "CAN_TIE";
  }

  if (isWaitingTurn) {
    return "WAITING_TURN";
  }

  if (canCheck) {
    return "CAN_CHECK";
  }

  return "CAN_CALL";
};

/**
 * Big buttons at the bottom of screen
 */
class ActionBar extends Component {
  render() {
    const { call, check, fold, playerTurn, tie } = this.props;
    const state = getState(this.props);
    const canFold = ["FOLD", "CAN_CALL", "CAN_CHECK", "CAN_TIE"].includes(
      state
    );

    return (
      <div>
        {state === "WAITING_FOR_PLAYERS" && (
          <button disabled>Waiting on more players</button>
        )}
        {state === "IS_FOLDED" && <button disabled>Folded</button>}
        {state === "WAITING_TURN" && (
          <button disabled>Waiting for {playerTurn?.id}</button>
        )}
        {canFold && <button onClick={fold}>Fold</button>}
        {state === "CAN_CHECK" && <button onClick={check}>Check</button>}
        {state === "CAN_TIE" && <button onClick={tie}>Tie</button>}
        {state === "IS_TIED" && <button disabled>Tied</button>}
        {state === "CAN_CALL" && <button onClick={call}>Call</button>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    canCheck: selectors.canMeCheck(state),
    isAlone: selectors.getPlayers(state).length <= 1,
    isShowdown: selectors.getTableTurn(state) === Turn.FINISHED,
    me: selectors.getPlayers(state)[0] || {},
    playerTurn: selectors.getPlayers(state).find((player) => player.isTurn),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    call: () => dispatch(call()),
    check: () => dispatch(check()),
    fold: () => dispatch(fold()),
    tie: () => dispatch(tie()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
