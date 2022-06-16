import { Component } from "react";
import { connect } from "react-redux";
import { selectBet } from "actions/player-action";
import { selectors } from "reducers/selectors";
import { BetContainer } from "./styles";
import BetRangeInput from "./BetRangeInput";

class BetSlider extends Component {
  render() {
    const { betOptions, bet, selectBet } = this.props;
    const { max, min } = betOptions;

    /**
     * The range input selects a percentage from 0 to 100
     * The selected percentage is converted to a value using this algorithm:
     *
     * 0%  5% 10%                             100%
     * |===|===|================================|
     * 0  min value                            max
     */
    const changeBetPercent = (e) => {
      const { value } = e.target;

      // Under 5%: 0
      if (value < 5) {
        return selectBet(0);
      }

      // Under 10%: min
      if (value < 10) {
        return selectBet(min);
      }

      // Between 10% and 100%: value
      const bet = Math.ceil(((value - 10) * (max - min)) / 90 + min);
      return selectBet(bet);
    };

    return (
      <>
        <BetContainer bet={bet}>{bet}</BetContainer>
        <BetRangeInput
          minBet={betOptions.min}
          maxBet={betOptions.max}
          onChange={changeBetPercent}
        />
      </>
    );
  }
}

function mapStateToProps(state) {
  return {
    bet: selectors.getPlayerBet(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    selectBet: (bet) => dispatch(selectBet(bet)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BetSlider);
