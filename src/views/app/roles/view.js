import React, { Component, Fragment } from "react";
import {
    Row,
    Col,
    CardBody,
    CardTitle,
    // CustomInput,
    Card,
    Button,
    // Badge,
    // Spinner,
    Modal,
    ModalHeader,
    ModalBody, ModalFooter
} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
// import ReactTable from "react-table";
// import 'rsuite/dist/styles/rsuite-default.css';

import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {config} from "../../../config/env";
import {Link} from "react-router-dom";
// import {confirmAlert} from "react-confirm-alert";
import {NotificationManager} from "../../../components/common/react-notifications";
import {Table} from "rsuite";
import '../table.css';
import SearchButton from "../../../components/SearchInput";
const { Column, HeaderCell, Cell, Pagination } = Table;
export default class RolesView extends Component {
    constructor() {
        super();
        this.state = {
            selectAll: false,
            roles: [],
            allRoles: [],
            selectedUserPermissions: [],
            checked: [],
            permissionsModal: false,
            spinning: false,
            userPermissions: localStorage.userPermission !== undefined? JSON.parse(localStorage.userPermission) : [],
            //Pagination
            displayLength: 10,
            page: 1
        };
    }


    componentDidMount() {
        this.getAllRoles();
    };
    getAllRoles = async ()=> {
        this.setState({spinning: true});
        let response = await ApiCall.get(Url.ALL_ROLES, await config())
        // console.log(response)
        if(response.status=== 200){
            this.setState({spinning: false});
            this.setState({
                roles: response.data.roles.reverse(),
                allRoles:  JSON.parse(JSON.stringify(response.data.roles))
            });
        }
    };
    toggle = (permissions) => {
        this.setState(prevState => ({
            permissionsModal: !prevState.permissionsModal,
        }));
        if(Array.isArray(permissions)){
            this.setState({selectedUserPermissions: permissions});
        }

    };
    // changeStatus  =  (item) => {
    //     confirmAlert({
    //         title: 'Confirmation!',
    //         message: 'Are you sure you want to Delete?',
    //         buttons: [
    //             {
    //                 label: 'Yes',
    //                 onClick: () => this.confirmChangeStatus(item)
    //             },
    //             {
    //                 label: "No"
    //             }
    //         ]
    //     })
    // };


    confirmChangeStatus = async (item) => {
        this.setState({spinning: true});
        let response = await ApiCall.post(Url.ROLE_STATUS, {
            id: item.id,
            // status: client.status === 'active'? 'inactive' : 'active'
        }, await config());
        if(response.status === 200){
            this.setState({spinning: false});
            this.getAllClients();
            return  NotificationManager.success(
                "Client deleted Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }

    };
    handleChangePage=(dataKey)=> {
        // console.log(dataKey)
        this.setState({
            page: dataKey
        });
    };
    handleChangeLength=(dataKey)=> {
        this.setState({
            page: 1,
            displayLength: dataKey
        });
    };
    getData =() => {
        const { displayLength, page, allRoles } = this.state;
        return allRoles.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    handleFilterChange = (e) => {
        this.setState({page: 1})
        const data = this.state.roles.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.name.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allRoles: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allRoles: this.state.roles
            })
        }
    };
    render() {
        const data = this.getData();
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/roles/create'><Button size='lg' color={'primary'}> <IntlMessages id="create" /></Button></Link>
                        </div>
                        <Breadcrumb heading="roles.name" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle>
                                        <IntlMessages id={"roles.view-roles"} />
                                    </CardTitle>
                                    <SearchButton
                                        handleFilterChange={this.handleFilterChange}
                                    />
                                    <Table autoHeight={true}
                                           data={data}
                                           bordered
                                           cellBordered
                                           virtualized={false}
                                           hover={true}
                                           loading={this.state.spinning}
                                    >
                                        <Column width={200} align="center">
                                            <HeaderCell>No</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <span>{rowIndex +1}</span>
                                                }}
                                            </Cell>
                                        </Column>

                                        <Column minWidth={200}  flexGrow={1} align="center">
                                            <HeaderCell>Name</HeaderCell>
                                            <Cell dataKey="name" />
                                        </Column>
                                        <Column minWidth={200}  flexGrow={1} align="center">
                                            <HeaderCell>Permissions</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <div>
                                                        <Button color="info" size="xs" className="mb-2" onClick={()=>this.toggle(rowData.permissions)}>
                                                            <IntlMessages id="role.view-permissions" />
                                                        </Button>
                                                    </div>
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column minWidth={200}  flexGrow={1} align="center">
                                            <HeaderCell>Actions</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <div>
                                                        {this.state.userPermissions.find(item => item.name === "role.edit") &&
                                                        <Button color="secondary" size="xs" className="mb-2">
                                                            <Link to={`/app/roles/edit/${rowData._id}`} style={{color: 'white'}}><IntlMessages id="client.edit" /></Link>
                                                        </Button>}
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
                                        total={this.state.allRoles.length}
                                        onChangePage={this.handleChangePage}
                                        onChangeLength={this.handleChangeLength}
                                    />
                                    <Modal isOpen={this.state.permissionsModal} toggle={this.toggle}>
                                        <ModalHeader toggle={this.toggle}>
                                            <IntlMessages id="role.permissions" />
                                        </ModalHeader>
                                        <ModalBody>
                                                    <div className='react-modal-custom-overflow'>
                                                        {this.state.selectedUserPermissions.length > 0 ?
                                                             this.state.selectedUserPermissions.map((item, index) =>{
                                                                    return(
                                                                        <Row key={index}>

                                                                            <ul>
                                                                                <li>{item.name}</li>
                                                                            </ul>
                                                                        </Row>)

                                                                })
                                                            : <h6>Selected Role Have No Permission</h6>}

                                                    </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="secondary" onClick={this.toggle}>
                                                <IntlMessages id="role.close-permissions-modal" />
                                            </Button>
                                        </ModalFooter>
                                    </Modal>
                                </CardBody>
                            </Card>

                    </Col>
                </Row>
            </Fragment>
        )
    }
}
