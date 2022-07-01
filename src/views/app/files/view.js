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
import Exports from "./exports";
import RolesChangeModal from "../users/components/rolesChangedModal";
import {confirmAlert} from "react-confirm-alert";
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
            isExportOpen: false,
            permissionsModal: false,
            spinning: false,
            userPermissions: localStorage.userPermission !== undefined? JSON.parse(localStorage.userPermission) : [],
            //Pagination
            displayLength: 10,
            page: 1
        };
    }


    componentDidMount() {
        this.getAllFiles();
    };
    getAllFiles = async ()=> {
        this.setState({spinning: true});
        let response = await ApiCall.get(Url.GET_ALL_FILES, await config())
        // console.log(response)
        if(response.status=== 200){
            this.setState({spinning: false});
            this.setState({
                roles: response.data.files,
                allRoles:  JSON.parse(JSON.stringify(response.data.files))
            });
        }
    };
    toggle = (fileData) => {
        let openInNewTab = window.open(fileData.fileName);
        openInNewTab.focus()
        return NotificationManager.success(
            "Event Monthly Downloaded Successfully",
            "Success",
            3000,
            null,
            null,
            'filled'
        );
    };

    deleteFile = (fileData) => {
        console.log("here delete",fileData)
    }

    changeStatusDelete  =  (item) => {

        confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Delete ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmDelete(item)
                },
                {
                    label: "No"
                }
            ]
        })
    };

    confirmDelete = async (item) => {
        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.DELETE_FILE}/${item}`, await config());
        if(response.status === 200){
            this.setState({spinning: false});
            this.getAllFiles();
            return  NotificationManager.success(
                "File deleted Successfully",
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

    toggleExportModal = () => {
        this.setState({isExportOpen: !this.state.isExportOpen})
    }

    changedState = () => {
        this.setState({isExportOpen: !this.state.isExportOpen})
    }

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
                            <Button size='lg' color={'primary'} onClick={()=>this.toggleExportModal()}>Upload</Button>
                        </div>
                        <Breadcrumb heading="files.name" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle>
                                       Files
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
                                            <HeaderCell>Actions</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <div>
                                                        <Button color="info" size="xs" className="mb-2" onClick={()=>this.toggle(rowData)}>
                                                            Download
                                                        </Button>
                                                        {"    "}
                                                        <Button color="secondary" size="xs" className="mb-2"  onClick={()=>this.changeStatusDelete(rowData._id)}>
                                                           <IntlMessages id="client.delete" />
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
                                        total={this.state.allRoles.length}
                                        onChangePage={this.handleChangePage}
                                        onChangeLength={this.handleChangeLength}
                                    />

                                    {this.state.isExportOpen &&
                                    <Exports
                                        isExportOpen ={this.state.isExportOpen}
                                        toggleExportsModal={this.toggleExportModal}
                                        changedState = {this.changedState}
                                    />
                                    }

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
