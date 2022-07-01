import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {NotificationManager} from "../../../components/common/react-notifications";
import {config, multipartConfig} from "../../../config/env";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import Select from "react-select";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {Link} from "react-router-dom";
import DropzoneExample from "../../../containers/forms/DropzoneExample";

const initialState = {
    image: "",
    designation: '',
    name: '',
    phone: '',
    email2: '',
    phoneNumber2: '',
    email: '',
    password: '',
    confirmPassword: '',
    roles: [],
    selectedRoles: [],
    provinces: [],
    selectedProvinces: [],
    loading: false
}

export default class CreateUser extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this.getAllRoles();
        this.getAllProvinces();
    };

    createUser = async (e) => {
        e.preventDefault();
        const { name, email, email2, phoneNumber2, password, phone, designation, image } = this.state;
        let validation = this.handleValidations();
        if(validation.status){
            let userSelectedRoles = this.state.selectedRoles.value;
            let userSelectedProvinces = this.state.selectedProvinces.map(item => item.value);
            this.setState({loading: true});
            const data = new FormData();
            data.append('name', name);
            data.append('email', email);
            data.append('designation', designation);
            data.append('password', password);
            data.append('phoneNumber', phone);
            data.append('roles', userSelectedRoles);
            data.append('provinces', JSON.stringify(userSelectedProvinces));
            data.append('email2', email2);
            data.append('phoneNumber2', phoneNumber2);
            data.append('image', image);
            let response = await ApiCall.post(Url.USER_STORE, data, await multipartConfig());
                if(response.status === 200){
                    this.props.history.push('/app/users/view');
                    return  NotificationManager.success(
                        "User Created Successfully",
                        "Success",
                        3000,
                        null,
                        null,
                        'filled'
                    );
                }else {
                    this.setState({ loading: false });
                }
        }else {
            // console.log(validation)
            return  NotificationManager.error(validation.message, "Error", 3000, null, null, 'filled');
        }

    };
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleSelectedRoles = selectedRoles => {
        this.setState({selectedRoles });
    };

    handleSelectedProvinces = selectedProvinces => {
        this.setState({selectedProvinces });
    };

    handleChangeImage  = (file) => {
        this.setState({
            image: file
        })
    }
    removeImage = (file) => {
        if(file){
            this.setState({
                image: ""
            })
        }
    }
    getAllRoles = async ()=> {
        this.setState({spinning: true});
        let response = await ApiCall.get(Url.GET_ALL_ROLES, await config())
        // return console.log(response)
        if(response.status=== 200){
            let options = response.data.roles.map(function (item) {
                return {
                    value: item._id,
                    label: item.name,
                    key: item._id,
                    permissions: item.permissions,
                    createdAt: item.createdAt ,
                    updatedAt: item.updatedAt ,
                };
            })
            // console.log(options)
            this.setState({roles: options, spinning: false});
        }
    };
    getAllProvinces = async () =>{
        this.setState({spinning: true});
        let response = await ApiCall.get(Url.ALL_PROVINCES_OPEN, await config())
        // return console.log(response)
        if(response.status=== 200){
            let options = response.data.provinces.map(function (item) {
                return {
                    value: item._id,
                    label: item.name,
                    key: item._id,
                };
            })
            // console.log(options)
            this.setState({provinces: options, spinning: false});
        }
    }
    handleValidations =  () => {
        let imageValidation = {
            message: 'Please Select image',
            status: false,
        };
        let fNameValidation = {
            message: "Name Is Required",
            status: false
        };
        let emailValidation = {
            message: 'User Email Is Required',
            status: false
        };

        let phoneValidation = {
            message: 'Phone number 1 is Required',
            status: false
        };
        let phoneValidationLength = {
            message: 'Phone number 1 must be a valid number',
            status: false
        };
        let phoneValidation2 = {
            message: 'Phone number 2 is Required',
            status: false
        };
        let phoneValidationLength2 = {
            message: 'Phone number 2 must be a valid number',
            status: false
        };
        let passwordValidation = {
            message: 'User Password Is Required',
            status: false
        };
        let confirmPasswordValidation = {
            message: 'User Confirm Password Is Required',
            status: false
        };
        let passwordLength = {
            message: 'Password Must Be Greater Than 8 characters',
            status: false
        };
        let passwordEquality = {
            message: 'Password & Confirm Password Does Not Match',
            status: false
        };
        let provinceValidation = {
            message: 'Please select province to User.',
            status: false
        };
        let roleValidation = {
            message: 'Please assign one Role to User.',
            status: false
        };
        let designationValidation = {
            message: "Designation Is Required",
            status: false
        };

        let passed = {
            status: true
        }
        return this.state.name !== ""?
            this.state.email === ""? emailValidation :
                this.state.designation === ""? designationValidation :
                    this.state.phone === "" ? phoneValidation :
                        this.state.phone.length != 12 ? phoneValidationLength :
                            // this.state.phoneNumber2 === "" ? phoneValidation2 :
                                    this.state.image === ""? imageValidation :
                                        this.state.password === ""? passwordValidation :
                                            this.state.confirmPassword === ""? confirmPasswordValidation :
                                                this.state.password.length <8? passwordLength :
                                                    this.state.password !== this.state.confirmPassword? passwordEquality :
                                                        this.state.selectedRoles.length === 0? roleValidation :
                                                        this.state.selectedProvinces.length === 0? provinceValidation :
                                                            this.state.phoneNumber2.length < 4 ? passed :
                                                                this.state.phoneNumber2.length != 12 ? phoneValidationLength2 :
                passed :
            fNameValidation
    };


    render() {
        const { designation, phone, email, email2, phoneNumber2, password, confirmPassword, selectedRoles, provinces, selectedProvinces, roles, name, spinning} = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/users/view'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.cancel"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="user.create" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                {spinning?
                    <div className='loading' />
                :
                    <Row>
                        <Col xxs="10">
                            <div className='col-sm-12 col-lg-10 col-xs-12 '>
                                <Card>
                                    <div className="position-absolute card-top-buttons">
                                    </div>
                                    <CardBody>
                                        <CardTitle>
                                            <IntlMessages id="user.create-user" />
                                        </CardTitle>
                                        <Form className="dashboard-quick-post" onSubmit={this.createUser}>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    Designation *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="text" value={designation} onChange={this.handleInputChange} name="designation" placeholder={'Designation *'}/>
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="user.name" /> *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Name *'}/>
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    Email 1 *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="email" value={email} onChange={this.handleInputChange} name="email" placeholder={'Email *'}/>
                                                </Colxx>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm="3">
                                                    Email 2
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="email" value={email2} onChange={this.handleInputChange} name="email2" placeholder={'Email'}/>
                                                </Colxx>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm="3">
                                                   Phone No. 1 *
                                                </Label>
                                                <Colxx sm="9">
                                                    {/*<Input type="number" value={phone}  name="phone" placeholder={'Phone Number *'}/>*/}
                                                    <PhoneInput
                                                        country={'pk'}
                                                        value={phone}
                                                        onChange={phone => this.setState({ phone })}
                                                    />

                                                </Colxx>
                                            </FormGroup>


                                            <FormGroup row>
                                                <Label sm="3">
                                                   Phone No. 2
                                                </Label>
                                                <Colxx sm="9">
                                                    {/*<Input type="number" value={phoneNumber2} onChange={this.handleInputChange} name="phoneNumber2" placeholder={'Phone Number'}/>*/}
                                                    <PhoneInput
                                                        country={'pk'}
                                                        value={phoneNumber2}
                                                        onChange={phoneNumber2 => this.setState({ phoneNumber2 })}
                                                    />
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    Select Province *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Select
                                                        components={{ Input: CustomSelectInput }}
                                                        className="react-select"
                                                        isMulti
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Province *"
                                                        name="selectedRoles"
                                                        value={selectedProvinces}
                                                        onChange={this.handleSelectedProvinces}
                                                        options={provinces}
                                                    />
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="user.roles" /> *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Select
                                                        components={{ Input: CustomSelectInput }}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        placeholder="Select Roles *"
                                                        name="selectedRoles"
                                                        value={selectedRoles}
                                                        onChange={this.handleSelectedRoles}
                                                        options={roles}
                                                    />
                                                </Colxx>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm="3">
                                                    Image *
                                                </Label>
                                                <Colxx sm="9">
                                                    <DropzoneExample
                                                        fileTypes="image/*"
                                                        onChange={this.handleChangeImage}
                                                        removeFile={this.removeImage}
                                                    />
                                                </Colxx>
                                            </FormGroup>


                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="user.password" /> *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="password" value={password} onChange={this.handleInputChange} name="password" placeholder={'Password *'}/>
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="user.confirm-password" /> *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="password" value={confirmPassword} onChange={this.handleInputChange} name="confirmPassword" placeholder={'Confirm Password *'}/>
                                                </Colxx>
                                            </FormGroup>

                                            <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary">
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                                <span className="label"><IntlMessages id="user.create" /></span>
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
