import React, { Component, Fragment } from "react";
import {
    Card,
    CardBody,
    CardTitle,
    FormGroup,
    Label,
    Button,
    Form,
    Input,
    Row,
    Col
} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import Select from "react-select";
import {Link} from "react-router-dom";

const initialState = {
    name: '',
    provinces: [],
    selectedProvinces: [],
    spinning: false,
    loading: false
}

export default class UpdateRole extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this.getAllProvinces();
        this.getSingleCityData();
    };

    getSingleCityData = async (e)=> {
        this.setState({
            spinning: true
        })
        let response = await ApiCall.get(`${Url.EDIT_CITY}/${this.props.match.params.id}`, await config())
        if(response.status === 200){
            let city = response.data.city;
            let userPermissions;
                if(city.province!==null){
                     userPermissions = {
                        value: city.province._id,
                        label: city.province.name,
                        key: city.province._id,
                    }}

                    this.setState({
                        selectedProvinces: userPermissions,
                        name: response.data.city.name,
                        id: response.data.city._id,
                        spinning: false
                    })
        }
        // console.log(response)
    };
    updateRole = async (e)=> {
        e.preventDefault();
        const {name, selectedProvinces, id} = this.state;

        let validation = this.handleValidations();
        if(validation.status){
            let userSelectedPermission = selectedProvinces.value;
            this.setState({loading: true});
            let response = await ApiCall.post(`${Url.UPDATE_CITY}/${this.props.match.params.id}`, {
                name: name,
                id: id,
                province: userSelectedPermission
            }, await config());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/city/view');
                return  NotificationManager.success(
                    "City Updated Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({loading: false});
            }
        }else {
            // console.log(validation)
            return  NotificationManager.error(
                validation.message,
                "Error",
                3000,
                null,
                null,
                'filled'
            );
        }

    };
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleSelectedRoles = selectedProvinces => {
        this.setState({selectedProvinces });
    };
    getAllProvinces = async ()=> {
        let response = await ApiCall.get(Url.ALL_PROVINCES, await config())
        // console.log(response)
        if(response.status=== 200){
            let options = response.data.provinces.map(function (item) {
                return {
                    value: item._id,
                    label: item.name,
                    key: item._id
                };
            })
            this.setState({provinces: options});
        }
    };
    handleValidations =  () => {
        let nameValidation = {
            message: 'Role Name Is Required',
            status: false
        };
        let permissionValidation = {
            message: 'Please assign at least one Permission',
            status: false
        };
        let passed = {
            status: true
        }
        return this.state.name !== ""? this.state.selectedProvinces.length === 0? permissionValidation : passed : nameValidation
    };
    render() {
        const {name, spinning} = this.state;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/city/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
                        </div>
                        <Breadcrumb heading="roles.update" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                {spinning? <div className='loading'/> :
                    <Row>
                        <Col xxs="10">
                            <div className='col-sm-12 col-lg-10 col-xs-12 '>
                                <Card>
                                    <div className="position-absolute card-top-buttons">
                                    </div>
                                    <CardBody>
                                        <CardTitle>
                                            <IntlMessages id="roles.update-role" />
                                        </CardTitle>
                                        <Form className="dashboard-quick-post" onSubmit={this.updateRole}>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="roles.role-name" />
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Name *'} required/>
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

                                            <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary" disabled={this.state.loading}>
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                                <span className="label"><IntlMessages id="roles.update" /></span>
                                            </Button>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </div>
                        </Col>

                    </Row>
                }

            </Fragment>
        )
    }
}
