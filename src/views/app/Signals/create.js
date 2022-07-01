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
import { ChromePicker } from 'react-color';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import {Link} from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import Select from "react-select";

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
    title: '',
    subtitle: '',
    entryPoint: '',
    detailedTextFrench: '',
    detailedTextDutch: '',
    selectedLanguages: [],
    isOpened: true,
    openedDateTime: moment(),
    tradesList: [],
    languages: [],
    detailedText: '',
    loading: true
}
export default class CreateSignal extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };

    componentDidMount() {
        this._isUmounted = false;
        this.getAllLanguages()
    };
    getAllLanguages =async () => {
        if(this._isUmounted) return ;
        let response = await ApiCall.get(Url.GET_ALL_LANGUAGES, await config())
        if(response.status === 200){
            this.setState({
                languages: response.data.languages.map(item => {return {label: item.name, key: item.id, value: item.id}}),
                loading: false
            })
        }
    };
    componentWillUnmount() {
        this._isUmounted = true
    };
    createSignal = async (e)=> {
        e.preventDefault();
        const {title,
            subtitle,
            entryPoint,
            isOpened,
            openedDateTime,
            tradesList,
            detailedText, selectedLanguages, detailedTextFrench,
            detailedTextDutch,} = this.state;
        let validation = this.handleValidation()
        if(validation.status){
            this.setState({loading: true});
            let translations;
            if(selectedLanguages.length=== 0){
                translations = []
            }else if (selectedLanguages.length=== 1){
                if(selectedLanguages.filter(item => item.label === 'French')){
                    translations=[{language_id: selectedLanguages[0].value, description: detailedTextFrench}]
                }else {
                    translations=[{language_id: selectedLanguages[0].value, description: detailedTextDutch}]
                }
            }else {
                translations=[
                    {
                        language_id: selectedLanguages.filter(item => item.label === 'French')[0].value,
                        description: detailedTextFrench
                    },
                    {
                        language_id: selectedLanguages.filter(item => item.label === 'Dutch')[0].value,
                        description: detailedTextDutch
                    }
                    ]
            }
           const data = {
               title: title,
               sub_title: subtitle,
               entry_point: entryPoint,
               open_date: moment(openedDateTime).format('YYYY-MM-DD HH:mm:ss'),
               description: detailedText,
               is_opened: isOpened? 1 : 0,
               translations: translations,
               details: tradesList
           }
            let response = await ApiCall.post(Url.VIP_SIGNAL_STORE, data, await config());
            if(response.status === 200){
                this.setState(initialState);
                this.props.history.push('/app/vip-signals/view')
                return  NotificationManager.success(
                    "Signal Stored Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({loading: false});
            }
        }
        else {
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
        const {title, subtitle,
            entryPoint, tradesList, detailedText,  detailedTextFrench,
            detailedTextDutch, selectedLanguages} = this.state;
        let titleValidation = {
            message: 'Title is Required',
            status: false
        };
        let subtitleValidation = {
            message: 'Subtitle is required',
            status: false
        };  let entryPointValidation = {
            message: 'Entry Point is required',
            status: false
        };
        let tradesListValidation = {
            message: 'Please Add One Or More Trades List',
            status: false
        };
        let detailedTextValidation = {
            message: 'Detailed Text is required',
            status: false
        };
        let detailedTextFrenchValidation = {
            message: 'Detailed Text French is required',
            status: false
        };
        let detailedTextDutchValidation = {
            message: 'Detailed Text Dutch is required',
            status: false
        };
        let passed = {
            status: true
        };
        return title !== ''?
            subtitle === ''? subtitleValidation :
            entryPoint === ''? entryPointValidation :
            tradesList.length === 0? tradesListValidation :
                detailedText === ''? detailedTextValidation :
                    (selectedLanguages.length> 0 && selectedLanguages.find(item => item.label === "French")
                    && detailedTextFrench === ""
                    )? detailedTextFrenchValidation :
                        (selectedLanguages.length> 0 && selectedLanguages.find(item => item.label === "Dutch")
                            && detailedTextDutch === ""
                        )? detailedTextDutchValidation :
                            (selectedLanguages.length> 0 && selectedLanguages.find(item => item.label === "French")
                                && detailedTextFrench === "<p><br></p>"
                            )? detailedTextFrenchValidation :
                                (selectedLanguages.length> 0 && selectedLanguages.find(item => item.label === "Dutch")
                                    && detailedTextDutch === "<p><br></p>"
                                )? detailedTextDutchValidation :
                passed : titleValidation
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
    handleChangeDateTime = date => {
        this.setState({
            openedDateTime: date
        });
    };
    handleChangeContent = (content) => {
        this.setState({ detailedText: content });
    };
    handleChangeFrenchContent = (detailedTextFrench) => {
        this.setState({ detailedTextFrench });
    };
    handleChangeDutchContent = (detailedTextDutch) => {
        this.setState({ detailedTextDutch });
    };
    handleAttributeChange = (e) => {
        this.setState({
            isOpened: e.target.checked
        })
    };
    handleTradeListAttributeChange = (index,event)=>{
        if(event.target.name === "title"){
            let tradesList = this.state.tradesList;
            tradesList[index].title = event.target.value;
            this.setState({
                tradesList: tradesList
            })
        }
        if(event.target.name === "point"){
            let tradesList = this.state.tradesList;
            tradesList[index].point = event.target.value;
            this.setState({
                tradesList: tradesList
            })
        }
        if(event.target.name === "is_checked"){
            let tradesList = this.state.tradesList;
            // console.log(event.target.checked)
            tradesList[index].is_checked = event.target.checked? 1 : 0;
            this.setState({
                tradesList: tradesList
            })
        }
    };
    addTradeListInput =() => {
        let tradesList = {'title':'', 'point': '', 'background_color': '#0F3D64', 'text_color':'#FFFFFF', 'is_checked': 1};
        this.setState(prevState => ({tradesList: [...prevState.tradesList, tradesList]}));
    };
    removeTradeListClick =(index) => {
        let tradesList = [...this.state.tradesList];
        tradesList.splice(index, 1);
        this.setState({tradesList});
    };
    handleBGChangeComplete = (index, color) => {
        let tradesList = this.state.tradesList;
        tradesList[index].background_color = color.hex;
        this.setState({
            tradesList: tradesList
        })
    };
    handleTextColorChangeComplete = (index, color) => {
        let tradesList = this.state.tradesList;
        tradesList[index].text_color = color.hex;
        this.setState({
            tradesList: tradesList
        })
    };
    AddTradeList = () => {
        return this.state.tradesList.map((el, index) => (
            <div key={index}>
                <Row>
                    <Col xs='10'>
                        <FormGroup>
                            <Colxx sm="12">
                                <Input className="form-control" id="validationCustom02" type="text" value={this.state.tradesList[index].title} onChange={this.handleTradeListAttributeChange.bind(this, index)} name="title" placeholder={'Title *'} required/>
                            </Colxx>
                        </FormGroup>
                    </Col>
                    <Col xs='10'>
                        <FormGroup>
                            <Colxx sm="12">
                                <Input className="form-control" id="validationCustom02" type="text" value={this.state.tradesList[index].point} onChange={this.handleTradeListAttributeChange.bind(this, index)} name="point" placeholder={'Point *'} required/>
                            </Colxx>
                        </FormGroup>
                    </Col>
                    <Col xs='12'>
                        <FormGroup>
                            <Label>
                                <IntlMessages id="backgroundColor" />
                            </Label>
                            <Colxx sm="12">
                                <ChromePicker
                                    onChangeComplete={ this.handleBGChangeComplete.bind(this, index)}
                                    color={this.state.tradesList[index].background_color}
                                />
                            </Colxx>
                        </FormGroup>
                    </Col>
                    <Col xs='12'>
                        <FormGroup>
                            <Label>
                                <IntlMessages id="textColor" />
                            </Label>
                            <Colxx sm="12">
                                <ChromePicker
                                    onChangeComplete={ this.handleTextColorChangeComplete.bind(this, index)}
                                    color={this.state.tradesList[index].text_color}
                                />
                            </Colxx>
                        </FormGroup>
                    </Col>
                    <Col xs='10'>
                        <FormGroup>
                            <Colxx sm="12">
                                <CustomInput
                                    type="checkbox"
                                    key={index}
                                    name='is_checked'
                                    checked={this.state.tradesList[index].is_checked}
                                    onChange={this.handleTradeListAttributeChange.bind(this, index)}
                                    id={index}
                                    label={'isChecked'}
                                />
                            </Colxx>
                        </FormGroup>
                    </Col>
                    <div className="col-md-2">
                        <div className="form-group">
                            <Button
                                color='danger'
                                size={'sm'}
                                onClick={() => {
                                    this.removeTradeListClick(index);
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
    };
    handleChangeLanguages = selectedLanguages => {
        this.setState({ selectedLanguages });
    };
    render() {
        const {
            title,
            subtitle,
            entryPoint,
            isOpened,
            openedDateTime,
            detailedText,
            detailedTextFrench,
            detailedTextDutch,
            languages,
            loading
        } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/vip-signals/view'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.cancel"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="menu.create" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                {loading? <div className='loading'/> :
                <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-10 col-xs-12 '>
                            <Card>
                                <div className="position-absolute card-top-buttons">
                                </div>
                                <CardBody>
                                    <CardTitle>
                                        <IntlMessages id="createSignal" />
                                    </CardTitle>
                                    <Form className="dashboard-quick-post" onSubmit={this.createSignal}>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="title" />*
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text" value={title} onChange={this.handleInputChange} name="title" placeholder={'Title *'} required/>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="subtitle" />*
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text" value={subtitle} onChange={this.handleInputChange} name="subtitle" placeholder={'Subtitle *'} required/>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="entryPoint" />*
                                            </Label>
                                            <Colxx sm="9">
                                                <Input type="text" value={entryPoint} onChange={this.handleInputChange} name="entryPoint" placeholder={'Entry Point *'} required/>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="openedDateAndTime" />*
                                            </Label>
                                            <Colxx sm="9">
                                                <DatePicker
                                                    className="mb-5"
                                                    selected={openedDateTime}
                                                    minDate={moment(new Date())}
                                                    onChange={this.handleChangeDateTime}
                                                    placeholderText={'Opened Date & Time'}
                                                    showTimeSelect
                                                    timeFormat="HH:mm"
                                                    timeIntervals={60}
                                                    dateFormat="LLL"
                                                    timeCaption="Time"
                                                    dropdownMode={"select"}/>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label  sm="3">
                                                <IntlMessages id="listOfTrades" />*
                                            </Label>
                                            <Colxx sm="9">
                                                {this.AddTradeList()}
                                                <button
                                                    type="button"
                                                    className="btn btn-primary"
                                                    onClick={() => this.addTradeListInput()}
                                                >
                                                    <IntlMessages id="addNew"/>
                                                </button>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="detailText" />*
                                            </Label>
                                            <Colxx sm="9">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={detailedText}
                                                    onChange={this.handleChangeContent}
                                                    modules={quillModules}
                                                    formats={quillFormats}/>
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                <IntlMessages id="closed-Opened"/>*
                                            </Label>
                                            <Colxx sm="9">
                                                <CustomInput
                                                    type="checkbox"
                                                    key={'isOpened'}
                                                    name='isOpened'
                                                    checked={isOpened}
                                                    onChange={this.handleAttributeChange}
                                                    id={'isFeatured'}
                                                    label={'isOpened'}
                                                />
                                            </Colxx>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Label sm="3">
                                                Available Translations
                                                {/*<IntlMessages id="closed-Opened"/>**/}
                                            </Label>
                                            <Colxx sm="9">
                                                <Select
                                                    components={{ Input: CustomSelectInput }}
                                                    className="react-select"
                                                    classNamePrefix="react-select"
                                                    isMulti
                                                    placeHoleder={'Please Select Language'}
                                                    name="form-field-name"
                                                    value={this.state.selectedLanguages}
                                                    onChange={this.handleChangeLanguages}
                                                    options={languages}
                                                />
                                            </Colxx>
                                        </FormGroup>
                                        {this.state.selectedLanguages.find(item => item.label === 'French') &&
                                        <FormGroup row>
                                            <Label sm="3">
                                                Detail Text (French)
                                                {/*<IntlMessages id="detailText" />**/}
                                            </Label>
                                            <Colxx sm="9">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={detailedTextFrench}
                                                    onChange={this.handleChangeFrenchContent}
                                                    modules={quillModules}
                                                    formats={quillFormats}/>
                                            </Colxx>
                                        </FormGroup>
                                        }
                                        {this.state.selectedLanguages.find(item => item.label === 'Dutch') &&
                                        <FormGroup row>
                                            <Label sm="3">
                                                Detail Text (Dutch)
                                                {/*<IntlMessages id="detailText" />**/}
                                            </Label>
                                            <Colxx sm="9">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={detailedTextDutch}
                                                    onChange={this.handleChangeDutchContent}
                                                    modules={quillModules}
                                                    formats={quillFormats}/>
                                            </Colxx>
                                        </FormGroup>}


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

                </Row>}
            </Fragment>
        )
    }
}
