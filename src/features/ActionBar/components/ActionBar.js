import { Component } from "react";
import { connect } from "react-redux";
import selectors from "reducers/selectors";
import State from "constants/state";
import Turn from "constants/turn";
import { ActionsCall } from "./ActionsCall";
import { ActionsCheck } from "./ActionsCheck";
import { ActionsFolded } from "./ActionsFolded";
import { ActionsShowdown } from "./ActionsShowdown";
import { ActionsTied } from "./ActionsTied";
import { ActionsWaitingForPlayers } from "./ActionsWaitingForPlayers";
import { ActionsWaitingTurn } from "./ActionsWaitingTurn";
import { StyledActionBar } from "./styles";

const getActions = (props) => {
  const { canCheck, isAlone, isMyTurn } = props;
  const isFolded = props.me.state === State.FOLDED;
  const isTied = props.me.state === State.TIED;
  const isWaitingTurn = !isMyTurn;
  const isShowdown = props.isShowdown;

  if (isAlone) {
    return ActionsWaitingForPlayers;
  }

  if (isFolded) {
    return ActionsFolded;
  }

  if (isTied) {
    return ActionsTied;
  }

  if (isShowdown) {
    return ActionsShowdown;
  }

  if (isWaitingTurn) {
    return ActionsWaitingTurn;
  }

  if (canCheck) {
    return ActionsCheck;
  }

  return ActionsCall;
};
/**
 * Big buttons at the bottom of screen
 */
class ActionBar extends Component {
  render() {
    const { className } = this.props;
    const Actions = getActions(this.props);

    return (
      <StyledActionBar className={className}>
        <Actions />
      </StyledActionBar>
    );
  }
}

function mapStateToProps(state) {
  return {
    canCheck: selectors.canMeCheck(state),
    isAlone: selectors.getPlayers(state).length <= 1,
    isMyTurn: selectors.isMyTurn(state),
    isShowdown: selectors.getTableTurn(state) === Turn.FINISHED,
    me: selectors.getMe(state) || {},
  };
}

export default connect(mapStateToProps)(ActionBar);
