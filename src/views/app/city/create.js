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
    loading: false
}

export default class CreateRole extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this.getAllProvinces();
    };
    getAllProvinces = async ()=> {
        let response = await ApiCall.get(Url.ALL_PROVINCES, await config())
        if(response.status=== 200){
            let options = response.data.provinces.map(function (item) {
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


    createRole = async (e)=> {
        e.preventDefault();
        const {name} = this.state;
        let validation = this.handleValidations();
        if(validation.status){
            let userSelectedProvinces = this.state.selectedProvinces.value
            this.setState({loading: true});
            let response = await ApiCall.post(Url.STORE_CITY, {
                name: name,
                province: userSelectedProvinces
            }, await config());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/city/view');
                return  NotificationManager.success(
                    "City Created Successfully",
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

    handleValidations =  () => {
        let nameValidation = {
            message: 'City Name Is Required',
            status: false
        };
        let provinceValidation = {
            message: 'Please select Province.',
            status: false
        };
        let passed = {
            status: true
        }
        return this.state.name !== ""? this.state.selectedProvinces.length === 0? provinceValidation : passed : nameValidation
    };
    render() {
        const {name} = this.state;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/city/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
                        </div>
                        <Breadcrumb heading="city.create" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-10 col-xs-12 '>
                        <Card>
                            <div className="position-absolute card-top-buttons">
                            </div>
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="roles.create-role" />
                                </CardTitle>
                                <Form className="dashboard-quick-post" onSubmit={this.createRole}>
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
                                        Create City
                                    </Button>
                                </Form>
                            </CardBody>
                        </Card>
                        </div>
                    </Col>

                </Row>
            </Fragment>
        )
    }
}
