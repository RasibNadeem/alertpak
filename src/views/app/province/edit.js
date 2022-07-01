import React, { Component, Fragment } from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import {config} from "../../../config/env";
import {NotificationManager} from "../../../components/common/react-notifications";
import {Link} from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
const initialState = {
    name: '',
    provinces: [],
    selectedProvinces: [],
    id: null,
    loading: false,
    spinning: false
}
export default class UpdatePermission extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this.getSinglePermissionData();
        this.getAllProvinces();

    }
    getAllProvinces = async ()=> {
        let response = await ApiCall.get(Url.ALL_COUNTRIES, await config())
        if(response.status=== 200){
            let options = response.data.countries.map(function (item) {
                return {
                    value: item._id,
                    label: item.name,
                    key: item._id
                };
            })
            // console.log(options)
            this.setState({provinces: options});
        }
    };


    getSinglePermissionData = async ()=> {
        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.EDIT_PROVINCE}/${this.props.match.params.id}`, await config());
        if(response.status === 200){
            let city = response.data.province;

            console.log(city)
            let userPermissions;
            if(city.province!==null){
                userPermissions = {
                    value: city.country._id,
                    label: city.country.name,
                    key: city.country._id,
                }}

            this.setState({
                selectedProvinces: userPermissions,
                name: response.data.province.name,
                id: response.data.province._id,
                spinning: false
            })
        }
    }
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };



    updatePermission = async (e)=> {
        e.preventDefault();
        const {name} = this.state;
        this.setState({loading: true});
        let userSelectedPermission = this.state.selectedProvinces.value;
        let response = await ApiCall.post(`${Url.UPDATE_PROVINCE}/${this.props.match.params.id}`, {
            name: name,
            id: this.props.match.params.id,
            country: userSelectedPermission
        }, await config());
        if(response.status === 200){
            this.setState(initialState);
            this.props.history.push('/app/province/view')
            return  NotificationManager.success(
                "Province Updated Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }else {
            this.setState({loading: false});
        }

        // console.log(response)
    };
    handleSelectedRoles = selectedProvinces => {
        this.setState({selectedProvinces });
    };
    render() {
        const {name, spinning} = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/province/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
                        </div>
                        <Breadcrumb heading="client.edit" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-10 col-xs-12 '>
                        {spinning? <div className="loading" /> :
                            <Card>
                                <div className="position-absolute card-top-buttons">
                                </div>
                                <CardBody>
                                    <CardTitle>
                                        <IntlMessages id="permission.edit" />
                                    </CardTitle>
                                    <Form className="dashboard-quick-post" onSubmit={this.updatePermission}>
                                        <FormGroup row>
                                            <Label sm="3">
                                                Name
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Permission Name *'} required/>
                                            </Colxx>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="role.provinces" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Select
                                                    components={{ Input: CustomSelectInput }}
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Province"
                                                    name="selectedProvinces"
                                                    value={this.state.selectedProvinces}
                                                    onChange={this.handleSelectedRoles}
                                                    options={this.state.provinces}
                                                />
                                            </Colxx>
                                        </FormGroup>
                                        <Button  className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary" disabled={this.state.loading}>
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                            <span className="label"><IntlMessages id="permission.update" /></span>
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        }
                        </div>
                    </Col>

                </Row>
            </Fragment>
        )
    }
}
