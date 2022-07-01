import React, { Component, Fragment } from "react";
import {Row, Col, CardBody, CardTitle,  Card, Button, } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import { confirmAlert } from 'react-confirm-alert';
import {Link} from "react-router-dom";
import {Table} from "rsuite";
import '../table.css';
const { Column, HeaderCell, Cell, Pagination } = Table;
export default class PartnersView extends Component {
    constructor() {
        super();
        this.state = {
            selectAll: false,
            partners: [],
            checked: [],
            spinning: false,
            //Pagination
            displayLength: 10,
            page: 1
        };
    }


    componentDidMount() {
        this._isMounted = false
        this.getAllPartners();
    };
    getAllPartners = async ()=> {
        this.setState({spinning: true});
        if(!this._isMounted){
            let response = await ApiCall.get(Url.ALL_PARTNERS, await config());
            // console.log(response)
            if(response.status=== 200){
                this.setState({partners: response.data.partner.reverse(), spinning: false});
            }
        }

    };
    componentWillUnmount() {
        this._isMounted = true
    }

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
        let response = await ApiCall.post(Url.DELETE_PARTNERS, {
            id: item.id,
        }, await config());
        if(response.status === 200){
            this.setState({spinning: false});
            this.getAllPartners();
            return  NotificationManager.success(
                "Partner deleted Successfully",
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
        const { displayLength, page } = this.state;
        return this.state.partners.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    render() {
        const data = this.getData();
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">

                        <div className="text-zero top-right-button-container">
                            <Link to='/app/partners/create'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.create"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="partner.view" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col>
                            <Card className="h-100">
                                <CardBody>
                                    <CardTitle>
                                        <IntlMessages id={"partner.partners"} />
                                    </CardTitle>
                                    <Table autoHeight={true}
                                           data={data}
                                           bordered
                                           cellBordered
                                           virtualized={false}
                                           hover={true}
                                           loading={this.state.spinning}
                                     >
                                        <Column width={50} fixed align="center">
                                            <HeaderCell>No</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <span>{rowIndex +1}</span>
                                                }}
                                            </Cell>
                                        </Column>

                                        <Column minWidth={200}  flexGrow={1} align="center">
                                            <HeaderCell>Name</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <span>{rowData.name}</span>
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column minWidth={200}  flexGrow={1} align="center">
                                            <HeaderCell>Logo</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <img src={rowData.logo} alt={rowData.id} style={{maxHeight: '30px'}}/>
                                                }}
                                            </Cell>
                                        </Column>
                                        <Column minWidth={200}  flexGrow={1} align="center">
                                            <HeaderCell>Actions</HeaderCell>
                                            <Cell>
                                                {(rowData, rowIndex) => {
                                                    return <div>
                                                        <Button color="secondary" size="xs" className="mb-2">
                                                            <Link to={`/app/partners/edit/${rowData.id}`} style={{color: 'white'}}><IntlMessages id="edit" /></Link>
                                                        </Button>
                                                        {" "}{" "}
                                                        <Button color="danger" size="xs" className="mb-2" onClick={()=> this.changeStatus(rowData)}>
                                                            <IntlMessages id="delete" />
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
                                        total={this.state.partners.length}
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
