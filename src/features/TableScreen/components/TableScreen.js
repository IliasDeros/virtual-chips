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
    this.props.watchTable();
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
  return { table };
}

function mapDispatchToProps(dispatch) {
  return {
    watchTable() {
      dispatch(watchTable());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TableScreen);
