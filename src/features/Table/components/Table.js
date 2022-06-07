import { Component } from "react";
import { connect } from "react-redux";
import selectors from "reducers/selectors";
import { OtherPlayers } from "./OtherPlayers";
import { MePlayer } from "./MePlayer";
import { StyledPot, StyledTable } from "./styles";

/**
 * View the table pot, players & bets
 */
class Table extends Component {
  render() {
    const { players, pot } = this.props;
    const [me, ...otherPlayers] = players;

    if (!players.length) {
      return "Loading Table...";
    }

    return (
      <StyledTable>
        <MePlayer player={me} />
        <OtherPlayers players={otherPlayers} />
        <StyledPot pot={pot} />
      </StyledTable>
    );
  }
}

function mapStateToProps(state) {
  return {
    pot: selectors.getPot(state),
    players: selectors.getPlayers(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
