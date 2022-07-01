import React, { Component, Fragment } from "react";
import {Row, Col, CardTitle} from "reactstrap";
import {
    Card,
    CardBody,
    // CardTitle,
    FormGroup,
    // Label,
    Button,
    Form,
    // Input
} from "reactstrap";

import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';
import DataTradesTable from "../../../components/DataTradesTable";
import TranslationsModal from "./trasnlations-modal";
import {Table} from "rsuite";
import {confirmAlert} from "react-confirm-alert";
const {Column, HeaderCell, Cell} = Table;
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
    content: '',
    id: null,
    languages: [],
    entityId: '',
    translations: [],
    spinning: true,
    selectedLanguage: '',
    translationContent: '',
    translationId: null,
    modalMethod: '',
    loadingApi: false,
    showModal: false,
    //Pagination
    displayLength: 10,
    page: 1,
}
export default class Security extends Component {
    constructor(props) {
        super(props);
        this.state = initialState;
    };

    componentDidMount() {
        this._isUnmounted = false;
        this.getSecurity();
    };
    componentWillUnmount() {
        this._isUnmounted = false
    }

    getSecurity = async () => {
        this.setState({spinning: true})
        if(!this._isUnmounted){
            let response = await ApiCall.get(Url.GET_SECURITY, await config());
            if(response.status === 200){
                this.setState({
                    content: response.data.security.security,
                    id: response.data.security.id,
                    entityId: response.data.security.id,
                    languages: response.data.languages,
                    translations: response.data.security.translations,
                    spinning: false
                })
            }
        }
    }

    updateSecurity = async (e)=> {
        e.preventDefault();

        const {content, id} = this.state;
        if(content === ''){
            return NotificationManager.error(
                "Content is Required",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        } else if(content === "<p><br></p>"){
            return NotificationManager.error(
                "Content is Required",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }else {
            this.setState({loading: true});
            let response = await ApiCall.post(Url.UPDATE_SECURITY, {
                security: content,
                id: id
            }, await config());
            if(response.status === 200){
                this.getSecurity();
                this.setState({loading: false});
                return  NotificationManager.success(
                    "Security Updated Successfully",
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

    };

    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleChangeContent = (content) => {
        this.setState({ content });
    }
    handleChangePage = (dataKey) => {
        this.setState({
            page: dataKey
        });
    };
    handleChangeLength = (dataKey) => {
        this.setState({
            page: 1,
            displayLength: dataKey
        });
    };
    getData = () => {
        const {displayLength, page, translations} = this.state;
        return translations.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    handleSelectLanguage = (e) => {
        this.setState({
            selectedLanguage: e.target.value
        })
    };
    handleChangeTranslationContent = (translationContent) => {
        this.setState({translationContent});
    };
    toggle = (item) => {
        this.setState({
            showModal: !this.state.showModal
        })
        if (item.id) {
            this.setState({
                translationContent: item.body[0].security,
                selectedLanguage: item.language.id,
                modalMethod: 'update',
                translationId: item.id
            })
        }else {
            this.setState({
                translationContent: '',
                selectedLanguage: '',
                modalMethod: 'store'
            })
        }
    };
    storeTranslation = async () => {
        const {selectedLanguage, translationContent, entityId} = this.state;
        let validation = this.handleValidation();
        if(validation.status){
            this.setState({loadingApi: true})
            let response = await ApiCall.post(Url.STORE_SECURITY_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  entityId,
                security: translationContent
            }, await config())
            if(response.status === 200){
                this.setState({
                    showModal: false,
                    loadingApi: false
                })
                this.getSecurity();
                return NotificationManager.success(
                    "Translation Stored Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({
                    loadingApi: false
                })
            }
        }else {
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
    updateTranslation = async () => {
        const {selectedLanguage, translationContent, entityId, translationId} = this.state;
        let validation = this.handleValidation();
        if(validation.status){
            this.setState({loadingApi: true})
            let response = await ApiCall.post(Url.UPDATE_SECURITY_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  entityId,
                security: translationContent,
                id: translationId
            }, await config())
            if(response.status === 200){

                this.setState({
                    showModal: false,
                    loadingApi: false
                })
                this.getSecurity();
                return NotificationManager.success(
                    "Translation Updated Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({
                    loadingApi: false
                })
            }
        }else {
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
    handleValidation = () => {
        const {selectedLanguage, translationContent,} = this.state;
        let languageValidation = {
            message: 'Please Select Language',
            status: false
        };
        let contentValidation = {
            message: 'Please write translation content',
            status: false
        };
        let passed = {
            status: true
        };
        return selectedLanguage !== null?
            selectedLanguage === ""? languageValidation :
                selectedLanguage === "Please Select Language"? languageValidation :
                    translationContent === ""? contentValidation :
                        translationContent === "<p><br></p>"? contentValidation :
                            passed
            : languageValidation

    };
    deleteTranslation  =  (item) => {
        confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Delete This Translation?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmDeleteTranslation(item)
                },
                {
                    label: "No",
                }
            ]
        })
    };
    confirmDeleteTranslation = async (id) => {
        let response = await ApiCall.post(Url.DELETE_TRANSLATION, {
            id: id,
        }, await config());
        if(response.status === 200){
            this.getSecurity();
            return  NotificationManager.success(
                "Translation deleted Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }
    };
    render() {
        const { content} = this.state;
        const data = this.getData()
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.security" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-12 col-xs-12 '>
                            <Card>
                                <div className="position-absolute card-top-buttons">
                                </div>
                                <CardBody>
                                    {/*<CardTitle>*/}
                                    {/*    <IntlMessages id="good-student.create-good" />*/}
                                    {/*</CardTitle>*/}
                                    <Form className="dashboard-quick-post" onSubmit={this.updateSecurity}>
                                        <FormGroup row>
                                            {/*<Label sm="3">*/}
                                            {/*    <IntlMessages id="good-student.content" />*/}
                                            {/*</Label>*/}
                                            <Colxx sm="12">
                                                <ReactQuill
                                                    theme="snow"
                                                    value={content}
                                                    onChange={this.handleChangeContent}
                                                    modules={quillModules}
                                                    formats={quillFormats}/>
                                            </Colxx>
                                        </FormGroup>
                                        <Button className={`float-right btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`} color="primary">
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                                            <span className="label"><IntlMessages id="save" /></span>
                                        </Button>
                                    </Form>
                                    <div style={{marginTop: '100px'}}>
                                        <CardTitle>
                                            {/*<IntlMessages id="good-student.create-good" />*/}
                                            Translations | <Button size='xs' color='primary'
                                                                   onClick={this.toggle}>Add</Button>
                                        </CardTitle>
                                        <DataTradesTable
                                            activePage={this.state.activePage}
                                            displayLength={this.state.displayLength}
                                            total={this.state.translations.length}
                                            onChangePage={this.handleChangePage}
                                            onChangeLength={this.handleChangeLength}
                                            data={data}
                                            loading={this.state.spinning}
                                        >
                                            <Column width={100} fixed align="center">
                                                <HeaderCell>No</HeaderCell>
                                                <Cell>
                                                    {(rowData, rowIndex) => {
                                                        return <span>{rowIndex + 1}</span>
                                                    }}
                                                </Cell>
                                            </Column>
                                            <Column minWidth={200} flexGrow={1} align="center">
                                                <HeaderCell>Name</HeaderCell>
                                                <Cell>
                                                    {(rowData, rowIndex) => {
                                                        return <span>{rowData.language.name}</span>
                                                    }}
                                                </Cell>
                                            </Column>
                                            <Column minWidth={200} flexGrow={1} align="center">
                                                <HeaderCell>Actions</HeaderCell>
                                                <Cell>
                                                    {(rowData, rowIndex) => {
                                                        return <div>
                                                            <Button color="secondary" size="xs" className="mb-2" onClick={()=>this.toggle(rowData)}>
                                                                <IntlMessages id="edit"/>
                                                            </Button>
                                                            {" "}{" "}
                                                            <Button color="danger" size="xs" className="mb-2"
                                                                onClick={() => this.deleteTranslation(rowData.id)}
                                                            >
                                                                <IntlMessages id="delete"/>
                                                            </Button>
                                                        </div>
                                                    }}
                                                </Cell>
                                            </Column>
                                        </DataTradesTable>
                                        {this.state.showModal &&
                                        <TranslationsModal
                                            showModal={this.state.showModal}
                                            toggle={this.toggle}
                                            languages={this.state.languages}
                                            handleSelectLanguage={this.handleSelectLanguage}
                                            selectedLanguage={this.state.selectedLanguage}
                                            quillModules={quillModules}
                                            handleChangeTranslationContent={this.handleChangeTranslationContent}
                                            translationContent={this.state.translationContent}
                                            quillFormats={quillFormats}
                                            storeTranslation={this.storeTranslation}
                                            updateTranslation={this.updateTranslation}
                                            loadingApi={this.state.loadingApi}
                                            modalMethod={this.state.modalMethod}
                                        />
                                        }

                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Col>

                </Row>
            </Fragment>
        )
    }
}
