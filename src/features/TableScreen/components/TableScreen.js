import { Component } from "react";
import { connect } from "react-redux";
import Table from "features/Table/components/Table";
import ActionBar from "features/ActionBar/components/ActionBar";
import { connectToTable } from "actions/firebase-action";

/**
 * Play the game (view table or turn)
 */
class TableScreen extends Component {
  componentDidMount() {
    this.props.connectFirebase(this.props.tableId);
  }

  render() {
    return (
      <div>
        <Table />
        <ActionBar />
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
    connectFirebase(id = "default") {
      dispatch(connectToTable(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableScreen);
