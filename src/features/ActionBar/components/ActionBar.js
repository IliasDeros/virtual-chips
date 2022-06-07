import { Component } from "react";
import { connect } from "react-redux";
import { allIn, call, raiseTo } from "actions/firebase-action";
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

  return "CAN_BET";
};

/**
 * Big buttons at the bottom of screen
 */
class ActionBar extends Component {
  render() {
    const { allIn, call, callBet, check, fold, me, playerTurn, raiseTo, tie } =
      this.props;
    const state = getState(this.props);
    const canFold = ["FOLD", "CAN_BET", "CAN_CHECK", "CAN_TIE"].includes(state);
    const canBet = ["CAN_BET", "CAN_CHECK"].includes(state);

    return (
      <div>
        <div>
          Current Bet: <strong>{me.turnBet}</strong>
        </div>
        <div>
          Chips: <strong>{me.chips}</strong>
        </div>
        {canBet && (
          <div>
            <button onClick={allIn}>All In</button>
            <br />
            <button onClick={() => raiseTo(200)}>Bet 200</button>
            <br />
            <button onClick={() => raiseTo(50)}>Bet 50</button>
          </div>
        )}

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
        {state === "CAN_BET" && <button onClick={call}>Call {callBet}</button>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    callBet: selectors.callBet(state),
    canCheck: selectors.canMeCheck(state),
    isAlone: selectors.getPlayers(state).length <= 1,
    isShowdown: selectors.getTableTurn(state) === Turn.FINISHED,
    me: selectors.getMe(state) || {},
    playerTurn: selectors.getPlayers(state).find((player) => player.isTurn),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    allIn: () => dispatch(allIn()),
    call: () => dispatch(call()),
    check: () => dispatch(check()),
    fold: () => dispatch(fold()),
    raiseTo: (amount) => dispatch(raiseTo(amount)),
    tie: () => dispatch(tie()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
