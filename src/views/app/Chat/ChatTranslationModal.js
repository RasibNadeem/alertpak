import React, {Fragment, useState} from "react";
import {Button, CardTitle, Modal, ModalBody, ModalHeader} from "reactstrap";
import DataTradesTable from "../../../components/DataTradesTable";
import IntlMessages from "../../../helpers/IntlMessages";
import {Table} from "rsuite";
import TranslationsModal from "../settings/trasnlations-modal";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import {config} from "../../../config/env";
import {NotificationManager} from "../../../components/common/react-notifications";
import {confirmAlert} from "react-confirm-alert";

const {Column, HeaderCell, Cell} = Table;
const initialState = {
    displayLength: 5,
    page: 1,
    showTranslationModal: false,
    message: '',
    selectedLanguage: '',
    modalMethod: '',
    translationId: '',
    loadingApi: false
}
const ChatTranslationModal = ({
                                  showModal, toggle,
                                  translations, languages,
                                  chatId, getSignals
}) => {
    const [state, setState] = useState(initialState)
    const toggleTranslations = (item) => {
        setState(prevState => ({
            ...prevState,
            showTranslationModal: !prevState.showTranslationModal
        }))
        if (item.id) {
            setState(prevState => ({
                ...prevState,
                message: item.body[0].message,
                selectedLanguage: item.language.id,
                modalMethod: 'update',
                translationId: item.id
            }))
        } else {
            setState(prevState => ({
                ...prevState,
                message: '',
                selectedLanguage: '',
                modalMethod: 'store'
            }))
        }
    };
    const getData = () => {
        const {displayLength, page} = state;
        return translations.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };
    const handleSelectLanguage = (e) => {
        setState(prevState => ({
            ...prevState,
            selectedLanguage: e.target.value
        }))
    };
    const storeTranslation = async () => {
        const {selectedLanguage, message} = state;
        let validation = handleValidation();
        if(validation.status){
            setState(prevState => ({...prevState, loadingApi: true}))
            let response = await ApiCall.post(Url.STORE_CHAT_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  chatId,
                message: message
            }, await config())
            if(response.status === 200){
                setState(prevState => ({
                    ...prevState,
                    showTranslationModal: false,
                    loadingApi: false
                }))
                getSignals();
                toggle('close')
                return NotificationManager.success(
                    "Translation Stored Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                setState(prevState => ({
                    ...prevState,
                    loadingApi: false
                }))
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
    const updateTranslation =async () => {
        const {selectedLanguage, message,translationId} = state;
        let validation = handleValidation();
        if(validation.status){
            setState(prevState => ({...prevState, loadingApi: true}))
            let response = await ApiCall.post(Url.UPDATE_CHAT_TRANSLATIONS, {
                language_id: selectedLanguage,
                entity_id:  chatId,
                id:  translationId,
                message: message
            }, await config())
            if(response.status === 200){
                setState(prevState => ({
                    ...prevState,
                    showTranslationModal: false,
                    loadingApi: false
                }))
                getSignals();
                toggle('close')
                return NotificationManager.success(
                    "Translation Updated Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                setState(prevState => ({
                    ...prevState,
                    loadingApi: false
                }))
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
    const handleValidation = () => {
        const {selectedLanguage, message,} = state;
        let languageValidation = {
            message: 'Please Select Language',
            status: false
        };
        let messageValidation = {
            message: 'Please write message translation',
            status: false
        };
        let passed = {
            status: true
        };
        return selectedLanguage !== null?
            selectedLanguage === ""? languageValidation :
                selectedLanguage === "Please Select Language"? languageValidation :
                    message === ""? messageValidation :
                            passed
            : languageValidation

    };
    const handleChangeChatMessage = (e) => {
        e.persist();
        setState(prevState => ({
           ...prevState,
           [e.target.name]: e.target.value
        }))
    };
    const data = getData();
   const deleteTranslation  =  (item) => {
       toggle('close')
       confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Delete This Translation?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => confirmDeleteTranslation(item)
                },
                {
                    label: "No",
                    onClick: () => toggle('show')
                }
            ]
        })
    };
   const confirmDeleteTranslation = async (id) => {
        let response = await ApiCall.post(Url.DELETE_TRANSLATION, {
            id: id,
        }, await config());
        if(response.status === 200){
            getSignals();
            toggle('close')
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
    return (
        <Fragment>

            <Modal isOpen={showModal} toggle={toggle} size='xl'>
                <ModalHeader toggle={toggle}>
                    Chat Translation
                </ModalHeader>
                <ModalBody>
                    <div className={translations.length> 0? 'mb-5' : ''}>
                        <CardTitle>
                            Translations |
                            <Button size='xs' color='primary'
                                    onClick={toggleTranslations}
                            >Add</Button>
                        </CardTitle>
                        <DataTradesTable
                            data={data}
                            loading={false}
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
                                            <Button color="secondary" size="xs" className="mb-2"
                                                onClick={()=>toggleTranslations(rowData)}
                                            >
                                                <IntlMessages id="edit"/>
                                            </Button>
                                            {" "}{" "}
                                            <Button color="danger" size="xs" className="mb-2"
                                                onClick={() => deleteTranslation(rowData.id)}
                                            >
                                                <IntlMessages id="delete"/>
                                            </Button>
                                        </div>
                                    }}
                                </Cell>
                            </Column>
                        </DataTradesTable>
                    </div>

                    {state.showTranslationModal &&
                    <TranslationsModal
                        showModal={state.showTranslationModal}
                        toggle={toggleTranslations}
                        languages={languages}
                        handleChangeChatMessage={handleChangeChatMessage}
                        handleSelectLanguage={handleSelectLanguage}
                        selectedLanguage={state.selectedLanguage}
                        storeTranslation={storeTranslation}
                        updateTranslation={updateTranslation}
                        loadingApi={state.loadingApi}
                        message={state.message}
                        modalMethod={state.modalMethod}
                    />
                    }
                </ModalBody>
            </Modal>
        </Fragment>
    )
}
export default ChatTranslationModal;