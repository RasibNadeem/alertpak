import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import {
    Card,
    CardBody,
    CardTitle,
    FormGroup,
    Label,
    Button,
    Form,
    Input
} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import { multipartConfig} from "../../../config/env";
import DropzoneExample from "../../../containers/forms/DropzoneExample";
import {Link} from "react-router-dom";

const initialState = {
    name: '',
    logo: '',
    loading: false
}
export default class CreatePartner extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };

    createPartner = async (e)=> {
        e.preventDefault();
        const {name, logo} = this.state;
        let validation = this.handleValidation()
        if(validation.status){
            this.setState({loading: true});
            const data = new FormData();
            data.append('name', name);
            data.append('logo', logo)
            let response = await ApiCall.post(Url.STORE_PARTNERS, data, await multipartConfig());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/partners/view')
                return  NotificationManager.success(
                    "Partner Stored Successfully",
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
    handleValidation = () => {
        const {name, logo} = this.state;
        let nameValidation = {
            message: 'Name is Required',
            status: false
        };
        let logoValidation = {
            message: 'Logo is required',
            status: false
        };
        let passed = {
            status: true
        };
        return name !== ''?
            logo === ''? logoValidation :
            passed : nameValidation
    }
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    onImageChange = (file) => {
        this.setState({
            logo: file
        })
    };
    onFileRemove = (item)=>{
      if(item){
          this.setState({
              logo: ''
          })
      }
    };
    render() {
        const {name} = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/partners/view'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.cancel"} /></Button></Link>
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
                                    <IntlMessages id="partner.create-partner" />
                                </CardTitle>
                                <Form className="dashboard-quick-post" onSubmit={this.createPartner}>
                                    <FormGroup row>
                                        <Label sm="3">
                                            <IntlMessages id="partner.name" />
                                        </Label>
                                        <Colxx sm="9">
                                            <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Name of Partner *'} required/>
                                        </Colxx>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Label sm="3">
                                            <IntlMessages id="partner.logo" />
                                        </Label>
                                        <Colxx sm="9">
                                           <DropzoneExample
                                               fileTypes={'image/*'}
                                               removeFile={this.onFileRemove}
                                               onChange={this.onImageChange}
                                           />
                                        </Colxx>
                                    </FormGroup>
                                    <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary" disabled={this.state.loading}>
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                        <span className="label"><IntlMessages id="partner.create" /></span>
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
