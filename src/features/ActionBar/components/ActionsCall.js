import { connect } from "react-redux";
import { StyledAction } from "./styles";
import selectors from "reducers/selectors";
import { fold, call } from "actions/firebase-action";

const ActionsCallComponent = ({ call, callBet, fold }) => (
  <>
    <StyledAction action="fold" onClick={fold}>
      Fold
    </StyledAction>
    <StyledAction action="call" onClick={call}>
      Call {callBet}
    </StyledAction>
  </>
);

function mapStateToProps(state) {
  return {
    callBet: selectors.callBet(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    call: () => dispatch(call()),
    fold: () => dispatch(fold()),
  };
}

export const ActionsCall = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsCallComponent);
