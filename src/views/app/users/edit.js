import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {NotificationManager} from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import {Link} from "react-router-dom";
import DropzoneExample from "../../../containers/forms/DropzoneExample";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";

const initialState = {
    designation: '',
    name: "",
    phone: "",
    email2: '',
    phoneNumber2: '',
    email: '',
    password: '',
    id: null,
    confirmPassword: '',
    loading: false,
    imageUrl: "",
    image: '',
    spinning: true,
    provinces: [],
    selectedProvinces: [],
}

export default class UpdateUser extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        // this.getSingleUserData();
        this.getAllProvinces();

    }
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
            this.setState({provinces: options});
            this.getSingleUserData();
        }
    }

    handleSelectedProvinces = selectedProvinces => {
        this.setState({selectedProvinces });
    };


    getSingleUserData = async () => {
        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.USER_EDIT}/${this.props.match.params.id}`, await config());
        if(response.status === 200){
             let provinces =   response.data.user.provinces.map(item => {return {label: item.name, key: item._id, value: item._id}});
            this.setState({
                name: response.data.user.name,
                phone: response.data.user.phoneNumber,
                email: response.data.user.email,
                id: response.data.user.id,
                email2: response.data.user.email2,
                phoneNumber2: response.data.user.phoneNumber2,
                designation: response.data.user.designation,
                imageUrl: response.data.user.profile_image,
                selectedProvinces: provinces,
                spinning: false

            })
        }
    }

    updateUser = async (e)=> {
        e.preventDefault();
        const {name, email, password, email2, phoneNumber2,
            phone, confirmPassword, designation, image, selectedProvinces,
            id} = this.state;

        let validation = this.handleValidations();
        if(validation.status){
            let userSelectedProvinces = selectedProvinces.map(item => item.value);

            if(password === "" && confirmPassword === ""){

                this.setState({loading: true});
                const data = new FormData();
                data.append('name', name);
                data.append('email', email);
                data.append('email2', email2);
                data.append('phoneNumber2', phoneNumber2);
                data.append('provinces', JSON.stringify(userSelectedProvinces));
                data.append('designation', designation);
                data.append('phoneNumber', phone);
                data.append('image', image === "" ? null : image);
                let response = await ApiCall.post(`${Url.USER_UPDATE}/${this.props.match.params.id}`, data, await config());
                if (response.status === 200) {
                    this.setState(initialState);
                    this.props.history.push('/app/users/view')
                    return NotificationManager.success(
                        "User Updated Successfully",
                        "Success",
                        3000,
                        null,
                        null,
                        'filled'
                    );
                } else {
                    this.setState({loading: false});
                }

            }else {
                let passValidation = this.passwordValidations();
                if(passValidation.status){

                    this.setState({loading: true});
                    const data = new FormData();
                    data.append('name', name);
                    data.append('email', email);
                    data.append('provinces', JSON.stringify(userSelectedProvinces));
                    data.append('email2', email2);
                    data.append('phoneNumber2', phoneNumber2);
                    data.append('password', password);
                    data.append('designation', designation);
                    data.append('phoneNumber', phone);
                    data.append('image', image === "" ? null : image);
                    let response = await ApiCall.post(`${Url.USER_UPDATE}/${this.props.match.params.id}`, data, await config());
                    if (response.status === 200) {
                        this.setState(initialState);
                        this.props.history.push('/app/users/view')
                        return NotificationManager.success(
                            "User Updated Successfully",
                            "Success",
                            3000,
                            null,
                            null,
                            'filled'
                        );
                    } else {
                        this.setState({loading: false});
                    }

                }else {
                    return  NotificationManager.error(passValidation.message, "Error", 3000, null, null, 'filled');
                }

            }

        }else {
            return  NotificationManager.error(validation.message, "Error", 3000, null, null, 'filled');
        }

    };
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleChangeImage  = (file) => {
        this.setState({
            image: file
        })
    }
    removeImage = (file) => {
        if(file){
            this.setState({
                image: "",
                imageUrl: ""
            })
        }
    }
    passwordValidations =  () => {
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
        let designationValidation = {
            message: "Designation Is Required",
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
        let imageValidation = {
            message: 'Please Select image',
            status: false,
        };

        let passed = {
            status: true
        }
        return this.state.password !== ""?
            this.state.designation === ""? designationValidation :
                this.state.confirmPassword === ""? confirmPasswordValidation :
                        this.state.password.length <8? passwordLength :
                            this.state.password !== this.state.confirmPassword? passwordEquality :
                                (this.state.imageUrl == "" && this.state.image == "") ? imageValidation :
                                    this.state.phone === "" ? phoneValidation :
                                        this.state.phone.length != 12 ? phoneValidationLength :
                                            this.state.phoneNumber2.length ==0 ? passed:
                                                this.state.phoneNumber2.length != 12 ? phoneValidationLength2 :
                                                    passed :
            passwordValidation
    };
    handleValidations =  () => {
        let imageValidation = {
            message: 'Please Select image',
            status: false,
        };
        let designationValidation = {
            message: "Designation Is Required",
            status: false
        };
        let nameValidation = {
            message: "Name Is Required",
            status: false
        };

        let emailValidation = {
            message: 'Email Is Required',
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
        let passed = {
            status: true
        }
        return this.state.name !== ""?
            this.state.designation === ""? designationValidation :
                this.state.email === ""? emailValidation :
                    (this.state.imageUrl == "" && this.state.image == "")? imageValidation :
                        this.state.phone === "" ? phoneValidation :
                            this.state.phone.length != 12 ? phoneValidationLength :
                                // this.state.phoneNumber2 === "" ? phoneValidation2 :
                                //     (this.state.phoneNumber2) ? phoneValidation2 :
                                        this.state.phone.length != 12 ? phoneValidationLength :
                                            this.state.phoneNumber2.length ==0 ? passed:
                                                this.state.phoneNumber2.length != 12 ? phoneValidationLength2 :
                                            passed :
            nameValidation
    };

    render() {
        const {name, email, password,imageUrl,provinces, selectedProvinces,
            phone, email2, phoneNumber2, spinning,
            confirmPassword, designation} = this.state;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/users/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
                        </div>
                        <Breadcrumb heading="edit" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-10 col-xs-12 '>
                            {spinning ? <div className="loading"/> :

                                <Card>
                                    <div className="position-absolute card-top-buttons">
                                    </div>
                                    <CardBody>
                                        <CardTitle>
                                            <IntlMessages id="updateUser"/>
                                        </CardTitle>
                                        <Form className="dashboard-quick-post" onSubmit={this.updateUser}>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    Designation *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="text" value={designation}
                                                           onChange={this.handleInputChange} name="designation"
                                                           placeholder={'Designation *'}/>
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="name"/> *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="text" value={name} onChange={this.handleInputChange}
                                                           name="name" placeholder={'Name *'}/>
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    Email 1 *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="email" value={email} onChange={this.handleInputChange}
                                                           name="email" placeholder={'Email *'}/>
                                                </Colxx>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm="3">
                                                    Email 2
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="email" value={email2} onChange={this.handleInputChange}
                                                           name="email2" placeholder={'Email'}/>
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
                                                        classNamePrefix="react-select"
                                                        isMulti
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
                                                    Phone No. 1 *
                                                </Label>
                                                <Colxx sm="9">
                                                    <PhoneInput
                                                        value={phone}
                                                        onChange={phone => this.setState({ phone })}
                                                    />
                                                    {/*<Input type="number" value={phone} onChange={this.handleInputChange}*/}
                                                    {/*       name="phone" placeholder={'Phone Number *'}/>*/}
                                                </Colxx>
                                            </FormGroup>


                                            <FormGroup row>
                                                <Label sm="3">
                                                    Phone No. 2
                                                </Label>
                                                <Colxx sm="9">
                                                    <PhoneInput
                                                        value={phoneNumber2}
                                                        onChange={phoneNumber2 => this.setState({ phoneNumber2 })}
                                                    />
                                                    {/*<Input type="number" value={phoneNumber2}*/}
                                                    {/*       onChange={this.handleInputChange} name="phoneNumber2"*/}
                                                    {/*       placeholder={'Phone Number'}/>*/}
                                                </Colxx>
                                            </FormGroup>



                                            <FormGroup row>
                                                <Label sm="3">
                                                    Image *
                                                </Label>
                                                <Colxx sm="9">
                                                    <DropzoneExample
                                                        fileTypes="image/*"
                                                        url={imageUrl}
                                                        onChange={this.handleChangeImage}
                                                        removeFile={this.removeImage}
                                                    />
                                                </Colxx>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="password"/>
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="password" value={password}
                                                           onChange={this.handleInputChange} name="password"
                                                           placeholder={'Password'}/>
                                                </Colxx>
                                            </FormGroup>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="confirmPassword"/>
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="password" value={confirmPassword}
                                                           onChange={this.handleInputChange} name="confirmPassword"
                                                           placeholder={'Confirm Password'}/>
                                                </Colxx>
                                            </FormGroup>

                                            <Button
                                                className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                                                color="primary">
                                        <span className="spinner d-inline-block">
                          <span className="bounce1"/>
                          <span className="bounce2"/>
                          <span className="bounce3"/>
                        </span>
                                                <span className="label"><IntlMessages id="update"/></span>
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
