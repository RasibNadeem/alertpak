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

const UserHistory = ({isHistoryOpen, toggleHistoryModal, selectedUser}) => {

    const [userHistory,userSelectedHistory] = useState([]);
    const [allUserHistory,allUserSelectedHistory] = useState([]);
    const [spinning, updateSpinning] = useState(false)
    const [displayLength, changeDisplayLength] = useState(5);
    const [page, changePage] = useState(1);

    const  getHistory = async() => {
        updateSpinning(true)
        let response = await ApiCall.get(`${Url.GET_HISTORY}/${selectedUser._id}`, await config());
         userSelectedHistory(
            [...userHistory, ...response.data.userSessions]
        )
        allUserSelectedHistory(
            [...allUserHistory, ...response.data.userSessions]
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
        const data = userHistory.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.sessionType.toLowerCase().indexOf(query) >= 0||
                item.timeStamp.toLowerCase().indexOf(query) >= 0
            )
        });
        allUserSelectedHistory(filteredData)
        if (e.target.value === '') {
            allUserSelectedHistory(userHistory)
        }
    };

    const getData = () => {
        return allUserHistory.filter((v, i) => {
            const start = displayLength * (page - 1);
            const end = start + displayLength;
            return i >= start && i < end;
        });
    };

    return (
        <Modal isOpen={isHistoryOpen} toggle={toggleHistoryModal}  size="xl">
            <ModalHeader toggle={toggleHistoryModal}>
                Session History
            </ModalHeader>


            <ModalBody>
                <div className = "react-modal-custom-overflow">

                    <ReactTable
                        data={getData()}
                        loading={spinning}
                        activePage={page}
                        displayLength={displayLength}
                        total={userHistory.length}
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
                            <HeaderCell>Session Type</HeaderCell>
                            <Cell>
                                {(rowData, rowIndex) => {
                                    return <div>
                                        {
                                            (rowData.sessionType == "login") ?
                                                <Button color="success" size="xs" className="mb-2"
                                                        disabled>
                                                    Login
                                                </Button>
                                                :
                                                <Button color="danger" size="xs" className="mb-2"
                                                        disabled>
                                                    Logout
                                                </Button>
                                        }
                                    </div>
                                }}
                            </Cell>
                        </Column>
                        <Column minWidth={200}  flexGrow={1} align="center">
                            <HeaderCell>Time</HeaderCell>
                            <Cell>
                                {(rowData, rowIndex) => {
                                    return <span>{moment(rowData.timeStamp).format('lll')}</span>
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