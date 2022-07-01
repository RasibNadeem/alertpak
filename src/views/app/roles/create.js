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
    permissions: [],
    selectedPermissions: [],
    loading: false
}

export default class CreateRole extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this.getAllPermissions();
    };

    createRole = async (e)=> {
        e.preventDefault();
        const {name} = this.state;
        let validation = this.handleValidations();
        if(validation.status){
            let userSelectedPermission = this.state.selectedPermissions.map(function (item) {
                return item.value
            });
            this.setState({loading: true});
            let response = await ApiCall.post(Url.STORE_ROLE, {
                name: name,
                permissions: userSelectedPermission
            }, await config());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/roles/view');
                return  NotificationManager.success(
                    "Role Created Successfully",
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
    handleSelectedRoles = selectedPermissions => {
        this.setState({selectedPermissions });
    };

    getAllPermissions = async ()=> {
        let response = await ApiCall.get(Url.ALL_PERMISSIONS, await config())
        if(response.status=== 200){
            let options = response.data.permissions.map(function (item) {
                return {
                    value: item._id,
                    label: item.name,
                    key: item._id
                };
            })
            // console.log(options)
            this.setState({permissions: options});
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
        return this.state.name !== ""? this.state.selectedPermissions.length === 0? permissionValidation : passed : nameValidation
    };
    render() {
        const {name} = this.state;

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/roles/view'><Button size='lg' color={'secondary'}>Cancel</Button></Link>
                        </div>
                        <Breadcrumb heading="roles.create" match={this.props.match} />
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
                                            <IntlMessages id="role.permissions" />
                                        </Label>
                                        <Colxx sm="9">
                                            <Select
                                                components={{ Input: CustomSelectInput }}
                                                className="react-select"
                                                classNamePrefix="react-select"
                                                placeholder="Select Permissions..."
                                                isMulti
                                                name="selectedPermissions"
                                                value={this.state.selectedPermissions}
                                                onChange={this.handleSelectedRoles}
                                                options={this.state.permissions}
                                            />
                                        </Colxx>
                                    </FormGroup>

                                    <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary" disabled={this.state.loading}>
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                        <span className="label"><IntlMessages id="roles.create-role" /></span>
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
