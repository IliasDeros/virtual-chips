import { connect } from "react-redux";
import { StyledAction } from "./styles";
import selectors from "reducers/selectors";
import { confirmPlayerBet, check, fold } from "actions/firebase-action";

const ActionsCheckComponent = ({
  check,
  confirmPlayerBet,
  fold,
  playerBet,
}) => {
  const isBetting = playerBet > 0;

  if (isBetting) {
    return (
      <StyledAction action="bet" onClick={confirmPlayerBet}>
        Bet {playerBet}
      </StyledAction>
    );
  }

  return (
    <>
      <StyledAction action="fold" onClick={fold}>
        Fold
      </StyledAction>
      <StyledAction action="check" onClick={check}>
        Check
      </StyledAction>
    </>
  );
};

function mapStateToProps(state) {
  return {
    playerBet: selectors.getPlayerBet(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    check: () => dispatch(check()),
    confirmPlayerBet: () => dispatch(confirmPlayerBet()),
    fold: () => dispatch(fold()),
  };
}

export const ActionsCheck = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActionsCheckComponent);
