import React, { Component, Fragment } from "react";
import { Row, Button } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";

// import ReactTable from "react-table";
import Support from "./comonents/support";
import Session from "./comonents/session";
import "../table.css";
import DeviceId from "./comonents/device-id";

export default class DefaultDashboard extends Component {
  constructor() {
    super();
    this.state = {
      selectAll: false,
      checked: [],
      solving: false,
      spinning: true,
      userPermissions:
        localStorage.userPermission !== undefined
          ? JSON.parse(localStorage.userPermission)
          : [],
      //Pagination
      displayLength: 10,
      page: 1,
    };
  }
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.dashboard" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>

        {this.state.userPermissions.find((item) => item.name === "support") && (
          <Support />
        )}
        {this.state.userPermissions.find((item) => item.name === "session") && (
          <Session />
        )}
        {this.state.userPermissions.find(
          (item) => item.name === "device-id"
        ) && <DeviceId />}
      </Fragment>
    );
  }
}
