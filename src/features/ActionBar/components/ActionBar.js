import { Component } from "react";
import { connect } from "react-redux";
import { fold } from "actions/player-action";
import selectors from "reducers/selectors";
import State from "constants/state";

const getState = (props) => {
  const { isAlone } = props;
  const isFolded = props.me.state === State.FOLDED;
  const isWaitingTurn = !props.me.isTurn;

  if (isAlone) {
    return "WAITING_FOR_PLAYERS";
  }

  if (isFolded) {
    return "IS_FOLDED";
  }

  if (isWaitingTurn) {
    return "WAITING_TURN";
  }

  return "FOLD";
};

/**
 * Big buttons at the bottom of screen
 */
class ActionBar extends Component {
  render() {
    const { fold, playerTurn } = this.props;
    const state = getState(this.props);

    return (
      <div>
        {state === "WAITING_FOR_PLAYERS" && (
          <button disabled>Waiting on more players</button>
        )}
        {state === "IS_FOLDED" && <button disabled>Folded</button>}
        {state === "WAITING_TURN" && (
          <button disabled>Waiting for {playerTurn?.id}</button>
        )}
        {state === "FOLD" && <button onClick={fold}>Fold</button>}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    me: selectors.getPlayers(state)[0] || {},
    isAlone: selectors.getPlayers(state).length <= 1,
    playerTurn: selectors.getPlayers(state).find((player) => player.isTurn),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fold: () => dispatch(fold()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ActionBar);
