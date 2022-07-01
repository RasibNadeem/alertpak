import React, { Component, Fragment } from "react";
import {Row, Col, CardBody, CardTitle,  Card, Button, } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import { NotificationManager } from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
// import { confirmAlert } from 'react-confirm-alert';
import {Link} from "react-router-dom";
import {Table} from "rsuite";
import '../table.css';
import DataTradesTable from "../../../components/DataTradesTable";
import TranslationsModal from "../settings/trasnlations-modal";
import {confirmAlert} from "react-confirm-alert";
const { Column, HeaderCell, Cell,  } = Table;
const quillModules = {
    toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            {list: "ordered"},
            {list: "bullet"},
            {indent: "-1"},
            {indent: "+1"}
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
export default class Translations extends Component {
    constructor() {
        super();
        this.state = {
            question: '',
            answer: '',
            loading: false,
            languages: [],
            entityId: '',
            translations: [],
            spinning: true,
            selectedLanguage: '',
            translationId: null,
            modalMethod: '',
            loadingApi: false,
            showModal: false,
            //Pagination
            displayLength: 10,
            page: 1
        };
    }


    componentDidMount() {
        this._isMounted = false
        this.getAllFaqs();
    };
    getAllFaqs = async ()=> {
        this.setState({spinning: true});
        const faqId = parseInt(this.props.match.params.id)
        if(!this._isMounted){
            let response = await ApiCall.get(Url.ALL_FAQS, await config())
            if(response.status=== 200){
                const translations =
                    response.data.faqs.filter(item => item.id === faqId).length> 0?
                response.data.faqs.filter(item => item.id === faqId)[0].translations : []
                this.setState({
                    faqs: response.data.faqs,
                    languages: response.data.languages,
                    translations,
                    spinning: false
                });
            }
        }

    };
    componentWillUnmount() {
        this._isMounted = true
    }
    handleInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    handleChangeContent = (content) => {
        this.setState({content});
    };
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
    toggle = (item) => {
        this.setState({
            showModal: !this.state.showModal
        })
        if (item.id) {
            this.setState({
                question: item.body[0].questions,
                answer: item.body[0].answers,
                selectedLanguage: item.language.id,
                modalMethod: 'update',
                translationId: item.id
            })
        }else {
            this.setState({
                question: '',
                answer: '',
                selectedLanguage: '',
                modalMethod: 'store'
            })
        }
    };
    storeTranslation = async () => {
        const {selectedLanguage, question, answer} = this.state;
        let validation = this.handleValidation();
        if(validation.status){
            this.setState({loadingApi: true})
            let response = await ApiCall.post(Url.STORE_FAQ_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  this.props.match.params.id,
                questions: question,
                answers: answer
            }, await config())
            if(response.status === 200){

                this.setState({
                    showModal: false,
                    question: '',
                    answer: '',
                    loadingApi: false
                })
                this.getAllFaqs();
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
        const {selectedLanguage, translationContent, translationId, question, answer} = this.state;
        let validation = this.handleValidation();
        if(validation.status){
            this.setState({loadingApi: true})
            let response = await ApiCall.post(Url.UPDATE_FAQ_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id: this.props.match.params.id,
                questions:  question,
                answers:  answer,
                policy: translationContent,
                id: translationId
            }, await config())
            if(response.status === 200){

                this.setState({
                    question: '',
                    answer: '',
                    showModal: false,
                    loadingApi: false
                })
                this.getAllFaqs();
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
        const {selectedLanguage, question, answer} = this.state;
        let languageValidation = {
            message: 'Please Select Language',
            status: false
        };
        let questionValidation = {
            message: 'Please write question',
            status: false
        };
        let answerValidation = {
            message: 'Please write answer',
            status: false
        };
        let passed = {
            status: true
        };
        return selectedLanguage !== null?
            selectedLanguage === ""? languageValidation :
                selectedLanguage === "Please Select Language"? languageValidation :
                    question === ""? questionValidation :
                        answer === ""? answerValidation :
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
            this.getAllFaqs();
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
        const data = this.getData()
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">

                        <div className="text-zero top-right-button-container">
                            <Link to='/app/faqs'><Button size='lg' color={'secondary'}>Go Back</Button></Link>
                        </div>
                        <Breadcrumb heading="faq.view" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                {/*<div className='d-flex justify-content-left align-items-center mb-5'>*/}
                                {/*    Question:*/}
                                {/*</div>*/}
                                <CardTitle>
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
                                    handleInputChange={this.handleInputChange}
                                    question={this.state.question}
                                    answer={this.state.answer}
                                    translationContent={this.state.translationContent}
                                    quillFormats={quillFormats}
                                    storeTranslation={this.storeTranslation}
                                    updateTranslation={this.updateTranslation}
                                    loadingApi={this.state.loadingApi}
                                    modalMethod={this.state.modalMethod}
                                />
                                }
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
            </Fragment>
        )
    }
}
