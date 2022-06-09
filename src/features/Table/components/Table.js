import { Component } from "react";
import { connect } from "react-redux";
import selectors from "reducers/selectors";
import { OtherPlayers } from "./OtherPlayers";
import { MePlayer } from "./MePlayer";
import { StyledCards, StyledPot, StyledTable } from "./styles";

/**
 * View the table pot, players & bets
 */
class Table extends Component {
  render() {
    const { players, playerOrder, pot, turn } = this.props;
    const [me, ...otherPlayers] = players;
    const meIndex = playerOrder?.split(",").indexOf(me?.id) || 0;

    if (!players.length) {
      return "Loading Table...";
    }

    return (
      <StyledTable>
        <MePlayer meIndex={meIndex} player={me} />
        <OtherPlayers meIndex={meIndex} players={otherPlayers} />
        <StyledCards turn={turn} />
        <StyledPot pot={pot} />
      </StyledTable>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: selectors.getPlayers(state),
    playerOrder: selectors.getPlayerOrder(state),
    pot: selectors.getPot(state),
    turn: selectors.getTableTurn(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Table);
