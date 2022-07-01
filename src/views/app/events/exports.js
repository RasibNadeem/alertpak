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
import {config} from "../../../config/env";
import {NotificationManager} from "../../../components/common/react-notifications";
import {Colxx} from "../../../components/common/CustomBootstrap";
import DatePicker from "react-datepicker";
import IntlMessages from "../../../helpers/IntlMessages";

const UserHistory = ({isExportOpen, toggleExportsModal}) => {

    const [date,setDate] = useState("");
    const [month,setMonth] = useState(moment(Date.now()).format('MM'));
    const [year,setYear] = useState(moment(Date.now()).format('YYYY'));
    const [loading, setLoading] = useState(false);

    const handleValidations =  () => {
        let dateValidation = {
            message: 'Please Select month and year.',
            status: false
        };
        let passed = {
            status: true
        }
        return date !== ""? passed : dateValidation
    };

    const exportFile = async (e) => {
        e.preventDefault();
        let validation = handleValidations();
        if(validation.status) {
            const dateNext = "12/" + date

            const monthFormat = moment(dateNext).format('YYYYDD');
            setLoading(true);

            let response = await ApiCall.post(Url.EXPORT_CSV, {
                monthFormat: monthFormat
            }, await config());
            if (response.status === 200) {
                let openInNewTab = window.open(response.data.link);
                openInNewTab.focus()
                setLoading(false);

                return NotificationManager.success(
                    "Event Monthly Downloaded Successfully",
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
        <Modal isOpen={isExportOpen} toggle={toggleExportsModal} size="lg" >
            <ModalHeader toggle={toggleExportsModal}>
                Event Export
            </ModalHeader>

            <ModalBody>

                <FormGroup row>
                    <Label sm="4">
                        Select Month & Year
                    </Label>
                    <Colxx sm="6">
                        {/*<DatePicker*/}
                        {/*    className="mb-5"*/}
                        {/*    selected={date}*/}
                        {/*    onChange={date => setDate(date)}*/}
                        {/*    placeholderText={'Event Date *'}*/}
                        {/*    dateFormat="LLL"*/}
                        {/*    dropdownMode={"select"}/>*/}
                        <MonthPickerInput
                            onChange={ maskedValue => setDate(maskedValue) }
                            minDate={[1,2015]}
                            maxDate={[parseInt(month),parseInt(year)]}
                            closeOnSelect
                        />
                    </Colxx>

                </FormGroup>
            </ModalBody>
            <ModalFooter>
                {/*<Colxx sm="4">*/}
                    <Button
                        className={`float-right btn-shadow btn-multiple-state ${loading ? "show-spinner" : ""}`}
                        color="primary" onClick={exportFile} disabled={loading} >
                            <span className="spinner d-inline-block">
                              <span className="bounce1"/>
                              <span className="bounce2"/>
                              <span className="bounce3"/>
                            </span>
                        <span className="label">Export</span>
                    </Button>
                {/*</Colxx>*/}
            </ModalFooter>


        </Modal>
    );
}

export default UserHistory;