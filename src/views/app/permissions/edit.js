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
const initialState = {
    name: '',
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
    }

    getSinglePermissionData = async ()=> {
        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.EDIT_PERMISSION}/${this.props.match.params.id}`, await config());
        if(response.status === 200){
            this.setState({
                name: response.data.permission.name,
                id: response.data.permission._id,
                spinning: false
            });
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
        let response = await ApiCall.post(`${Url.UPDATE_PERMISSION}/${this.props.match.params.id}`, {
            name: name,
            id: this.props.match.params.id
        }, await config());
        if(response.status === 200){
            this.setState(initialState);
            this.props.history.push('/app/permissions/view')
            return  NotificationManager.success(
                "Permission Updated Successfully",
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
    render() {
        const {name, spinning} = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/permissions/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
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
                                                <IntlMessages id="permission.update-permission" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Permission Name *'} required/>
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
