import { Component } from "react";
import { connect } from "react-redux";
import {
  allIn,
  call,
  check,
  fold,
  raiseTo,
  tie,
} from "actions/firebase-action";
import selectors from "reducers/selectors";
import State from "constants/state";
import Turn from "constants/turn";
import { StyledAction, StyledActionBar } from "./styles";

const getState = (props) => {
  const { canCheck, isAlone, isMyTurn } = props;
  const isFolded = props.me.state === State.FOLDED;
  const isTied = props.me.state === State.TIED;
  const isWaitingTurn = !isMyTurn;
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
    const { call, callBet, check, className, fold, playerTurn, raiseTo, tie } =
      this.props;
    const state = getState(this.props);
    const canFold = ["FOLD", "CAN_BET", "CAN_CHECK", "CAN_TIE"].includes(state);
    const canBet = ["CAN_BET", "CAN_CHECK"].includes(state);

    return (
      <StyledActionBar className={className}>
        {state === "WAITING_FOR_PLAYERS" && (
          <StyledAction disabled>Waiting on more players</StyledAction>
        )}
        {state === "IS_FOLDED" && (
          <StyledAction action="fold" disabled>
            Folded
          </StyledAction>
        )}
        {state === "WAITING_TURN" && (
          <StyledAction disabled>Waiting for {playerTurn?.id}</StyledAction>
        )}
        {canFold && (
          <StyledAction action="fold" onClick={fold}>
            Fold
          </StyledAction>
        )}
        {state === "CAN_CHECK" && (
          <StyledAction action="check" onClick={check}>
            Check
          </StyledAction>
        )}
        {state === "CAN_TIE" && (
          <StyledAction action="tie" onClick={tie}>
            Tie
          </StyledAction>
        )}
        {state === "IS_TIED" && (
          <StyledAction action="tie" disabled>
            Tied
          </StyledAction>
        )}
        {state === "CAN_BET" && (
          <StyledAction action="call" onClick={call}>
            Call {callBet}
          </StyledAction>
        )}

        {canBet && (
          <StyledAction action="bet" onClick={() => raiseTo(50)}>
            Bet 50
          </StyledAction>
        )}

        {canBet && (
          <StyledAction action="bet" onClick={() => raiseTo(200)}>
            Bet 200
          </StyledAction>
        )}
      </StyledActionBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    callBet: selectors.callBet(state),
    canCheck: selectors.canMeCheck(state),
    isAlone: selectors.getPlayers(state).length <= 1,
    isMyTurn: selectors.isMyTurn(state),
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
