import { connect } from "react-redux";
import { StyledAction } from "./styles";
import selectors from "reducers/selectors";

const ActionsWaitingTurnComponent = ({ state }) =>
  state === "WAITING_TURN" ? (
    <StyledAction disabled>Waiting for {playerTurn?.id}</StyledAction>
  ) : null;

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
