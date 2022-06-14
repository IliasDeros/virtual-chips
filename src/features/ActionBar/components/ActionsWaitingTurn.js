import { connect } from "react-redux";
import { StyledAction } from "./styles";
import selectors from "reducers/selectors";

const ActionsWaitingTurnComponent = ({ playerTurn }) => (
  <StyledAction disabled>Waiting for {playerTurn?.id}</StyledAction>
);

function mapStateToProps(state) {
  return {
    playerTurn: selectors.getCurrentTurnPlayer(state),
  };
}

function mapDispatchToProps() {
  return {};
}

export const ActionsWaitingTurn = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsWaitingTurnComponent);
