import { connect } from "react-redux";
import { selectBet } from "actions/player-action";
import { selectors } from "reducers/selectors";
import { Chip } from "shared/components/Chip";
import BetSlider from "./BetSlider";
import { useMemo } from "react";
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
  const { bet, isMyTurn, selectBet } = props;
  const betOptions = makeBetOptions(props);

  if (!isMyTurn) {
    return null;
  }

  const chipCount = Math.round(Math.min(bet / 100, 14)) || 1;
  const chipsArray = useMemo(() => new Array(chipCount).fill(), [chipCount]);

  return (
    <div className="fixed bottom-20 w-full bg-base-100 p-4 pb-2 flex">
      <div>
        {chipsArray.map((_, i) => (
          <Chip stackVertical key={`bet-chip--${i}`} />
        ))}
      </div>
      <div className="ml-4 mr-2 flex-1">
        <BetSlider betOptions={betOptions} selectBet={selectBet} />
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    allInBet: selectors.getMe(state)?.chips,
    bet: selectors.getPlayerBet(state),
    bigBlind: selectors.getBigBlind(state),
    callBet: selectors.getToCall(state),
    isMyTurn: selectors.isMyTurn(state),
    players: selectors.getPlayers(state),
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
