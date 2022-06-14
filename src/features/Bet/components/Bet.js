import { connect } from "react-redux";
import { selectBet } from "actions/player-action";
import { selectors } from "reducers/selectors";
import BetSlider from "./BetSlider";
const makeBetOptions = (props) => {
  const { allInBet, bigBlind, callBet } = props;
  const minBet = Math.max(callBet, bigBlind);
  const maxBet = allInBet;

  return {
    max: maxBet,
    min: minBet,
    step: bigBlind,
  };
};

/**
 * - Only visible when it's my turn
 * - Button that says "Bet"
 * - Clicking that button makes a slider
 * - Updates state.player.bet on move
 */
const Bet = (props) => {
  const { isMyTurn, selectBet } = props;
  const betOptions = makeBetOptions(props);

  if (!isMyTurn) {
    return null;
  }

  return <BetSlider betOptions={betOptions} selectBet={selectBet} />;
};

function mapStateToProps(state) {
  return {
    allInBet: selectors.getMe(state)?.chips,
    bigBlind: selectors.getBigBlind(state),
    isMyTurn: selectors.isMyTurn(state),
    players: selectors.getPlayers(state),
    callBet: selectors.getToCall(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectBet(bet) {
      dispatch(selectBet(bet));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Bet);
