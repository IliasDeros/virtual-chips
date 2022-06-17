import { Component } from "react";
import { connect } from "react-redux";
import Table from "features/Table/components/Table";
import ActionBar from "features/ActionBar/components/ActionBar";
import Bet from "features/Bet/components/Bet";
import { connectToTable } from "actions/firebase-action";
import { getUrlParam } from "shared/modules/utils";

/**
 * Play the game (view table or turn)
 */
class TableScreen extends Component {
  componentDidMount() {
    const { tableId } = this.props;
    const urlTable = getUrlParam("table");

    this.props.connectFirebase(urlTable || tableId);
  }

  render() {
    return (
      <div className="h-screen pt-24">
        <Table />
        <Bet />
        <ActionBar className={"fixed bottom-0 h-20"} />
        <div className="mt-40">&nbsp;</div>
      </div>
    );
  }
}

function mapStateToProps({ table }) {
  return {
    tableId: table.id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    connectFirebase(id) {
      dispatch(connectToTable(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableScreen);
