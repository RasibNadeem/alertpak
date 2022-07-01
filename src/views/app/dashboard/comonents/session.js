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


export default class Support extends Component {

    constructor() {
        super();
        this.state = {
            selectAll: false,
            sessions: [],
            allSessions: [],
            timeStamp: [],
            allTimeStamp: [],
            checked: [],
            solving: false,
            selectedSupport: null,
            userId: JSON.parse(localStorage.currentUser)._id,
            spinning: true,
            userPermissions: localStorage.userPermission !== undefined ? JSON.parse(localStorage.userPermission) : [],
            //Pagination
            displayLength: 10,
            page: 1
        };
    }

    componentDidMount() {
        if(this.state.userPermissions.find(item => item.name === 'session')){
            this.getSession();
        }

    };

    getSession = async (item) => {
        const {userId} =this.state;
        this.setState({
            spinning: true
        })
        let response = await ApiCall.get(`${Url.GET_HISTORY}/${userId}`, await config())
        if (response.status === 200) {
            this.setState({spinning: false});
            this.setState({
                sessions: response.data.userSessions,
                allSessions: response.data.userSessions
            });
        }
    };
    handleChangePage = (dataKey) => {
        // console.log(dataKey)
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
        const {displayLength, page, allSessions} = this.state;
        return allSessions.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    handleFilterChange = (e) => {
        this.setState({page: 1})
        const data = this.state.sessions.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.sessionType.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allSessions: filteredData
        })
        if (e.target.value === '') {
            this.setState({
                allSessions: this.state.sessions
            })
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
                                    Session History
                                </CardTitle>
                                <ReactTable
                                    data={data}
                                    loading={this.state.spinning}
                                    activePage={this.state.page}
                                    displayLength={this.state.displayLength}
                                    total={this.state.allSessions.length}
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
                                        <HeaderCell> Title </HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <div>
                                                    {
                                                        (rowData.sessionType == "login") ?
                                                        <div color="success" size="xs" className="mb-2"
                                                               >
                                                            Login
                                                        </div>
                                                        :
                                                        <div color="danger" size="xs" className="mb-2"
                                                                >
                                                            Logout
                                                        </div>
                                                    }
                                                </div>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={200} flexGrow={1} align="center">
                                        <HeaderCell> Date & Time </HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{moment(rowData.timeStamp).format('LLL')}</span>
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
