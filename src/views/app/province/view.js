import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Row,} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
// import ReactTable from "react-table";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
// import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import {Link} from "react-router-dom";
import {Table} from "rsuite";
import '../table.css';
import SearchButton from "../../../components/SearchInput";
import {confirmAlert} from "react-confirm-alert";
import {NotificationManager} from "../../../components/common/react-notifications";

const { Column, HeaderCell, Cell, Pagination } = Table;
export default class PermissionsView extends Component {
    constructor() {
        super();
        this.state = {
            selectAll: false,
            permissions: [],
            allPermissions: [],
            checked: [],
            spinning: true,
            userPermissions: localStorage.userPermission !== undefined? JSON.parse(localStorage.userPermission) : [],
            //Pagination
            displayLength: 10,
            page: 1
        };
    }
    componentDidMount() {
        this.getAllProvinces();
    };
    getAllProvinces = async (item)=> {
        let response = await ApiCall.get(Url.ALL_PROVINCES, await config())
        if(response.status=== 200){
            this.setState({spinning: false});
            this.setState({
                permissions: response.data.provinces.reverse(),
                allPermissions: JSON.parse(JSON.stringify(response.data.provinces))
            });
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
        const { displayLength, page, allPermissions } = this.state;
        return allPermissions.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    handleFilterChange = (e) => {
        this.setState({page: 1})
        const data = this.state.permissions.filter((v, i) => {
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
            allPermissions: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allPermissions: this.state.permissions
            })
        }
    };

    changeStatus  =  (item) => {
        confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Delete?',
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
        let response = await ApiCall.get(`${Url.DELETE_PROVINCE}/${item}`, await config());
        if(response.status === 200){
            this.setState({spinning: false});
            this.getAllProvinces();
            return  NotificationManager.success(
                "Province deleted Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }

    };

    render() {
        const data = this.getData();
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/province/create'><Button size='lg' color={'primary'}> <IntlMessages id="create" /></Button></Link>
                        </div>
                        <Breadcrumb heading="permission.view" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col>

                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle>
                                        Provinces
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
                                                        {this.state.userPermissions.find(item => item.name === "province.edit") &&
                                                        <Button color="secondary" size="xs" className="mb-2">
                                                            <Link to={`/app/province/edit/${rowData._id}`} style={{color: 'white'}}><IntlMessages id="permission.edit" /></Link>
                                                        </Button>}

                                                        {" "}{" "}

                                                        {this.state.userPermissions.find(item => item.name === "province.delete") &&
                                                        <Button color="danger" size="xs" className="mb-2" onClick={()=> this.changeStatus(rowData._id)}>
                                                            <IntlMessages id="delete" />
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
                                        total={this.state.permissions.length}
                                        onChangePage={this.handleChangePage}
                                        onChangeLength={this.handleChangeLength}
                                    />
                                </CardBody>
                            </Card>


                    </Col>
                </Row>
            </Fragment>
        )
    }
}
