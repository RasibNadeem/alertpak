import React, { useState, useEffect } from 'react';
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    FormGroup,
    Label,
    Form,
    Input,
    CustomInput, CardBody, Row
} from "reactstrap";
import MonthPickerInput from 'react-month-picker-input';
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import moment from "moment";
import {config, multipartConfig} from "../../../config/env";
import {NotificationManager} from "../../../components/common/react-notifications";
import {Colxx} from "../../../components/common/CustomBootstrap";
import DatePicker from "react-datepicker";
import IntlMessages from "../../../helpers/IntlMessages";
import DropzoneExample from "../../../containers/forms/DropzoneExample";

const UserHistory = ({isExportOpen, toggleExportsModal ,changedState}) => {

    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState("");

    const handleValidations =  () => {
        let fileValidation = {
            message: 'Please Select A File.',
            status: false
        };
        let passed = {
            status: true
        }
        return file !== ""? passed : fileValidation
    };

    const handleChangeFile  = (file) => {
        setFile(
           file
        )
    }
    const removeFile = (file) => {
        if(file){
            setFile("")
        }
    }

    const saveFile = async (e) => {
        e.preventDefault();
        let validation = handleValidations();
        if(validation.status) {
            setLoading(true);
            const data = new FormData();
            data.append('file', file);
            let response = await ApiCall.post(Url.FILE_STORE, data, await multipartConfig());
            if (response.status === 200) {
                setLoading(false);
                changedState();
                return NotificationManager.success(
                    "File Saved Successfully",
                    "Success",
                    3000,
                    null,
                    null,
                    'filled'
                );
            } else {
                setLoading(false);
            }
        }
        else {
            // console.log(validation)
            return  NotificationManager.error(validation.message, "Error", 3000, null, null, 'filled');
        }
    }

    return (
        <Modal isOpen={isExportOpen} toggle={toggleExportsModal} size="lg">
            <ModalHeader toggle={toggleExportsModal}>
                Event File Saved
            </ModalHeader>
            <ModalBody>
                <FormGroup row>
                    <Label sm="1">

                    </Label>
                    <Label sm="3">
                        Select File *
                    </Label>
                    <Colxx sm="6">
                        <DropzoneExample
                            fileTypes=".pdf,.csv,.doc,.docx"
                            onChange={handleChangeFile}
                            removeFile={removeFile}
                        />
                    </Colxx>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    className={`btn-shadow btn-multiple-state ${loading ? "show-spinner" : ""}`}
                    color="primary" onClick={saveFile} disabled={loading} >
                    <span className="spinner d-inline-block">
                      <span className="bounce1"/>
                      <span className="bounce2"/>
                      <span className="bounce3"/>
                    </span>
                    <span className="label">
                        Save
                    </span>
                </Button>
            </ModalFooter>


        </Modal>
    );
}

export default UserHistory;