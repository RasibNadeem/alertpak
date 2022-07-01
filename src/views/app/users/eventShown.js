import React, { useState, useEffect } from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter, Button} from "reactstrap";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import moment from "moment";
import {config} from "../../../config/env";
import ReactTable from "../../../components/table";
import {Table} from "rsuite";
const { Column, HeaderCell, Cell } = Table;
// import ReactTable from "../../../components/table";
// import IntlMessages from "../../../helpers/IntlMessages";
// import {Link} from "react-router-dom";

const UserHistory = ({isEventOpen, toggleEventsModal, selectedUser}) => {

    const [userEvent,userSelectedEvent] = useState([]);
    const [allUserEvent,allUserSelectedEvents] = useState([]);
    const [spinning, updateSpinning] = useState(false)
    const [displayLength, changeDisplayLength] = useState(5);
    const [page, changePage] = useState(1);

    const  getHistory = async() => {
        updateSpinning(true)
        let response = await ApiCall.get(`${Url.EVENT_CREATED_BY}/${selectedUser._id}`, await config());

        userSelectedEvent(
            [...userEvent, ...response.data.event]
        )
        allUserSelectedEvents(
            [...allUserEvent, ...response.data.event]
        )
        updateSpinning(false)

    }

    useEffect(() => {
        getHistory();
    },[selectedUser])


    const handleChangePage=(dataKey)=> {

        changePage(dataKey)

    };
    const handleChangeLength=(dataKey)=> {

        changePage(1);
        changeDisplayLength(dataKey);

    };

    const handleFilterChange = (e) => {
        changePage(1)
        const data = userEvent.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.createdAt.toLowerCase().indexOf(query) >= 0||
                item.title.toLowerCase().indexOf(query) >= 0
            )
        });
        allUserSelectedEvents(filteredData)
        if (e.target.value === '') {
            allUserSelectedEvents(userEvent)
        }
    };

    const getData = () => {
        return allUserEvent.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };

    return (
        <Modal isOpen={isEventOpen} toggle={toggleEventsModal} size="xl">
            <ModalHeader toggle={toggleEventsModal}>
                Event Created
            </ModalHeader>

            <ModalBody>
                <div className = "react-modal-custom-overflow">

                    <ReactTable
                        data={getData()}
                        loading={spinning}
                        activePage={page}
                        displayLength={displayLength}
                        total={userEvent.length}
                        onChangePage={handleChangePage}
                        onChangeLength={handleChangeLength}
                        handleFilterChange={handleFilterChange}
                    >
                        <Column width={200} align="center">
                            <HeaderCell>No</HeaderCell>
                            <Cell>
                                {(rowData, rowIndex) => {
                                    return <span>{rowIndex +1}</span>
                                }}
                            </Cell>
                        </Column>
                        <Column minWidth={200}  flexGrow={1} align="center">
                            <HeaderCell>Title Name</HeaderCell>
                            <Cell>
                                {(rowData, rowIndex) => {
                                    return <span>{rowData.title}</span>
                                }}
                            </Cell>
                        </Column>
                        <Column minWidth={200}  flexGrow={1} align="center">
                            <HeaderCell>Created At</HeaderCell>
                            <Cell>
                                {(rowData, rowIndex) => {
                                    return <span>{moment(rowData.createdAt).format('lll')}</span>
                                }}
                            </Cell>
                        </Column>

                    </ReactTable>

                </div>
            </ModalBody>


        </Modal>
    );
}

export default UserHistory;