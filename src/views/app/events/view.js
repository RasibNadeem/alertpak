import React, { Component, Fragment } from "react";
import { Button, Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { Link } from "react-router-dom";
import { confirmAlert } from "react-confirm-alert";

import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import { NotificationManager } from "../../../components/common/react-notifications";
import { config } from "../../../config/env";
import { Table } from "rsuite";
import ReactTable from "../../../components/table";
import EventShown from "./eventShown";
import SeenBy from "./seenBy";
import Exports from "./exports";
import "./style.scss";

const { Column, HeaderCell, Cell } = Table;
export default class Posts extends Component {
  constructor() {
    super();
    this.state = {
      selectAll: false,
      events: [],
      allEvents: [],
      checked: [],
      selectedUser: "",
      totalEvents: 0,
      spinning: false,
      userPermissions:
        localStorage.userPermission !== undefined
          ? JSON.parse(localStorage.userPermission)
          : [],
      //Pagination
      displayLength: 50,
      //History Modal
      isVideoOpen: false,
      isExportOpen: false,
      isSeenByOpen: false,
      page: 1,
      isAdmin: false,
    };
  }

  componentDidMount() {
    this.getAllEvents(this.state.page);
  }

  getAllEvents = async (page) => {
    this.setState({ spinning: true });
    let response = await ApiCall.get(
      Url.ALL_EVENTS + `?page=${page}}&limit=50`,
      await config()
    );

    if (response.status === 200) {
      this.setState({
        events: [...response.data.events.reverse()],
        allEvents: JSON.parse(JSON.stringify(response.data.events)),
        isAdmin: response.data.isAdmin,
        spinning: false,
        totalEvents: response.data.totalEvents,
      });
    } else {
      this.setState({ spinning: false });
    }
  };

  handleChangePage = (dataKey) => {
    this.getAllEvents(dataKey);

    this.setState({
      page: dataKey,
    });
  };
  handleChangeLength = (dataKey) => {
    this.setState({
      page: 1,
      displayLength: dataKey,
    });
  };
  getData = () => {
    const { displayLength, page, events } = this.state;
    return events;
  };
  handleFilterChange = (e) => {
    this.setState({ page: 1 });
    const data = this.state.events.filter((v, i) => {
      const start = 1000 * (1 - 1);
      const end = start + 1000;
      return i >= start && i < end;
    });
    const filteredData = data.filter((item) => {
      const query = e.target.value.toLowerCase();
      return item.title.toLowerCase().indexOf(query) >= 0;
    });
    this.setState({
      allEvents: filteredData,
    });
    if (e.target.value === "") {
      this.setState({
        allEvents: this.state.events,
      });
    }
  };

  changeStatus = (item) => {
    confirmAlert({
      title: "Confirmation!",
      message: "Are you sure you want to Delete?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.confirmChangeStatus(item),
        },
        {
          label: "No",
        },
      ],
    });
  };
  confirmDelete = async (item) => {
    this.setState({ spinning: true });
    let response = await ApiCall.get(
      `${Url.DELETE_EVENT}/${item}`,
      await config()
    );
    if (response.status === 200) {
      this.setState({ spinning: false });
      this.getAllEvents();
      return NotificationManager.success(
        "Event deleted Successfully",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    }
  };

  confirmDeleteVideo = async (item) => {
    this.setState({ spinning: true });
    let response = await ApiCall.get(
      `${Url.DELETE_EVENT_VIDEO}/${item}`,
      await config()
    );
    if (response.status === 200) {
      this.setState({ spinning: false });
      this.getAllEvents();
      return NotificationManager.success(
        "Event deleted Successfully",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    } else if (response.status === 204) {
      this.setState({ spinning: false });
      this.getAllEvents();
      return NotificationManager.error(
        "Event Videos Already Deleted.",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    }
  };

  changeStatus = (item) => {
    confirmAlert({
      title: "Confirmation!",
      message: "Are you sure you want to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.confirmDeleteVideo(item),
        },
        {
          label: "No",
        },
      ],
    });
  };

  changeStatusDelete = (item) => {
    confirmAlert({
      title: "Confirmation!",
      message: "Are you sure you want to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.confirmDelete(item),
        },
        {
          label: "No",
        },
      ],
    });
  };

  toggleExportModal = () => {
    this.setState({ isExportOpen: !this.state.isExportOpen });
  };

  toggleVideoModal = (id) => {
    if (id) {
      this.setState({ selectedUser: id });
    }
    this.setState({ isVideoOpen: !this.state.isVideoOpen });
  };

  confirmDeleteVideoSingle = async (item) => {
    this.setState({ isVideoOpen: true });
    this.setState({ spinning: true });
    const eventId = this.state.selectedUser._id;
    let response = await ApiCall.post(
      `${Url.DELETE_EVENT_VIDEO_SINGLE}/${eventId}`,
      {
        name: item,
      },
      await config()
    );
    if (response.status === 200) {
      this.setState({ spinning: false });
      this.getAllEvents();
      return NotificationManager.success(
        "Event deleted Successfully",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    } else if (response.status === 204) {
      this.setState({ spinning: false });
      this.getAllEvents();
      return NotificationManager.error(
        "Event Videos Already Deleted.",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    }
  };

  changeStatusSingle = (item) => {
    this.setState({ isVideoOpen: false });
    confirmAlert({
      title: "Confirmation!",
      message: "Are you sure you want to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.confirmDeleteVideoSingle(item),
        },
        {
          label: "No",
          onClick: () => this.setState({ isVideoOpen: true }),
        },
      ],
    });
  };

  toggleShowBy = (id) => {
    if (id) {
      this.setState({ selectedUser: id });
    }
    this.setState({ isSeenByOpen: !this.state.isSeenByOpen });
  };

  render() {
    const data = this.getData();
    const { spinning, isAdmin, totalEvents } = this.state;
    console.log(this.state.events);

    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="text-zero top-right-button-container">
              <Link to="/app/event/create">
                <Button size="lg" color={"secondary"}>
                  <IntlMessages id={"menu.create"} />
                </Button>
              </Link>
            </div>
            <Breadcrumb heading="tag.view" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {spinning ? (
          <div className="loading" />
        ) : (
          <Row>
            <Col>
              <Card className="h-100">
                <CardBody>
                  {isAdmin == true && (
                    <CardTitle>
                      Events
                      <div className="text-zero top-right-button-container">
                        <Button
                          size="lg"
                          color={"primary"}
                          onClick={() => this.toggleExportModal()}
                        >
                          Export
                        </Button>
                      </div>
                    </CardTitle>
                  )}
                  <ReactTable
                    data={data}
                    loading={this.state.spinning}
                    activePage={this.state.page}
                    displayLength={this.state.displayLength}
                    total={this.state.totalEvents}
                    onChangePage={this.handleChangePage}
                    onChangeLength={this.handleChangeLength}
                    handleFilterChange={this.handleFilterChange}
                  >
                    <Column width={200} align="center">
                      <HeaderCell>No</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowIndex + 1}</span>;
                        }}
                      </Cell>
                    </Column>
                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell> Title </HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowData.title}</span>;
                        }}
                      </Cell>
                    </Column>
                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell> Location </HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowData.location}</span>;
                        }}
                      </Cell>
                    </Column>
                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell> Seen </HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowData.count}</span>;
                        }}
                      </Cell>
                    </Column>
                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell>Seen</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <Button
                              color="secondary"
                              size="xs"
                              className="mb-2"
                              onClick={() => this.toggleShowBy(rowData)}
                            >
                              Seen By
                            </Button>
                          );
                        }}
                      </Cell>
                    </Column>
                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell> Risk Level </HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return <span>{rowData.riskLevel}</span>;
                        }}
                      </Cell>
                    </Column>
                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell>Actions</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <div>
                              {this.state.userPermissions.find(
                                (item) => item.name === "event.edit"
                              ) && (
                                <Button
                                  color="secondary"
                                  size="xs"
                                  className="mb-2"
                                >
                                  <Link
                                    to={`/app/event/edit/${rowData._id}`}
                                    style={{ color: "white" }}
                                  >
                                    <IntlMessages id="edit" />
                                  </Link>
                                </Button>
                              )}{" "}
                              {this.state.userPermissions.find(
                                (item) => item.name === "event.delete"
                              ) && (
                                <Button
                                  color="danger"
                                  size="xs"
                                  className="mb-2"
                                  onClick={() =>
                                    this.changeStatusDelete(rowData._id)
                                  }
                                >
                                  <IntlMessages id="delete" />
                                </Button>
                              )}
                            </div>
                          );
                        }}
                      </Cell>
                    </Column>

                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell>Files</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <div>
                              <Button
                                color="secondary"
                                size="xs"
                                className="mb-2"
                              >
                                <Link
                                  to={`/app/event/upload/${rowData._id}`}
                                  style={{ color: "white" }}
                                >
                                  Upload Files
                                </Link>
                              </Button>
                              {"  "}
                              <Button
                                color="primary"
                                size="xs"
                                className="mb-2"
                                onClick={() => this.changeStatus(rowData._id)}
                              >
                                Delete All
                              </Button>
                            </div>
                          );
                        }}
                      </Cell>
                    </Column>

                    <Column minWidth={200} flexGrow={1} align="center">
                      <HeaderCell>Videos</HeaderCell>
                      <Cell>
                        {(rowData, rowIndex) => {
                          return (
                            <div>
                              <Button
                                color="primary"
                                size="xs"
                                className="mb-2"
                                onClick={() => this.toggleVideoModal(rowData)}
                              >
                                <IntlMessages id="delete" />
                              </Button>
                            </div>
                          );
                        }}
                      </Cell>
                    </Column>
                  </ReactTable>
                </CardBody>
              </Card>
            </Col>
          </Row>
        )}

        {this.state.isSeenByOpen && (
          <SeenBy
            selectedUser={this.state.selectedUser}
            isEventOpen={this.state.isSeenByOpen}
            toggleEventsModal={this.toggleShowBy}
          />
        )}

        {this.state.isVideoOpen && (
          <EventShown
            selectedUser={this.state.selectedUser}
            isEventOpen={this.state.isVideoOpen}
            toggleEventsModal={this.toggleVideoModal}
            changeStatusSingle={this.changeStatusSingle}
          />
        )}
        {this.state.isExportOpen && (
          <Exports
            isExportOpen={this.state.isExportOpen}
            toggleExportsModal={this.toggleExportModal}
          />
        )}
      </Fragment>
    );
  }
}
