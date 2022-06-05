import { Component } from "react";
import { connect } from "react-redux";
import selectors from "reducers/selectors";

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
      <div>
        <div>
          You: {me.name}
          {me.token && ` - ${me.token}`}
        </div>
        {otherPlayers.map((player) => (
          <div key={player.id}>
            {player.name}
            {player.token && ` - ${player.token}`}
          </div>
        ))}
        Table
        <div>Pot: {pot}</div>
      </div>
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
