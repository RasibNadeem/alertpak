import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Row,} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";

import moment from "moment";
// import ReactTable from "react-table";
import ApiCall from '../../../../config/network';
import Url from '../../../../config/api';
import {config} from "../../../../config/env";
import {Link} from "react-router-dom";
import {Table} from "rsuite";
import '../../table.css';
import ReactTable from "../../../../components/table";
import {NotificationManager} from "../../../../components/common/react-notifications";
import {confirmAlert} from "react-confirm-alert";

const {Column, HeaderCell, Cell, Pagination} = Table;


export default class DeviceId extends Component {

    constructor() {
        super();
        this.state = {
            selectAll: false,
            supports: [],
            allSupports: [],
            checked: [],
            solving: false,
            selectedSupport: null,
            spinning: true,
            userPermissions: localStorage.userPermission !== undefined ? JSON.parse(localStorage.userPermission) : [],
            //Pagination
            displayLength: 10,
            page: 1
        };
    }

    componentDidMount() {
        if(this.state.userPermissions.find(item => item.name === 'device-id')){
            this.getAllSupports();
        }
    };

    getAllSupports = async (item) => {
        this.setState({
            spinning: true
        })
        let response = await ApiCall.get(Url.GET_DEVICE_ID, await config())
        // console.log(response.data)
        if (response.status === 200) {
            this.setState({spinning: false});
            this.setState({
                supports: response.data.deviceIds.reverse(),
                allSupports: JSON.parse(JSON.stringify(response.data.deviceIds))
            });
        }
    };
    handleChangePage = (dataKey) => {
        this.setState({
            page: dataKey
        });
    };
    handleChangeLength = (dataKey) => {
        this.setState({
            page: 1,
            displayLength: dataKey
        });
    };
    getData = () => {
        const {displayLength, page, allSupports} = this.state;
        return allSupports.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    handleFilterChange = (e) => {
        this.setState({page: 1})
        const data = this.state.supports.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.user.name.toLowerCase().indexOf(query) >= 0 ||
                item.user.email.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allSupports: filteredData
        })
        if (e.target.value === '') {
            this.setState({
                allSupports: this.state.supports
            })
        }
    };


    confirmChangeStatusR = async (id) => {

        this.setState({changeStatus: true, selectedSupport: id, solving: true });

        let response = await ApiCall.post(`${Url.CHANGE_STATUS_DEVICE_ID}/${id}`, {isSolved: true}, await config())
        if (response.status === 200) {
            this.getAllSupports();
            this.setState({changeStatus: false, selectedSupport: null, solving: false});
            return NotificationManager.success(
                "User Status Changed Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        } else {
            this.setState({loading: false});
        }

    };

    confirmChangeStatusUD = async (id) => {

        this.setState({changeStatus: true, selectedSupport: id, solving: true });

        let response = await ApiCall.post(`${Url.CHANGE_STATUS_DEVICE_ID}/${id}`, {isSolved: false}, await config())
        if (response.status === 200) {
            this.getAllSupports();
            this.setState({changeStatus: false, selectedSupport: null, solving: false});
            return NotificationManager.success(
                "User Status Changed Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        } else {
            this.setState({loading: false});
        }

    };

    changeStatus  =  (item) => {
        confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Delete ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmChangeStatus(item)
                },
                {
                    label: "No"
                }
            ]
        })
    };

    confirmChangeStatus = async (item) => {


        this.setState({spinning: true});

        let response = await ApiCall.get(`${Url.DELETE_DEVICE_ID}/${item}`, await config());
        if (response.status === 200) {
            this.getAllSupports();
            this.setState({changeStatus: false, selectedSupport: null, solving: false});
            return NotificationManager.success(
                "DeviceId Request deleted successfully!",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        } else {
            this.setState({loading: false});
        }

    };


    render() {
        const data = this.getData();

        return (
            <Fragment>
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    DeviceId Forgotten
                                </CardTitle>
                                <ReactTable
                                    data={data}
                                    loading={this.state.spinning}
                                    activePage={this.state.page}
                                    displayLength={this.state.displayLength}
                                    total={this.state.allSupports.length}
                                    onChangePage={this.handleChangePage}
                                    onChangeLength={this.handleChangeLength}
                                    handleFilterChange={this.handleFilterChange}
                                >
                                    <Column width={200} align="center">
                                        <HeaderCell>No</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowIndex + 1}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={200} flexGrow={1} align="center">
                                        <HeaderCell> Email </HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.email}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={200} flexGrow={1} align="center">
                                        <HeaderCell> Name </HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.name}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={200} flexGrow={1} align="center">
                                        <HeaderCell> Date & Time </HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{moment(rowData.date).format('LLL')}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={200} flexGrow={1} align="center">
                                        <HeaderCell>Actions</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <div>
                                                    {(rowData.isSolved !== true) ?
                                                        <Button disabled={this.state.selectedSupport === rowData._id
                                                        && this.state.solving}
                                                                className={`btn-shadow btn-multiple-state ${
                                                                    this.state.selectedSupport === rowData._id &&
                                                                    this.state.solving ? "show-spinner" : ""}`}
                                                                onClick={() => this.confirmChangeStatusR(rowData._id)}
                                                                color="danger" size="xs">
                                                            <span className="spinner d-inline-block">
                                                                <span className="bounce1"/>
                                                                <span className="bounce2"/>
                                                                <span className="bounce3"/>
                                                            </span><span className="label">
                                                            <IntlMessages id="Solve"/>
                                                                </span>
                                                        </Button>
                                                        :
                                                        <Button disabled
                                                                className={`btn-shadow btn-multiple-state ${
                                                                    this.state.selectedSupport === rowData._id &&
                                                                    this.state.solving ? "show-spinner" : ""}`}
                                                                onClick={() => this.confirmChangeStatusUD(rowData._id)}
                                                                color="success" size="xs">
                                                            <span className="spinner d-inline-block">
                                                                <span className="bounce1"/>
                                                                <span className="bounce2"/>
                                                                <span className="bounce3"/>
                                                            </span><span className="label">
                                                         Solved
                                                                </span>
                                                        </Button>
                                                    }
                                                </div>
                                            }}
                                        </Cell>
                                    </Column>

                                    <Column minWidth={200}  flexGrow={1} align="center">
                                        <HeaderCell>Delete</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <div>
                                                    <Button color="primary" size="xs" className="mb-2" onClick={()=>this.changeStatus(rowData._id)}>
                                                        <IntlMessages id="delete" />
                                                    </Button>
                                                </div>
                                            }}
                                        </Cell>
                                    </Column>

                                </ReactTable>
                            </CardBody>
                        </Card>


                    </Col>
                </Row>

            </Fragment>
        );
    }
}
