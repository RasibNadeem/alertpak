import React, {Component, Fragment} from "react";
import {Row, Col} from "reactstrap";
import {
    Card,
    CardBody,
    CardTitle,
    FormGroup,
    Label,
    Button,
    CustomInput,
    Form,
    Input
} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import axios from 'axios';
import '../table.css';
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {NotificationManager} from "../../../components/common/react-notifications";
import {config, multipartConfig} from "../../../config/env";
import "react-datepicker/dist/react-datepicker.css";
import {Link} from "react-router-dom";
import ReactQuill from "react-quill";
import Progress from "../components/Progress";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import DatePicker from "react-datepicker";
import moment from "moment";
import customStyles from "../../../data/colourOptions"
import DropzoneExample from "../../../containers/forms/DropzoneExample";
import MultipleDropzoneExample from "../../../containers/forms/MultipleDropzoneExample";
import SelectComponent from "../../../components/SelectComponent";
import {ChromePicker} from "react-color";
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
    videos: [],
    links: [],
    uploadPercentage:0,
    show: "link",
    showPanel:false,
    loading: false,
    spinning: false,
}

export default class CreatePost extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };

    componentDidMount() {
        this._isMounted = false;
        this.resetData();
    }

    resetData = async () => {
        if (!this._isMounted) {
            this.setState({videos: []});

        }

    };


    componentWillUnmount() {
        this._isMounted = true
    }

    createLinkVideo = async (e) => {
        e.preventDefault();
        console.log(this.state.links)
        let flag= false;
        this.state.links.map(link =>{
            if(!link.link.includes("youtube.com")){
                flag=true
            }

        })
    if(flag==false) {
        const {links} = this.state;
        this.setState({loading: true});
        let response = await ApiCall.post(`${Url.STORE_EVENT_LINKS}/${this.props.match.params.id}`
            , {
                videos: links,
            }, await config());
        if (response.status === 200) {
            this.setState(initialState);
            this.props.history.push('/app/event/view');
            return NotificationManager.success(
                "Video Link Updated Successfully",
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
    else{
        return NotificationManager.error(
            "Must put the youtube links",
            "Error",
            3000,
            null,
            null,
            'filled'
        );
    }
    };
    createEvent = async (e) => {
        e.preventDefault();
        const {
            videos
        } = this.state;

        // let validation = this.handleValidations();
        // if (validation.status) {

            this.setState({loading: true});
            const data = new FormData();
            videos.forEach((item) => {
                data.append('videos',item)
            })
        let dataUploading =0;
        let token = await  localStorage.getItem('userToken');
        const response = await axios.post(`${Url.STORE_EVENT_VIDEO}/${this.props.match.params.id}`, data,{
            headers: {
                'Authorization': `${token}`,
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: progressEvent => {

                    dataUploading = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
                    this.setState({
                        uploadPercentage: dataUploading
                    })

                // // Clear percentage
                // setTimeout(() => this.setState({
                //     uploadPercentage: 0
                // }), 2000000);
            }
        });

            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/event/view');
                return  NotificationManager.success(
                    "Videos Uploaded Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({loading: false});
            }
        // } else {
        //
        //     return NotificationManager.error(
        //         validation.message,
        //         "Error",
        //         3000,
        //         null,
        //         null,
        //         'filled'
        //     );
        // }
    };
    handleValidations = () => {
        const {
            videos,
            passed
        } = this.state;
        let videoValidation = {
            message: 'Please select at least one video.',
            status: false,
        };
        return videos.length == 0? passed
            : videoValidation

    };

    handleChangeVideos  = (file) => {
        let files = this.state.videos;
        files.push(file)
        this.setState({
            videos: files
        })
    }

    removeVideo = (file) => {
        let videos = this.state.videos.filter(item => item !== file);
        if(file){
            this.setState({
                videos
            })
        }
    }

    onChangedRadioChecked = (  e ) => {

        this.setState({showLink: e.target.checked})
        console.log(this.state.showLink)

    };

    addLinksInput = () => {
        let links = {'link':'',};
        this.setState(prevState => ({links: [...prevState.links, links]}));
    }

    handleRowAttributeChange = (e, index) => {
        if(e.target.name === "link"){
            let links = this.state.links;
            links[index].link = e.target.value;
            this.setState({ links })
        }
    }

    addLinks = () => {
        return this.state.links.map((el, index) => (
            <div key={index}>
                <Row>
                    <Col xs='10'>
                        <FormGroup>
                            <Colxx sm="12">
                                <Input className="form-control" id="validationCustom02" type="text" value={this.state.links[index].link}
                                       onChange={(e) => this.handleRowAttributeChange(e, index)} name="link" placeholder={'Link *'} required/>
                            </Colxx>
                        </FormGroup>
                    </Col>
                    <div className="col-md-2">
                        <div className="form-group">
                            <Button
                                color='danger'
                                size={'sm'}
                                onClick={() => {
                                    this.removeLinksClick(index);
                                }}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                </Row>
                {/*<hr />*/}
            </div>
        ));

    }

    removeLinksClick = (index) => {
        let links = [...this.state.links];
        links.splice(index, 1);
        this.setState({links});
    }

    render() {
        const {
            spinning,
        } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/event/view'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.cancel"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="guides.create" match={this.props.match}/>
                        <Separator className="mb-5"/>
                    </Colxx>
                </Row>
                {spinning? <div className="loading"/> :
                    <Row>
                        <Col xxs="10">
                            <div className='col-sm-12 col-lg-10 col-xs-12 '>

                                <Card>
                                    <div className="position-absolute card-top-buttons">
                                    </div>
                                    <CardBody>
                                        <CardTitle>
                                           Upload Files
                                        </CardTitle>
                                        <Form className="dashboard-quick-post" onSubmit={
                                            this.state.show === "link"?
                                            this.createLinkVideo
                                                : this.createEvent
                                        }>

                                            <FormGroup>
                                                <Label for="exCustomRadio">
                                                    Please Select a Field
                                                </Label>
                                                <div>
                                                    <CustomInput
                                                        type="radio"
                                                        id="exCustomRadio"
                                                        name="showLink"
                                                        value="link"
                                                        checked={this.state.show === 'link'}
                                                        onChange={e => this.setState({
                                                            show: e.target.value
                                                        })}
                                                        label="Links"
                                                    />
                                                    <CustomInput
                                                        type="radio"
                                                        id="exCustomRadio2"
                                                        value="uploader"
                                                        checked={this.state.show === 'uploader'}
                                                        onChange={e => this.setState({
                                                            show: e.target.value
                                                        })}
                                                        name="showLink"
                                                        label="Uploader"
                                                    />

                                                </div>
                                            </FormGroup>
                                            {this.state.show === "link"? <>

                                                    <FormGroup row>
                                                        <Label  sm="3">
                                                            Links
                                                        </Label>
                                                        <Colxx sm="9">
                                                            {this.addLinks()}
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={() => this.addLinksInput()}
                                                            >
                                                                <IntlMessages id="addNew"/>
                                                            </button>
                                                        </Colxx>
                                                    </FormGroup>

                                                </> :
                                                <>
                                            <FormGroup row>
                                                <Label sm="3">
                                                    Files *
                                                </Label>
                                                <Colxx sm="9">
                                                    <MultipleDropzoneExample
                                                        fileTypes="video/*,.pdf,.csv,.doc,.docx "
                                                        onChange={this.handleChangeVideos}
                                                        removeFile={this.removeVideo}
                                                    />
                                                </Colxx>
                                            </FormGroup>
                                            <Progress percentage={this.state.uploadPercentage} />
                                            </>}

                                            <Button
                                                className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                                                color="primary" disabled={this.state.loading}

                                            >
                                        <span className="spinner d-inline-block">
                          <span className="bounce1"/>
                          <span className="bounce2"/>
                          <span className="bounce3"/>
                        </span>
                                                <span className="label">Upload</span>
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
