import { connect } from "react-redux";
import { StyledAction } from "./styles";
import { fold, tie } from "actions/firebase-action";

const ActionsShowdownComponent = ({ fold, tie }) => (
  <>
    <StyledAction action="fold" onClick={fold}>
      Fold
    </StyledAction>
    <StyledAction action="tie" onClick={tie}>
      Tie
    </StyledAction>
  </>
);

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    fold: () => dispatch(fold()),
    tie: () => dispatch(tie()),
  };
}

export const ActionsShowdown = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsShowdownComponent);
