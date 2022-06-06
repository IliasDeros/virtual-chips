import { Component } from "react";
import { connect } from "react-redux";
import Table from "features/Table/components/Table";
import ActionBar from "features/ActionBar/components/ActionBar";
import { connectToTable } from "actions/firebase-action";

function getUrlParam(paramName) {
  const params = new URLSearchParams(
    window.location.href.slice(window.location.href.indexOf("?"))
  );
  return params.get(paramName);
}

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
    connectFirebase(id) {
      dispatch(connectToTable(id));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableScreen);
