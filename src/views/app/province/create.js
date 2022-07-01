import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import {
    Card,
    CardBody,
    CardTitle,
    // UncontrolledDropdown,
    // DropdownItem,
    // DropdownToggle,
    // DropdownMenu,
    FormGroup,
    Label,
    Button,
    Form,
    Input
} from "reactstrap";
// import Select from "react-select";
// import CustomSelectInput from "../../../components/common/CustomSelectInput";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import {Link} from "react-router-dom";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";

const initialState = {
    name: '',
    provinces: [],
    selectedProvinces: [],
    loading: false
}
export default class CreatePermission extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this.getAllProvinces();
    };
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


    createPermission = async (e)=> {
        e.preventDefault();
        let userSelectedProvinces = this.state.selectedProvinces.value
        const {name} = this.state;

        let validation = this.handleValidations();
        if(validation.status){
            this.setState({loading: true});
            let response = await ApiCall.post(Url.STORE_PROVINCE, {
                name: name,
                country: userSelectedProvinces
            }, await config());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/province/view');
                return  NotificationManager.success(
                    "Province Stored Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({loading: false})
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
        // console.log(response)
        // console.log(this.state)
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
            message: 'Province Name Is Required',
            status: false
        };
        let provinceValidation = {
            message: 'Please select Country.',
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
                            <Link to='/app/province/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
                        </div>
                        <Breadcrumb heading="menu.create" match={this.props.match} />
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
                                    <IntlMessages id="permission.create" />
                                </CardTitle>
                                <Form className="dashboard-quick-post" onSubmit={this.createPermission}>

                                    <FormGroup row>
                                        <Label sm="3">
                                            <IntlMessages id="permission.name" />
                                        </Label>
                                        <Colxx sm="9">
                                            <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Name *'} required/>
                                        </Colxx>
                                    </FormGroup>

                                    <FormGroup row>
                                        <Label sm="3">
                                            Country
                                        </Label>
                                        <Colxx sm="9">
                                            <Select
                                                components={{ Input: CustomSelectInput }}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                placeholder="Select Country"
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
                                        <span className="label"><IntlMessages id="permission.create" /></span>
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
