import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Form, FormGroup, Input, Label, Row} from "reactstrap";
import IntlMessages from "../../helpers/IntlMessages";
import {Colxx, Separator} from "../../components/common/CustomBootstrap";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import ApiCall from '../../config/network';
import Url from '../../config/api';
import {NotificationManager} from "../../components/common/react-notifications";
import {config} from "../../config/env";
import PhoneInput from "react-phone-input-2";
import 'react-phone-input-2/lib/style.css'
const initialState = {
    email: '',
    email2: '',
    phone: '',
    phoneNumber2: '',
    name: '',
    password: '',
    confirmPassword: '',
    oldPassword: '',
    loading: false
}

export default class AdminProfile extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this.setState({
            email: JSON.parse(localStorage.currentUser).email,
            email2: JSON.parse(localStorage.currentUser).email2,
            phone: JSON.parse(localStorage.currentUser).phoneNumber,
            phoneNumber2: JSON.parse(localStorage.currentUser).phoneNumber2,
            name: JSON.parse(localStorage.currentUser).name,
            userId: JSON.parse(localStorage.currentUser)._id,
        })
    }

    updateProfile = async (e)=> {
        e.preventDefault();
        const { name, email2, phoneNumber2, phone, password, oldPassword, confirmPassword} = this.state;



        let validation = this.handleValidations();
        if(validation.status){

            if(password === "" && oldPassword === "" && confirmPassword === ""){
                this.setState({loading: true})
                let response = await ApiCall.post(Url.UPDATE_ADMIN_PASSWORD, {
                    name: name , phoneNumber: phone , email2 ,phoneNumber2
                }, await config());
                if(response.status === 200){
                    this.setState({
                        loading: false
                    })
                    localStorage.setItem('currentUser', JSON.stringify(response.data.currentUser));
                    this.props.history.push('/app/dashboard/view')

                    return  NotificationManager.success(
                        "User Updated Successfully",
                        "Success",
                        3000,
                        null,
                        null,
                        'filled');

                }else {
                    this.setState({
                        loading: false
                    })
                }
            }else {
                let passValidation = this.passwordValidations();
                if(passValidation.status){
                    this.setState({loading: true})
                    let response = await ApiCall.post(Url.UPDATE_ADMIN_PASSWORD, {
                        password: oldPassword, newPassword: password ,
                        name: name , phoneNumber: phone, phoneNumber2, email2
                    }, await config());
                    if(response.status === 200){
                        this.setState({
                            loading: false
                        })
                       await NotificationManager.success(
                            "User Updated Successfully.Kindly Login Again.",
                            "Success",
                            3000,
                            null,
                            null,
                            'filled');

                        localStorage.removeItem('userToken');
                        localStorage.removeItem('currentUser');
                        localStorage.removeItem('userPermission');
                        this.props.history.push('/user/login')
                    }else {
                        this.setState({
                            loading: false
                        })
                    }
                }else {
                    return  NotificationManager.error(passValidation.message, "Error", 3000, null, null, 'filled');
                }

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
    handleValidations =  () => {
        let nameValidation = {
            message: "Name Is Required",
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
                this.state.phone === "" ? phoneValidation :
                    this.state.phone.length != 12 ? phoneValidationLength :
                        // this.state.phoneNumber2 === "" ? phoneValidation2 :
                        //      this.state.phoneNumber2.length != 12 ? phoneValidationLength2 :
                                 passed :
            nameValidation
    };
    passwordValidations =  () => {
        let oldPasswordValidation = {
            message: 'Old Password Is Required',
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
        let passed = {
            status: true
        }
        return this.state.oldPassword !== ""?
                this.state.password === ""? passwordValidation :
                    this.state.phone === "" ? phoneValidation :
                        this.state.phone.length != 12 ? phoneValidationLength :
                            this.state.confirmPassword === ""? confirmPasswordValidation :
                                this.state.password.length <8? passwordLength :
                                    this.state.password !== this.state.confirmPassword? passwordEquality :
                                        passed :
        oldPasswordValidation
    };
    goBack=()=>{
        this.props.history.goBack();
    };
    render() {
        const {email, email2, phoneNumber2, password, oldPassword, name, confirmPassword, phone} = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Button size='lg' color={'secondary'} onClick={this.goBack}>Go Back</Button>
                        </div>
                        <Breadcrumb heading="profile" match={this.props.match} />
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
                                        <IntlMessages id="updateProfile" />
                                    </CardTitle>
                                    <Form className="dashboard-quick-post" onSubmit={this.updateProfile}>

                                        <FormGroup row>
                                            <Label sm="3">
                                                Email 1
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
                                                <IntlMessages id="name" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text"  value={name} onChange={this.handleInputChange} name="name" placeholder={'Name *'} required/>
                                            </Colxx>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="oldPassword" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="password" value={oldPassword} onChange={this.handleInputChange} name="oldPassword" placeholder={'Old Password *'} />
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                               New <IntlMessages id="password" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="password" value={password} onChange={this.handleInputChange} name="password" placeholder={'New Password *'} />
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="confirmPassword" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="password" value={confirmPassword} onChange={this.handleInputChange} name="confirmPassword" placeholder={'Confirm Password *'} />
                                            </Colxx>
                                        </FormGroup>

                                        <FormGroup row>
                                            <Label sm="3">
                                                Phone No. 1
                                            </Label>
                                            <Colxx sm="9">
                                                {/*<Input type="number" value={phone} onChange={this.handleInputChange} name="phone" placeholder={'Phone Number *'}/>*/}
                                                <PhoneInput
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
                                                    value={phoneNumber2}
                                                    onChange={phoneNumber2 => this.setState({ phoneNumber2 })}
                                                />
                                            </Colxx>
                                        </FormGroup>

                                        <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary">
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                            Update
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
