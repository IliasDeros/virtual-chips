import { connect } from "react-redux";
import { StyledAction } from "./styles";
import selectors from "reducers/selectors";
import { call, fold, confirmPlayerBet } from "actions/firebase-action";

const ActionsCallComponent = ({
  call,
  callBet,
  confirmPlayerBet,
  fold,
  playerBet,
}) => {
  const isRaising = playerBet > callBet;

  if (isRaising) {
    return (
      <StyledAction action="bet" onClick={confirmPlayerBet}>
        Raise to {playerBet}
      </StyledAction>
    );
  }

  return (
    <>
      <StyledAction action="fold" onClick={fold}>
        Fold
      </StyledAction>
      <StyledAction action="call" onClick={call}>
        Call {callBet}
      </StyledAction>
    </>
  );
};

function mapStateToProps(state) {
  return {
    callBet: selectors.callBet(state),
    playerBet: selectors.getPlayerBet(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    call: () => dispatch(call()),
    fold: () => dispatch(fold()),
    confirmPlayerBet: () => dispatch(confirmPlayerBet()),
  };
}

export const ActionsCall = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsCallComponent);
