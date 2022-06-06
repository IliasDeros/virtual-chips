import { Component } from "react";
import { connect } from "react-redux";
import Table from "features/Table/components/Table";
import ActionBar from "features/ActionBar/components/ActionBar";
import { watchTable } from "actions/firebase-action";

/**
 * Play the game (view table or turn)
 */
class TableScreen extends Component {
  componentDidMount() {
    this.props.watchTable(this.props.tableId);
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
    watchTable(id = "default") {
      dispatch(watchTable(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableScreen);
