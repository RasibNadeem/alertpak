import React, { Component, Fragment } from "react";
import {
    Row,
    Col,
    CardBody,
    CardTitle,
    Card,
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    // Label,
    FormGroup
} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
// import { confirmAlert } from 'react-confirm-alert';
// import {Link} from "react-router-dom";
import {Table} from "rsuite";
import '../table.css';
const { Column, HeaderCell, Cell, Pagination } = Table;
export default class VIPRegistrations extends Component {
    constructor() {
        super();
        this.state = {
            selectAll: false,
            vipRegistrations: [],
            waitingRegistrations: [],
            checked: [],
            spinning: false,
            selectedUser: '',
            userId: null,
            selectedStatus: '',
            changingStatus: false,
            showStatusModal: false,
            //Pagination
            displayLength: 10,
            page: 1,
            displayWaitingLength: 10,
            waitingPage: 1,
        };
    }


    componentDidMount() {
        this._isMounted = false
        this.getAllRegistrations();
    };
    getAllRegistrations = async ()=> {
        this.setState({spinning: true});
        if(!this._isMounted){
            let response = await ApiCall.get(Url.VIP_REGISTRATIONS, await config())
            if(response.status=== 200){
                // console.log(response)
                this.setState({
                    vipRegistrations: response.data.vipRegistrations.filter(item => item.user.status === 'vip').reverse(),
                    waitingRegistrations: response.data.vipRegistrations.filter(item => item.user.status === 'waiting').reverse(),
                    spinning: false
                });
            }
        }

    };
    componentWillUnmount() {
        this._isMounted = true
    }


    handleChangePage=(dataKey)=> {
        // console.log(dataKey)
        this.setState({
            page: dataKey
        });
    }; handleChangeWaitingPage=(dataKey)=> {
        // console.log(dataKey)
        this.setState({
            waitingPage: dataKey
        });
    };
    handleChangeLength=(dataKey)=> {
        this.setState({
            page: 1,
            displayLength: dataKey
        });
    };
    handleChangeWaitingLength=(dataKey)=> {
        this.setState({
            waitingPage: 1,
            displayWaitingLength: dataKey
        });
    };
    getWaitingData =() => {
        const { displayWaitingLength, waitingPage } = this.state;
        return this.state.waitingRegistrations.filter((v, i) => {
            const start = displayWaitingLength * (waitingPage - 1);
            const end = start + displayWaitingLength;
            return i >= start && i < end;
        });
    };
    getData =() => {
        const { displayLength, page } = this.state;
        return this.state.vipRegistrations.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    toggle = (item) => {
        this.setState({
            showStatusModal: !this.state.showStatusModal
        })
        if(item.user){
            this.setState({
                selectedUser: item.user,
                userId: item.id,
                selectedStatus: item.user.status === 'waiting'? 'vip' : item.user.status === 'vip'?  'registered' : 'vip'
            })
        }
    };
    handleSelectTypeChange = (e) => {
            this.setState({selectedStatus: e.target.value})
    };
    changeStatus =async () => {
        this.setState({changingStatus: true})
        let response = await ApiCall.post(Url.VIP_REGISTRATIONS_UPDATE,{
            id: this.state.userId,
            status: this.state.selectedStatus
        } ,await config());
        if(response.status === 200){
            // console.log(response)
            this.getAllRegistrations()
            this.setState({
                changingStatus: false,
                showStatusModal: false
            })
            return  NotificationManager.success(
                "Status Changed Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }else {
            this.setState({
                changingStatus: false,
            })
        }
    }
    render() {
        const data = this.getData();
        const waitingData = this.getWaitingData();
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="view" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id={"vipRegistration"} />
                                </CardTitle>
                                <Table autoHeight={true}
                                       data={data}
                                       bordered
                                       cellBordered
                                       virtualized={false}
                                       hover={true}
                                       loading={this.state.spinning}>
                                    <Column width={50} fixed align="center">
                                        <HeaderCell>No</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowIndex +1}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={100}  flexGrow={1} align="center">
                                        <HeaderCell>Name</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.name}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={100}  flexGrow={1} align="center">
                                        <HeaderCell>Email</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.email}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={80}  flexGrow={1} align="center">
                                        <HeaderCell>Country</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.country.name}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={80}  flexGrow={1} align="center">
                                        <HeaderCell>Status</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.status}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={80}  flexGrow={1} align="center">
                                        <HeaderCell>Account No</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.vantageFXAccountNumber}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={100}  flexGrow={1} align="center">
                                        <HeaderCell>Created At</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.createdAt}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={150}  flexGrow={1} align="center">
                                        <HeaderCell>Actions</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <div>
                                                    <Button color="info" size="xs" className="mb-2" onClick={()=> this.toggle(rowData)}>
                                                        Change Status
                                                    </Button>
                                                </div>
                                            }}
                                        </Cell>
                                    </Column>
                                </Table>
                                <Pagination
                                    lengthMenu={[
                                        {
                                            value: 10,
                                            label: 10
                                        },
                                        {
                                            value: 20,
                                            label: 20
                                        }
                                    ]}
                                    activePage={this.state.page}
                                    displayLength={this.state.displayLength}
                                    total={this.state.vipRegistrations.length}
                                    onChangePage={this.handleChangePage}
                                    onChangeLength={this.handleChangeLength}
                                />
                                <CardTitle>
                                    <IntlMessages id={"waitingRegistration"} />
                                </CardTitle>
                                <Table autoHeight={true}
                                       data={waitingData}
                                       bordered
                                       cellBordered
                                       virtualized={false}
                                       hover={true}
                                       loading={this.state.spinning}>
                                    <Column width={50} fixed align="center">
                                        <HeaderCell>No</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowIndex +1}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={100}  flexGrow={1} align="center">
                                        <HeaderCell>Name</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.name}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={100}  flexGrow={1} align="center">
                                        <HeaderCell>Email</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.email}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={80}  flexGrow={1} align="center">
                                        <HeaderCell>Country</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.country.name}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={80}  flexGrow={1} align="center">
                                        <HeaderCell>Status</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.user.status}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={80}  flexGrow={1} align="center">
                                        <HeaderCell>Account No</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.vantageFXAccountNumber}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={100}  flexGrow={1} align="center">
                                        <HeaderCell>Created At</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <span>{rowData.createdAt}</span>
                                            }}
                                        </Cell>
                                    </Column>
                                    <Column minWidth={150}  flexGrow={1} align="center">
                                        <HeaderCell>Actions</HeaderCell>
                                        <Cell>
                                            {(rowData, rowIndex) => {
                                                return <div>
                                                    <Button color="info" size="xs" className="mb-2" onClick={()=> this.toggle(rowData)}>
                                                        Change Status
                                                    </Button>
                                                </div>
                                            }}
                                        </Cell>
                                    </Column>
                                </Table>
                                <Pagination
                                    lengthMenu={[
                                        {
                                            value: 10,
                                            label: 10
                                        },
                                        {
                                            value: 20,
                                            label: 20
                                        }
                                    ]}
                                    activePage={this.state.waitingPage}
                                    displayLength={this.state.displayWaitingLength}
                                    total={this.state.waitingRegistrations.length}
                                    onChangePage={this.handleChangeWaitingPage}
                                    onChangeLength={this.handleChangeWaitingLength}
                                />
                                {this.state.selectedUser !== "" &&
                                <Modal isOpen={this.state.showStatusModal} toggle={this.toggle}>
                                    <ModalHeader toggle={this.toggle}>
                                        Change Status
                                        {/*<IntlMessages id="event.divisions-add-members" />*/}
                                    </ModalHeader>
                                    <ModalBody>
                                        <FormGroup row>
                                            <Colxx sm="12">
                                                <select
                                                    name="select"
                                                    className="form-control"
                                                    value={this.state.selectedStatus}
                                                    onChange={this.handleSelectTypeChange}
                                                >
                                                    {/*<option value='waiting'>Waiting</option>*/}
                                                    <option value='vip'>Accept</option>
                                                    <option value='registered'>Deny</option>

                                                </select>
                                            </Colxx>
                                        </FormGroup>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="secondary" onClick={this.toggle}>
                                            Close
                                        </Button>
                                        <Button disabled={this.state.changingStatus}
                                                className={`float-right btn-shadow btn-multiple-state ${this.state.changingStatus ? "show-spinner" : ""}`}
                                                onClick={this.changeStatus}
                                                color="primary"
                                        >
                                        <span className="spinner d-inline-block">
                                            <span className="bounce1" />
                                            <span className="bounce2" />
                                            <span className="bounce3" />
                                        </span><span className="label">
                                                Change Status</span>
                                        </Button>
                                    </ModalFooter>
                                </Modal>}

                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </Fragment>
        )
    }
}
