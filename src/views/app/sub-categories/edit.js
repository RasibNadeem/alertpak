import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, CustomInput, Form, FormGroup, Input, Label, Row} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import {config} from "../../../config/env";
import {NotificationManager} from "../../../components/common/react-notifications";
import {Link} from "react-router-dom";
import DropzoneExample from "../../../containers/forms/DropzoneExample";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";

const initialState = {
    name: '',
    id: null,
    parentId:"",
    imageUrl: "",
    categories: [],
    selectedCategory: '',
    image: '',
    loading: false,
    spinning: false
}
export default class UpdateCategory extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    }

    componentDidMount() {
        this._isMounted = false
        this.getAllCategories();
        this.getSingleCategoryData();
    }
    componentWillUnmount() {
        this._isMounted = true
    }

    getAllCategories = async () => {
        if (!this._isMounted) {
            let response = await ApiCall.get(Url.ALL_CATEGORIES_OPEN, await config())
            // console.log(response)
            if (response.status === 200) {
                this.setState({categories: response.data.categories.reverse()});
            }
        }

    };
    getSingleCategoryData = async () => {
        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.EDIT_CATEGORY}/${this.props.match.params.slug}`, await config());
        // return console.log(response.data.category.parentId)
        if (response.status === 200) {
            if(!this._isMounted){
                this.setState({
                    name: response.data.category.name,
                    id: response.data.category._id,
                    imageUrl: response.data.category.image,
                    selectedCategory: response.data.category.parentId,
                });
                this.state.parentId = {label:this.state.selectedCategory.name, value:this.state.selectedCategory._id, key:this.state.selectedCategory._id}
            }
            this.setState({spinning: false});
        }
    }
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };


    updateCategory = async (e) => {
        e.preventDefault();
        const {name, parentId} = this.state;


        let validation = this.handleValidations();
        if (validation.status) {

            this.setState({loading: true});

            let response = await ApiCall.post(`${Url.UPDATE_SUB_CATEGORY}/${this.props.match.params.slug}`,{
                name: name,
                parentId: parentId.value
            }, await config());
            if (response.status === 200) {
                this.setState(initialState);
                this.props.history.push('/app/sub-categories/view')
                return NotificationManager.success(
                    "Category Updated Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            } else {
                this.setState({loading: false});
            }
        }
        else {

            return NotificationManager.error(
                validation.message,
                "Error",
                3000,
                null,
                null,
                'filled'
            );
        }

    };
    handleSelectTypeChange = (e) => {
        if (e.target.value !== 'null') {
            this.setState({selectedType: e.target.value})
        } else {
            this.setState({selectedType: ''})
        }
    };


    handleValidations = () => {
        const {
            name,
            parentId
        } = this.state;

        let nameValidation = {
            message: 'Please write Name',
            status: false,
        };
        let categoryValidation = {
            message: 'Please Select Category',
            status: false,
        };
        let passed = {
            status: true
        };
        return name !== "" ?
            parentId === ""? categoryValidation :
                passed
            : nameValidation
    };

    handleChangeCategories = (parentId) => {
        this.setState({ parentId })
    };

    handleAttributeChange = (e) => {
        this.setState({
            isFeatured: e.target.checked
        })
    }

    render() {
        const { name, imageUrl, spinning } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/sub-categories/view'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.cancel"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="category.edit" match={this.props.match}/>
                        <Separator className="mb-5"/>
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
                                            <IntlMessages id="category.update"/>
                                        </CardTitle>
                                        <Form className="dashboard-quick-post" onSubmit={this.updateCategory}>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    <IntlMessages id="name" /> *
                                                </Label>
                                                <Colxx sm="9">
                                                    <Input type="text" value={name} onChange={this.handleInputChange} name="name" placeholder={'Name of SubCategory *'}/>
                                                </Colxx>
                                            </FormGroup>

                                            <FormGroup row>
                                                <Label sm="3">
                                                    Select Category*
                                                    {/*<IntlMessages id="closed-Opened"/>**/}
                                                </Label>
                                                <Colxx sm="9">
                                                    <Select
                                                        components={{ Input: CustomSelectInput }}
                                                        className="react-select"
                                                        classNamePrefix="react-select"
                                                        placeHoleder={'Please Select Post Categories'}
                                                        name="form-field-name"
                                                        value={this.state.parentId}
                                                        onChange={this.handleChangeCategories}
                                                        options={this.state.categories.map(item => {
                                                            return {label: item.name, value: item._id, key: item._id}
                                                        })}
                                                    />
                                                </Colxx>
                                            </FormGroup>

                                            <Button
                                                className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                                                color="primary" disabled={this.state.loading}>
                                                <span className="spinner d-inline-block"><span className="bounce1"/><span className="bounce2"/><span className="bounce3"/></span>
                                                <span className="label"><IntlMessages id="category.update"/></span>
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
