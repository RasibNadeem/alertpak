import React, { Component, Fragment } from "react";
import {Row, Col, CardBody, CardTitle, Card, Button, FormGroup, Input,} from "reactstrap";
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

export default class Translations extends Component {
    constructor() {
        super();
        this.state = {
            heading: '',
            subTitle: '',
            total: '',
            rows: [],
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
        this.getAllResults();
    };
    getAllResults = async () => {
        this.setState({spinning: true});
        const guideId = parseInt(this.props.match.params.id)
        if(!this._isMounted){
            let response = await ApiCall.get(Url.RESULTS, await config())
            if(response.status=== 200){
                const translations =
                    response.data.results.filter(item => item.id === guideId).length> 0?
                        response.data.results.filter(item => item.id === guideId)[0].translations : []
                const rows =  response.data.results.filter(item => item.id === guideId).length> 0?
                    response.data.results.filter(item => item.id === guideId)[0].details.map(item => {
                        return {position: ""}
                    }) : []
                this.setState({
                    languages: response.data.languages,
                    rows,
                    translations,
                    spinning: false
                });
            }
        }

    };
    AddResultList = () => {
        console.log(this.state)
        return this.state.rows.map((el, index) => (
            <div key={index}>
                <Row>
                    <Col xs='10'>
                        <FormGroup>
                            <Colxx sm="12">
                                <Input type="text" value={this.state.rows[index].position} onChange={(e) => this.handleRowsAttributeChange(e, index)} name="position" placeholder={`Position ${index + 1} *`} required/>
                            </Colxx>
                        </FormGroup>
                    </Col>
                </Row>
                {/*<hr />*/}
            </div>
        ));
    };

    handleRowsAttributeChange = (event, index) => {
        if(event.target.name === 'position'){
            let rows = this.state.rows;
            rows[index].position = event.target.value;
            this.setState({ rows })
        }
    };

    componentWillUnmount() {
        this._isMounted = true
    };
    handleResultInputChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
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
                heading: item.body[0].heading,
                subTitle: item.body[0].sub_heading,
                total: item.body[0].total,
                rows: item.body[0].details,
                selectedLanguage: item.language? item.language.id : item.language_id,
                modalMethod: 'update',
                translationId: item.id
            })
        }else {
            console.log(this.state)
            this.setState({
                heading: '',
                subTitle: '',
                total: '',
                rows: this.state.rows.map(() => {return {position: ""}} ),
                selectedLanguage: '',
                modalMethod: 'store'
            })
        }
    };
    storeTranslation = async () => {
        const {selectedLanguage, heading, subTitle, total, rows} = this.state;
        let validation = this.handleValidation();
        if(validation.status){
            this.setState({loadingApi: true})
            let response = await ApiCall.post(Url.STORE_RESULT_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  this.props.match.params.id,
                heading,
                sub_heading: subTitle,
                total: total,
                details: rows
            }, await config())
            if(response.status === 200){
                this.setState({
                    showModal: false,
                    heading: '',
                    subTitle: '',
                    total: '',
                    // rows: [],
                    loadingApi: false
                })
                this.getAllResults();
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
        const {selectedLanguage,  translationId,  heading, subTitle, total, rows} = this.state;
        let validation = this.handleValidation();
        if(validation.status){
            this.setState({loadingApi: true})
            let response = await ApiCall.post(Url.UPDATE_RESULT_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  this.props.match.params.id,
                heading: heading,
                sub_heading:subTitle,
                total:total,
                details:rows,
                id: translationId
            }, await config())
            if(response.status === 200){
                this.setState({
                    heading: '',
                    subTitle: '',
                    total: "",
                    showModal: false,
                    loadingApi: false
                })
                this.getAllResults();
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
        const {selectedLanguage, heading, subTitle, total} = this.state;
        let languageValidation = {
            message: 'Please Select Language',
            status: false
        };
        let headingValidation = {
            message: 'Please write Heading',
            status: false
        };
        let totalValidation = {
            message: 'Please write Total',
            status: false
        };
        let subTitleValidation = {
            message: 'Please write Sub Title',
            status: false
        };
        let passed = {
            status: true
        };
        return selectedLanguage !== null?
            selectedLanguage === ""? languageValidation :
                selectedLanguage === "Please Select Language"? languageValidation :
                    heading === ""? headingValidation :
                        subTitle === ""? subTitleValidation :
                        total === ""? totalValidation :
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
            this.getAllResults();
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
                            <Link to='/app/results/view'><Button size='lg' color={'secondary'}>Go Back</Button></Link>
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
                                                return <span>{rowData.language? rowData.language.name : rowData.language_id}</span>
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
                                    handleResultInputChange={this.handleResultInputChange}
                                    heading={this.state.heading}
                                    subTitle={this.state.subTitle}
                                    total={this.state.total}
                                    rows={this.state.rows}
                                    addResultList={this.AddResultList}
                                    translationContent={this.state.translationContent}
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
