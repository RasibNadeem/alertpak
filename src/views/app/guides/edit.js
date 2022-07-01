import React, { Component, Fragment } from "react";
import {Row, Col, CustomInput} from "reactstrap";
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
import {config} from "../../../config/env";
import "react-datepicker/dist/react-datepicker.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';
import {Link} from "react-router-dom";
const quillModules = {
    toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" }
        ],
        ["link", "image"],
        ["clean"]
    ]
};
const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
];
const initialState = {
    selectedCategory: '',
    title: '',
    categories: [],
    paragraph: '',
    selectedType: '',
    isFeatured: false,
    id: null,
    loading: false,
    spinning: true,
}
// function getBase64(img, callback) {
//     const reader = new FileReader();
//     reader.addEventListener('load', () => callback(reader.result));
//     reader.readAsDataURL(img);
// }
// var convertImgToDataURLviaCanvas = function(url, callback) {
//     var img = new Image();
//     img.crossOrigin = "anonymous";
//     img.onload = function() {
//         var canvas = document.createElement('CANVAS');
//         var ctx = canvas.getContext('2d');
//         var dataURL;
//         canvas.height = this.height;
//         canvas.width = this.width;
//         ctx.drawImage(this, 0, 0);
//         dataURL = canvas.toDataURL();
//         callback(dataURL);
//         canvas = null;
//     };
//     img.src = url
// }
export default class UpdateGuide extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };
    componentDidMount() {
        this._isMounted = false;
        this.getAllCategories();
        this.getSingleGuideData();
    }
    componentWillUnmount() {
        this._isMounted = true
    }
    updateGuide = async (e)=> {
        e.preventDefault();
        const {
            selectedCategory,
            title,
            paragraph,
            id,
            selectedType,
            isFeatured
        } = this.state;
        let validation = this.handleValidations();
        if(validation.status) {
            this.setState({loading: true})
            let response = await ApiCall.post(Url.UPDATE_GUIDES, {
                category_id: selectedCategory,
                title: title,
                id: id,
                paragraph: paragraph,
                featured: isFeatured? 1 : 0,
                type: selectedType
            }, await config());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/guides/view')
                return  NotificationManager.success(
                    "Guide Updated Successfully",
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
    handleValidations = ()=> {
        const {
            selectedCategory,
            title,
            paragraph,
            selectedType
        } = this.state;
        let categoryValidation = {
            message: 'Please Select Category',
            status: false,
        };
        let typeValidation = {
            message: 'Please Select Guide Type',
            status: false,
        };
        let paragraphValidation = {
            message: 'Please write paragraph',
            status: false,
        };
        let titleValidation = {
            message: 'Please write Title',
            status: false,
        };
        let passed = {
            status: true
        };
        return title !== ""?
            selectedCategory === ""? categoryValidation :
                selectedType === ""? typeValidation :
                paragraph === ""? paragraphValidation :
                    passed
            : titleValidation

    };
    getSingleGuideData = async ()=> {
        if(!this._isMounted){
            let response = await ApiCall.get(`${Url.EDIT_GUIDES}/${this.props.match.params.slug}`, await config());
            if(response.status=== 200){
                this.setState({title: response.data.guide.title,
                    selectedCategory: response.data.guide.category.id,
                    isFeatured: response.data.guide.featured === 1,
                    id: response.data.guide.id,
                    selectedType: response.data.guide.type,
                    paragraph: response.data.guide.paragraph,
                    spinning: false
                });
            }
        }
    }
    getAllCategories = async ()=> {
        if(!this._isMounted){
            let response = await ApiCall.get(Url.ALL_CATEGORIES, await config())
            // console.log(response)
            if(response.status=== 200){
                this.setState({categories: response.data.categories.reverse()});
            }
        }

    };

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleSelectCategoryChange  = (e)=> {
        if(e.target.value !== 'null'){
            this.setState({selectedCategory: e.target.value})
        }else {
            this.setState({selectedCategory: ''})
        }
    };
    handleSelectTypeChange  = (e)=> {
        if(e.target.value !== 'null'){
            this.setState({selectedType: e.target.value})
        }else {
            this.setState({selectedType: ''})
        }
    };

    handleAttributeChange = (e) => {
        this.setState({
            isFeatured: e.target.checked
        })
    }
    handleChangeContent = (content) => {
        this.setState({ paragraph: content });
    }
    render() {
        const {
            selectedCategory,
            title,
            categories,
            paragraph,
            selectedType,
            spinning
        } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/guides/view'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.cancel"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="guides.edit" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                {spinning? <div className={'loading'}/> : <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-10 col-xs-12 '>

                            <Card>
                                <div className="position-absolute card-top-buttons">
                                </div>
                                <CardBody>
                                    <CardTitle>
                                        <IntlMessages id="guides.update-guide" />
                                    </CardTitle>
                                    <Form className="dashboard-quick-post" onSubmit={this.updateGuide}>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="guide.title" />
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text" value={title} onChange={this.handleInputChange} name="title" placeholder={'Title *'} required/>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="guide.category" />
                                            </Label>
                                            <Colxx sm="9">
                                                <select
                                                    name="select"
                                                    className="form-control"
                                                    value={selectedCategory}
                                                    onChange={this.handleSelectCategoryChange}
                                                >
                                                    <option value='null'>Select an option..</option>
                                                    {categories.filter(item => item.type === 'guide').map(item => {
                                                        return(
                                                            <option value={item.id} key={item.id}>{item.name}</option>
                                                        )
                                                    })}
                                                </select>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                Type
                                            </Label>
                                            <Colxx sm="9">
                                                <select
                                                    name="select"
                                                    className="form-control"
                                                    value={selectedType}
                                                    onChange={this.handleSelectTypeChange}
                                                >
                                                    <option value='null'>Select an option..</option>
                                                    <option value='public'>Public</option>
                                                    <option value='private'>Private</option>

                                                </select>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                Featured
                                                {/*<IntlMessages id="guide.category"/>*/}
                                            </Label>
                                            <Colxx sm="9">
                                                <CustomInput
                                                    type="checkbox"
                                                    key={'featured'}
                                                    name='isFeatured'
                                                    checked={this.state.isFeatured}
                                                    onChange={this.handleAttributeChange}
                                                    id={'isFeatured'}
                                                    label={'is Featured'}
                                                />
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                Paragraph
                                            </Label>
                                            <Colxx sm="9">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={paragraph}
                                                    onChange={this.handleChangeContent}
                                                    modules={quillModules}
                                                    formats={quillFormats}/>
                                            </Colxx>
                                        </FormGroup>
                                        <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                                                color="primary" disabled={this.state.loading}

                                        >
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                            <span className="label"><IntlMessages id="guides.update" /></span>
                                        </Button>
                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                    </Col>

                </Row>}

            </Fragment>
        )
    }
}
