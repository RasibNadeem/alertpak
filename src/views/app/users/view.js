import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Modal, ModalBody, ModalFooter, ModalHeader, Row} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
// import ReactTable from "react-table";
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {NotificationManager} from "../../../components/common/react-notifications";
import {config} from "../../../config/env";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import Select from "react-select";
import {Table} from "rsuite";
import ReactTable from "../../../components/table";
import {confirmAlert} from "react-confirm-alert";
import {Link} from "react-router-dom";
import UserHistory from "./userHistory";
import EventShown from "./eventShown";
import UserView from "./components/user";
import RolesViewModal from "./components/rolesViewModal";
import RolesChangeModal from "./components/rolesChangedModal";
import PreferenceChangeModal from "./components/preferenceChangedModal";

const { Column, HeaderCell, Cell } = Table;
export default class AllUsers extends Component {
    constructor() {
        super();
        this.state = {
            selectAll: false,
            admins: [],
            allAdmins: [],
            categories: [],
            allCategories: [],
            staffMember: [],
            allStaffMember: [],
            customers1: [],
            allCustomers1: [],
            customers2: [],
            allCustomers2: [],
            tempUser: "",
            customers3: [],
            allCustomers3: [],
            allRoles: [],
            checked: [],
            selectedUser: '',
            selectedUserPreferences: [],
            userRoles: [],
            userHistory: [],
            spinning: false,
            rolesUpdating: false,
            preferenceUpdating: false,
            rolesModal: false,
            rolesViewModal: false,
            preferenceModal: false,
            historyViewModal: false,
            userPermissions: localStorage.userPermission !== undefined? JSON.parse(localStorage.userPermission) : [],
            //Pagination
            displayLength: 10,
            page: 1,
            //admin pagination
            adminDisplayLength: 10,
            adminPage: 1,
            //staffMember pagination
            staffMemberDisplayLength: 10,
            staffMemberPage: 1,
            //customer1 pagination
            customer1DisplayLength: 10,
            customer1Page: 1,
            //customer2 pagination
            customer2DisplayLength: 10,
            customer2Page: 1,
            //customer3 pagination
            customer3DisplayLength: 10,
            customer3Page: 1,
            //History Modal
            isHistoryOpen: false,
            //Event Modal
            isEventOpen: false,
            //preferences
            preferenceSolving: false,
            preferenceSelectedSupport: null,

        };
    }


    componentDidMount() {
        this.getAllUsers();
    };



    getAllUsers = async ()=> {
        this.setState({spinning: true});
        let response = await ApiCall.get(Url.ALL_USERS, await config())

        if(response.status=== 200){
            let roles  = response.data.roles.map(item => {
                return {label: item.name, value: item._id, key: item._id, permissions: item.permissions}
            })

            let admin = response.data.users.filter(item => {
                if(item.roles.find(role => (role.name === "Admin"))){
                    return item
                }else {
                    return null
                }
            }).filter(i => (i !== null))

            let staff = response.data.users.filter(item => {
                if(item.roles.find(role => (role.name === "Staff Member"))){
                    return item
                }else {
                    return null
                }
            }).filter(i => (i !== null))

            let customer1 = response.data.users.filter(item => {
                if(item.roles.find(role => (role.name === "Customer 1"))){
                    return item
                }else {
                    return null
                }
            }).filter(i => (i !== null))

            let customer2 = response.data.users.filter(item => {
                if(item.roles.find(role => (role.name === "Customer 2"))){
                    return item
                }else {
                    return null
                }
            }).filter(i => (i !== null))

            let customer3 = response.data.users.filter(item => {
                if(item.roles.find(role => (role.name === "Customer 3"))){
                    return item
                }else {
                    return null
                }
            }).filter(i => (i !== null))

            let categories  = response.data.categories.map(item => {
                return {label: item.name, value: item._id, key: item._id}
            })

            this.setState({

                admins:admin,
                allAdmins:admin,
                staffMember: staff,
                allStaffMember: staff,
                customers1: customer1,
                allCustomers1: customer1,
                customers2: customer2,
                allCustomers2: customer2,
                customers3: customer3,
                allCustomers3: customer3,
                categories: categories,
                allCategories: categories,
                spinning: false, allRoles: roles});

        }else {
            this.setState({spinning: false, });

        }
    };

    handleSelectedRoles = userRoles => {
        this.setState({...this.state.selectedUserRoles, selectedUserRoles: userRoles });
    };
    handleSelectedPreferences = userRoles => {
        this.setState({...this.state.selectedUserPreferences, selectedUserPreferences: userRoles });
    };
    toggle = (item) => {
        this.setState(prevState => ({
            rolesModal: !prevState.rolesModal,
        }));
        if(Array.isArray(item.roles)){
            let userRoles = item.roles.map(item => {
                return {label: item.name, value: item._id, key: item._id, permissions: item.permissions}
            })
            this.setState({selectedUserRoles: userRoles, selectedUser: item});
        }

    };

    preferenceGet =async( item )=> {


        this.setState({changeStatus: true, preferenceSelectedSupport: item._id, preferenceSolving: true });

        this.state.tempUser = item._id

        let response = await ApiCall.get(`${Url.USER_PREFERENCE}/${item._id}`, await config());

        if (response.status === 200) {
            this.setState({changeStatus: false, preferenceSelectedSupport: null, preferenceSolving: false});


            let userPreferneces = await response.data.userPreferneces;

            let selectedUserPreferences = userPreferneces.map(item => {
                return {label: item.category.name, value: item.category._id, key: item.category._id}
            })
            this.setState({selectedUserPreferences: selectedUserPreferences});

            this.togglePreference(item)


        } else {
            this.setState({loading: false});
        }


    }

    togglePreference = (item) => {

        this.setState(prevState => ({
            preferenceModal: !prevState.preferenceModal,
        }));
        console.log(item)

    };
    changeUserPreferences= async () => {
        let preferences = this.state.selectedUserPreferences.map(item => {
            return item.value
        })
        if(preferences.length === 0){
            return  NotificationManager.error(
                "Please Select One Or More Preference",
                "Error",
                3000,
                null,
                null,
                'filled'
            );
        }
        this.setState({preferenceUpdating: true});

        let response = await ApiCall.post(`${Url.USER_PREFERENCE_UPDATE}/${this.state.tempUser}`, {
            categories: preferences,
        }, await config())

        if(response.status === 200){
            this.getAllUsers();
            this.setState({preferenceUpdating: false, preferenceModal: false});
            return  NotificationManager.success(
                "Preference Updated Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }else {
            this.setState({preferenceUpdating: false});
        }


    };

    changeUserRoles = async () => {
        let roles = this.state.selectedUserRoles.value
        if(roles.length === 0){
            return  NotificationManager.error(
                "Please Select One Or More Role",
                "Error",
                3000,
                null,
                null,
                'filled'
            );
        }
        this.setState({rolesUpdating: true});
        let response = await ApiCall.post(`${Url.CHANGE_USER_ROLE}/${this.state.selectedUser._id}`, {
            roles: roles,
        }, await config())
        if(response.status === 200){
            this.getAllUsers();
            this.setState({rolesUpdating: false, rolesModal: false});
            return  NotificationManager.success(
                "Role Updated Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }else {
            this.setState({rolesUpdating: false});
        }
        // console.log(response)
    };
    toggleView = (userRoles)=> {
        this.setState({
            rolesViewModal: !this.state.rolesViewModal,
        });
        if(Array.isArray(userRoles)){
            this.setState({userRoles: userRoles});
        }
    }
    historyShow = async(id) => {

        let response = await ApiCall.get(`${Url.GET_HISTORY}/${id}`, await config());


        this.setState(prevState => ({
            historyViewModal: !prevState.historyViewModal,
        }));
        if(Array.isArray(response.data)){
            this.setState({userHistory: response.data});
        }


    }
    handleChangePage=(dataKey)=> {
        // console.log(dataKey)
        this.setState({
            page: dataKey
        });
    };
    handleChangeLength=(dataKey)=> {
        this.setState({
            page: 1,
            displayLength: dataKey
        });
    };

    handleFilterChangeAdmin= (e) => {
        this.setState({page: 1})
        const data = this.state.admins.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.name.toLowerCase().indexOf(query) >= 0 ||
                // item.last_name.toLowerCase().indexOf(query) >= 0 ||
                item.email.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allAdmins: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allAdmins: this.state.admins
            })
        }
    };

    handleFilterChangeStaffMember = (e) => {
        this.setState({page: 1})
        const data = this.state.staffMember.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.name.toLowerCase().indexOf(query) >= 0 ||
                // item.last_name.toLowerCase().indexOf(query) >= 0 ||
                item.email.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allStaffMember: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allStaffMember: this.state.staffMember
            })
        }
    };

    handleFilterChangeCustomer1 = (e) => {
        this.setState({page: 1})
        const data = this.state.customers1.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.name.toLowerCase().indexOf(query) >= 0 ||
                // item.last_name.toLowerCase().indexOf(query) >= 0 ||
                item.email.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allCustomers1: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allCustomers1: this.state.customers1
            })
        }
    };

    handleFilterChangeCustomer2 = (e) => {
        this.setState({page: 1})
        const data = this.state.customers2.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.name.toLowerCase().indexOf(query) >= 0 ||
                // item.last_name.toLowerCase().indexOf(query) >= 0 ||
                item.email.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allCustomers2: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allCustomers2: this.state.customers2
            })
        }
    };

    handleFilterChangeCustomer3 = (e) => {
        this.setState({page: 1})
        const data = this.state.customers3.filter((v, i) => {
            const start = 1000 * (1 - 1);
            const end = start + 1000;
            return i >= start && i < end;
        })
        const filteredData = data.filter(item => {
            const query = e.target.value.toLowerCase();
            return (
                item.name.toLowerCase().indexOf(query) >= 0 ||
                // item.last_name.toLowerCase().indexOf(query) >= 0 ||
                item.email.toLowerCase().indexOf(query) >= 0
            )
        });
        this.setState({
            allCustomers3: filteredData
        })
        if(e.target.value=== ''){
            this.setState({
                allCustomers3: this.state.customers3
            })
        }
    };

    changeAccessStatus = (item) => {
        confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Change Access Status',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmChangeAccessStatus(item)
                },
                {
                    label: "No"
                }
            ]
        })
    };

    confirmChangeAccessStatus = async (item) => {

        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.USER_ACCESS}/${item}`, await config());
        if(response.status === 200){
            this.setState({spinning: false});
            this.getAllUsers();
            return  NotificationManager.success(
                "User Access Status Changed Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }
    };

    changeStatus  =  (item) => {
        confirmAlert({
            title: 'Confirmation!',
            message: 'Are you sure you want to Change Delete Status?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => this.confirmChangeStatus(item)
                },
                {
                    label: "No"
                }
            ]
        })
    };


    confirmChangeStatus = async (item) => {
        this.setState({spinning: true});
        let response = await ApiCall.get(`${Url.USER_DELETE}/${item}`, await config());
        if(response.status === 200){
            this.setState({spinning: false});
            this.getAllUsers();
            return  NotificationManager.success(
                "User Status Changed Successfully",
                "Success",
                3000,
                null,
                null,
                'filled'
            );
        }
    };

    handleChangeAdminPage=(dataKey)=> {
        // console.log(dataKey)
        this.setState({
            adminPage: dataKey
        });
    };
    handleChangeAdminLength=(dataKey)=> {
        this.setState({
            adminPage: 1,
            adminDisplayLength: dataKey
        });
    };
    getAdminData =() => {
        const { adminDisplayLength, adminPage, allAdmins } = this.state;
        return allAdmins.filter((v, i) => {
            const start = adminDisplayLength * (adminPage - 1);
            const end = start + adminDisplayLength;
            return i >= start && i < end;
        });
    };


    handleChangeStaffMemberPage=(dataKey)=> {
        this.setState({
            staffMemberPage: dataKey
        });
    };
    handleChangeStaffMemberLength=(dataKey)=> {
        this.setState({
            staffMemberPage: 1,
            staffMemberDisplayLength: dataKey
        });
    };
    getStaffData =() => {
        const { staffMemberDisplayLength, staffMemberPage, allStaffMember } = this.state;
        return allStaffMember.filter((v, i) => {
            const start = staffMemberDisplayLength * (staffMemberPage - 1);
            const end = start + staffMemberDisplayLength;
            return i >= start && i < end;
        });
    };

    handleChangeCustomer1Page=(dataKey)=> {
        this.setState({
            customer1Page: dataKey
        });
    };
    handleChangeCustomer1Length=(dataKey)=> {
        this.setState({
            customer1Page: 1,
            customer1DisplayLength: dataKey
        });
    };
    getCustomer1Data =() => {
        const { customer1DisplayLength, customer1Page, allCustomers1 } = this.state;
        return allCustomers1.filter((v, i) => {
            const start = customer1DisplayLength * (customer1Page - 1);
            const end = start + customer1DisplayLength;
            return i >= start && i < end;
        });
    };

    handleChangeCustomer2Page=(dataKey)=> {
        this.setState({
            customer2Page: dataKey
        });
    };
    handleChangeCustomer2Length=(dataKey)=> {
        this.setState({
            customer2Page: 1,
            customer2DisplayLength: dataKey
        });
    };

    getCustomer2Data =() => {
        const { customer2DisplayLength, customer2Page, allCustomers2 } = this.state;
        return allCustomers2.filter((v, i) => {
            const start = customer2DisplayLength * (customer2Page - 1);
            const end = start + customer2DisplayLength;
            return i >= start && i < end;
        });
    };


    handleChangeCustomer3Page=(dataKey)=> {
        this.setState({
            customer3Page: dataKey
        });
    };
    handleChangeCustomer3Length=(dataKey)=> {
        this.setState({
            customer3Page: 1,
            customer3DisplayLength: dataKey
        });
    };

    getCustomer3Data =() => {
        const { customer3DisplayLength, customer3Page, allCustomers3 } = this.state;
        return allCustomers3.filter((v, i) => {
            const start = customer3DisplayLength * (customer3Page - 1);
            const end = start + customer3DisplayLength;
            return i >= start && i < end;
        });
    };

    toggleHistoryModal = (id) => {
        if(id){
            this.setState({selectedUser : id})
        }
        this.setState({isHistoryOpen: !this.state.isHistoryOpen})
    }

    toggleEventsModal = (id) => {
        if(id){
            this.setState({selectedUser : id})
        }
        this.setState({isEventOpen: !this.state.isEventOpen})
    }

    render() {

        const staffData = this.getStaffData();
        const adminsData = this.getAdminData();
        const customers1Data = this.getCustomer1Data();
        const customers2Data = this.getCustomer2Data();
        const customers3Data = this.getCustomer3Data();
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/users/create'><Button size='lg' color={'secondary'}><IntlMessages id={"menu.create"} /></Button></Link>
                        </div>
                        <Breadcrumb heading="user.view" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>

                {/*all admins*/}
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    Admins
                                </CardTitle>
                                <UserView
                                    userType={"NotShow"}
                                    allUsers={this.state.allAdmins}
                                    Data={adminsData}
                                    spinning={this.state.spinning}
                                    page={this.state.adminPage}
                                    displayLength={this.state.adminDisplayLength}
                                    handleChangePage={this.handleChangeAdminPage}
                                    handleFilterChange={this.handleFilterChangeAdmin}
                                    toggleView={this.toggleView}
                                    toggle={this.toggle}
                                    changeStatus={this.changeStatus}
                                    handleChangeLength={this.handleChangeAdminLength}
                                    userPermissions={this.state.userPermissions}
                                    toggleHistoryModal={this.toggleHistoryModal}
                                    toggleEventsModal={this.toggleEventsModal}
                                    changeAccessStatus={this.changeAccessStatus}
                                    preferenceGet={this.preferenceGet}
                                    preferenceSelectedSupport ={this.state.preferenceSelectedSupport}
                                    preferenceSolving={this.state.preferenceSolving}

                                />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                 {/*    all staff members*/}
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    Staff Members
                                </CardTitle>
                                <UserView
                                    userType={"NotShowStaff"}
                                    allUsers={this.state.allStaffMember}
                                    Data={staffData}
                                    spinning={this.state.spinning}
                                    page={this.state.staffMemberPage}
                                    displayLength={this.state.staffMemberDisplayLength}
                                    handleChangePage={this.handleChangeStaffMemberPage}
                                    handleFilterChange={this.handleFilterChangeStaffMember}
                                    toggleView={this.toggleView}
                                    toggle={this.toggle}
                                    changeStatus={this.changeStatus}
                                    handleChangeLength={this.handleChangeStaffMemberLength}
                                    userPermissions={this.state.userPermissions}
                                    toggleHistoryModal={this.toggleHistoryModal}
                                    toggleEventsModal={this.toggleEventsModal}
                                    changeAccessStatus={this.changeAccessStatus}
                                    preferenceGet={this.preferenceGet}
                                    preferenceSelectedSupport ={this.state.preferenceSelectedSupport}
                                    preferenceSolving={this.state.preferenceSolving}
                                />

                            </CardBody>
                        </Card>

                    </Col>
                </Row>

                {/*    all customer 1*/}
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    Customers 1
                                </CardTitle>

                                <UserView
                                    allUsers={this.state.allCustomers1}
                                    Data={customers1Data}
                                    spinning={this.state.spinning}
                                    page={this.state.customer1Page}
                                    displayLength={this.state.customer1DisplayLength}
                                    handleChangePage={this.handleChangeCustomer1Page}
                                    handleFilterChange={this.handleFilterChangeCustomer1}
                                    toggleView={this.toggleView}
                                    toggle={this.toggle}
                                    changeStatus={this.changeStatus}
                                    handleChangeLength={this.handleChangeCustomer1Length}
                                    userPermissions={this.state.userPermissions}
                                    toggleHistoryModal={this.toggleHistoryModal}
                                    changeAccessStatus={this.changeAccessStatus}
                                    preferenceGet={this.preferenceGet}
                                    preferenceSelectedSupport ={this.state.preferenceSelectedSupport}
                                    preferenceSolving={this.state.preferenceSolving}
                                />

                            </CardBody>
                        </Card>

                    </Col>
                </Row>

                {/*/!*    all customer 2*!/*/}
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    Customers 2
                                </CardTitle>
                                <UserView
                                    allUsers={this.state.allCustomers2}
                                    Data={customers2Data}
                                    spinning={this.state.spinning}
                                    page={this.state.customer2Page}
                                    displayLength={this.state.customer2DisplayLength}
                                    handleChangePage={this.handleChangeCustomer2Page}
                                    handleFilterChange={this.handleFilterChangeCustomer2}
                                    toggleView={this.toggleView}
                                    toggle={this.toggle}
                                    changeStatus={this.changeStatus}
                                    handleChangeLength={this.handleChangeCustomer2Length}
                                    userPermissions={this.state.userPermissions}
                                    toggleHistoryModal={this.toggleHistoryModal}
                                    changeAccessStatus={this.changeAccessStatus}
                                    preferenceGet={this.preferenceGet}
                                    preferenceSelectedSupport ={this.state.preferenceSelectedSupport}
                                    preferenceSolving={this.state.preferenceSolving}
                                />

                            </CardBody>
                        </Card>

                    </Col>
                </Row>

                {/*/!*    all customer 3*!/*/}
                <Row>
                    <Col>
                        <Card className="h-100">
                            <CardBody>
                                <CardTitle>
                                    Customers 3
                                </CardTitle>
                                <UserView
                                    allUsers={this.state.allCustomers3}
                                    Data={customers3Data}
                                    spinning={this.state.spinning}
                                    page={this.state.customer3Page}
                                    displayLength={this.state.customer3DisplayLength}
                                    handleChangePage={this.handleChangeCustomer3Page}
                                    handleFilterChange={this.handleFilterChangeCustomer3}
                                    toggleView={this.toggleView}
                                    toggle={this.toggle}
                                    changeStatus={this.changeStatus}
                                    handleChangeLength={this.handleChangeCustomer3Length}
                                    userPermissions={this.state.userPermissions}
                                    toggleHistoryModal={this.toggleHistoryModal}
                                    changeAccessStatus={this.changeAccessStatus}
                                    preferenceGet={this.preferenceGet}
                                    preferenceSelectedSupport ={this.state.preferenceSelectedSupport}
                                    preferenceSolving={this.state.preferenceSolving}
                                />
                            </CardBody>
                        </Card>

                    </Col>
                </Row>
                {this.state.isHistoryOpen &&
                <UserHistory
                    selectedUser ={this.state.selectedUser}
                    isHistoryOpen ={this.state.isHistoryOpen}
                    toggleHistoryModal={this.toggleHistoryModal}
                />
                }
                {this.state.isEventOpen &&
                <EventShown
                    selectedUser ={this.state.selectedUser}
                    isEventOpen ={this.state.isEventOpen}
                    toggleEventsModal={this.toggleEventsModal}
                />
                }
                {this.state.rolesViewModal &&
                <RolesViewModal
                    rolesViewModal={this.state.rolesViewModal}
                    userRoles={this.state.userRoles}
                    toggleView={this.toggleView}
                />
                }

                {this.state.rolesModal &&
                <RolesChangeModal
                    toggle={this.toggle}
                    rolesModal={this.state.rolesModal}
                    selectedUserRoles={this.state.selectedUserRoles}
                    allRoles={this.state.allRoles}
                    rolesUpdating={this.state.rolesUpdating}
                    changeUserRoles={this.changeUserRoles}
                    handleSelectedRoles={this.handleSelectedRoles}
                />
                }

                {this.state.preferenceModal &&
                <PreferenceChangeModal
                    toggle={this.togglePreference}
                    preferenceModal={this.state.preferenceModal}
                    selectedUserPreferences={this.state.selectedUserPreferences}
                    allCategories={this.state.allCategories}
                    preferenceUpdating={this.state.preferenceUpdating}
                    changeUserPreferences={this.changeUserPreferences}
                    handleSelectedRoles={this.handleSelectedPreferences}
                />
                }


            </Fragment>
        )
    }
}
