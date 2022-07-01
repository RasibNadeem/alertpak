import React, {Component, Fragment, useState} from "react";
import {Button} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import ReactTable from "../../../../components/table";
import {Table} from "rsuite";
import {Link} from "react-router-dom";
const { Column, HeaderCell, Cell } = Table;

const AdminView = ({
                       allUsers,
                       Data,
                       userType,
                       spinning,
                       page,
                       displayLength,
                       handleChangePage,
                       changeAccessStatus,
                       handleFilterChange,
                       toggleView,
                       toggle,
                       changeStatus,
                       handleChangeLength,
                       userPermissions,
                       toggleEventsModal,
                       toggleHistoryModal,
                       preferenceGet,
                       preferenceSelectedSupport,
                       preferenceSolving
                   }) =>{

    return (
        <ReactTable
            data={Data}
            loading={spinning}
            activePage={page}
            displayLength={displayLength}
            total={allUsers.length}
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

            {
                (userType == "NotShow"
                  ||  userType == "NotShowStaff") &&
                <Column minWidth={200}  flexGrow={1} align="center">
                    <HeaderCell>Events List</HeaderCell>
                    <Cell>
                        {(rowData, rowIndex) => {
                            return <Button color="secondary" size="xs" className="mb-2" onClick={()=>toggleEventsModal(rowData)}>
                                         See Events
                                    </Button>
                        }}
                    </Cell>
                </Column>
            }
            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>Name</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <span>{rowData.name}</span>
                    }}
                </Cell>
            </Column>
            <Column width={100} align="center">
                <HeaderCell>Image</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <div>
                            <img style={{height: '20px'}} src={rowData.profile_image} alt='profile'/>
                        </div>
                    }}
                </Cell>
            </Column>

            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>Email</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <span>{rowData.email}</span>
                    }}
                </Cell>
            </Column>
            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>Roles</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <div>
                            <Button color="primary" size="xs" className="mb-2" onClick={()=>toggleView(rowData.roles)}>
                                <IntlMessages id="user.view-roles" />
                            </Button>
                        </div>
                    }}
                </Cell>
            </Column>
            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>Actions</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <div>
                            {userPermissions.find(item => item.name === "users.edit") &&
                            <Button color="secondary" size="xs" className="mb-2" onClick={()=>toggle(rowData)}>
                                <IntlMessages id="user.change-roles" />
                            </Button>}
                            {" "}{" "}

                            { userType !== "NotShow"?
                                (rowData.isDeleted !== true) ?
                                    userPermissions.find(item => item.name === "users.delete") &&
                                    <Button color="success" size="xs" className="mb-2" onClick={()=> changeStatus(rowData._id)}>
                                        <IntlMessages id="delete" />
                                    </Button>
                                    :
                                    <Button color="danger" size="xs" className="mb-2" onClick={()=> changeStatus(rowData._id)}>
                                        Deleted
                                    </Button>
                                : ""
                            }


                        </div>
                    }}
                </Cell>
            </Column>


            //block
        {
            userType !== "NotShow" &&
            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>Access Status</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <div>
                            {
                                (rowData.isBlocked !== true) ?
                                    userPermissions.find(item => item.name === "users.block-status") &&
                                    <Button color="success" size="xs" className="mb-2" onClick={()=> changeAccessStatus(rowData._id)}>
                                        Block
                                    </Button>
                                    :
                                    <Button color="danger" size="xs" className="mb-2" onClick={()=> changeAccessStatus(rowData._id)}>
                                       Blocked
                                    </Button>
                            }
                        </div>
                    }}
                </Cell>
            </Column>
        }

            {
                userType !== "NotShow"?
                    <Column minWidth={200} flexGrow={1} align="center">
                        <HeaderCell>Preferences</HeaderCell>

                        <Cell>
                            {(rowData, rowIndex) => {
                                return <div>
                                    {(rowData.isPreference !== true) ?
                                        <Button disabled={preferenceSelectedSupport === rowData._id
                                        && preferenceSolving}
                                                className={`btn-shadow btn-multiple-state ${
                                                    preferenceSelectedSupport === rowData._id &&
                                                    preferenceSolving ? "show-spinner" : ""}`}
                                                onClick={() => preferenceGet(rowData)}
                                                color="danger" size="xs">
                                                            <span className="spinner d-inline-block">
                                                                <span className="bounce1"/>
                                                                <span className="bounce2"/>
                                                                <span className="bounce3"/>
                                                            </span><span className="label">
                                                            Create Preference
                                                                </span>
                                        </Button>
                                        :
                                        <Button disabled={preferenceSelectedSupport === rowData._id
                                        && preferenceSolving}
                                                className={`btn-shadow btn-multiple-state ${
                                                    preferenceSelectedSupport === rowData._id &&
                                                    preferenceSolving ? "show-spinner" : ""}`}
                                                onClick={() => preferenceGet(rowData)}
                                                color="success" size="xs">
                                                            <span className="spinner d-inline-block">
                                                                <span className="bounce1"/>
                                                                <span className="bounce2"/>
                                                                <span className="bounce3"/>
                                                            </span><span className="label">
                                                        Update Preference
                                                                </span>
                                        </Button>
                                    }
                                </div>
                            }}
                        </Cell>

                    </Column>
                     :""
            }


            //edit

            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>Change Profile</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <div>
                            {userPermissions.find(item => item.name === "event.edit") &&
                            <Button color="secondary" size="xs" className="mb-2">
                                <Link to={`/app/users/edit/${rowData._id}`} style={{color: 'white'}}><IntlMessages id="edit" /></Link>
                            </Button>}
                        </div>
                    }}
                </Cell>
            </Column>

            //history

            <Column minWidth={200}  flexGrow={1} align="center">
                <HeaderCell>History</HeaderCell>
                <Cell>
                    {(rowData, rowIndex) => {
                        return <div>
                            {userPermissions.find(item => item.name === "users.edit") &&
                            <Button color="secondary" size="xs" className="mb-2" onClick={()=>toggleHistoryModal(rowData)}>
                               Shown History
                            </Button>}

                        </div>
                    }}
                </Cell>
            </Column>

        </ReactTable>
    )
}


export default AdminView;