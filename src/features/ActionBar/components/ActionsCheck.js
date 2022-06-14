import { connect } from "react-redux";
import { StyledAction } from "./styles";
import selectors from "reducers/selectors";
import { fold, check } from "actions/firebase-action";

const ActionsCheckComponent = ({ check, fold }) => (
  <>
    <StyledAction action="fold" onClick={fold}>
      Fold
    </StyledAction>
    <StyledAction action="check" onClick={check}>
      Check
    </StyledAction>
  </>
);

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    check: () => dispatch(check()),
    fold: () => dispatch(fold()),
  };
}

export const ActionsCheck = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsCheckComponent);
