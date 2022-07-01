import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Nav, TabContent, TabPane, CardHeader, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
// import PerfectScrollbar from "react-perfect-scrollbar";
import classnames from "classnames";

// import IntlMessages from "../../../helpers/IntlMessages";
import ApplicationMenu from "../../../components/common/ApplicationMenu";

import {
    changeConversation,
    createConversation,
    searchContact
} from "../../../redux/actions";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import {config} from "../../../config/env";

class ChatApplicationMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchKey: "",
            categories: [],
            selectedPrivateCategory: ''
        };
    }
    componentDidMount() {
        this._isUnmounted = false
        this.getAllCategories()
    }
componentWillUnmount() {
    this._isUnmounted = true
}

    toggleAppMenu = tab => {
        if (this.props.activeTab !== tab) {
            this.props.toggleAppMenu(tab)
        }
        if (tab === "messages") {
            this.handleSearchContact("");
        }
    };

    handleSearchContact = keyword => {
        this.setState({
            searchKey: keyword
        });
        if (keyword.length > 0) {
            if (this.props.activeTab !== "contacts") {
                this.props.toggleAppMenu("contacts")

            }
            this.props.searchContact(keyword);
        } else {
            this.props.searchContact("");
        }
    };

    handleConversationClick = (e, selectedUserId) => {
        this.props.changeConversation(selectedUserId);
        this.handleSearchContact("");
    }

    handleContactClick = (userId) => {
        if (this.props.activeTab !== "messages") {
            this.props.toggleAppMenu("messages")
            this.props.searchContact("");
        }

        const { conversations, currentUser } = this.props.chatApp;
        const conversation = conversations.find(
            x => x.users.includes(currentUser.id) && x.users.includes(userId)
        );
        if (conversation) {
            this.props.changeConversation(userId);
        } else {
            this.props.createConversation(currentUser.id, userId, conversations);
            this.props.changeConversation(userId);
        }
    }

    getAllCategories = async ()=> {
        if(!this._isUnmounted){
            let response = await ApiCall.get(Url.ALL_CATEGORIES, await config())
            // console.log(response)
            if(response.status=== 200){
                this.setState({categories: response.data.categories.reverse()});
            }
        }

    };
    render() {
const {categories} = this.state;

        return (
            <ApplicationMenu>
                <CardHeader className="pl-0 pr-0">
                    <Nav tabs className="card-header-tabs ml-0 mr-0">
                        <NavItem className="w-50 text-center">
                            <NavLink
                                className={this.props.activeTab === "public"? classnames({
                                    active: this.props.activeTab === "public",
                                    "nav-link": true,
                                    "ml-3": true
                                }) : classnames({
                                    "ml-3": true,
                                    "mylinku": true,
                                    active: this.props.activeTab === "public",
                                })

                                }
                                onClick={() => {
                                    this.toggleAppMenu("public");
                                }} to="#" >
                                Public
                            </NavLink>
                        </NavItem>
                        <NavItem className="w-50 text-center">
                            <NavLink
                                className={this.props.activeTab === "private"? classnames({
                                    active: this.props.activeTab === "3",
                                    "nav-link": true,
                                    "ml-3": true
                                }) : classnames({
                                    active: this.props.activeTab === "private",
                                    "ml-3": true,
                                    "mylinku": true,
                                })

                                }
                                onClick={() => {
                                    this.toggleAppMenu("private");
                                }} to="#" >
                                Private
                            </NavLink>
                        </NavItem>
                    </Nav>
                </CardHeader>

                <TabContent
                    activeTab={this.props.activeTab}
                    className="chat-app-tab-content"
                >
                    <TabPane tabId="public" className="chat-app-tab-pane">
                        {/*<PerfectScrollbar*/}
                        {/*    options={{ suppressScrollX: true, wheelPropagation: false }}*/}
                        {/*>*/}
                        <h3 className={'mt-50 text-center'} style={{marginTop: '75px'}}>Your Chat Status Is Public</h3>
                        {/*</PerfectScrollbar>*/}
                        <div style={{padding: '20px', marginTop: '75px'}}>
                            <h3 className={'mt-50 text-center'}>Chat Category</h3>
                            <select
                                name="select"
                                className="form-control"
                                value={this.props.selectedPublicCategory}
                                onChange={this.props.handleSelectPublicCategoryChange}
                            >
                                <option value='null'>Select an option..</option>
                                {categories.filter(item => item.type === 'chat').map(item => {
                                    return(
                                        <option value={item.id} key={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </TabPane>
                    <TabPane tabId="private" className="chat-app-tab-pane">
                        {/*<PerfectScrollbar*/}
                        {/*    options={{ suppressScrollX: true, wheelPropagation: false }}*/}
                        {/*>*/}
                        <h3 className={'mt-50 text-center'} style={{marginTop: '75px'}}>Your Chat Status Is Private</h3>
                        {/*</PerfectScrollbar>*/}
                        <div style={{padding: '20px', marginTop: '75px'}}>
                            <h3 className={'mt-50 text-center'}>Chat Category</h3>
                            <select
                                name="select"
                                className="form-control"
                                value={this.props.selectedPrivateCategory}
                                onChange={this.props.handleSelectCategoryChange}
                            >
                                <option value='null'>Select an option..</option>
                                {categories.filter(item => item.type === 'chat').map(item => {
                                    return(
                                        <option value={item.id} key={item.id}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>

                    </TabPane>

                </TabContent>

            </ApplicationMenu>

        );
    }
}

const mapStateToProps = ({ chatApp }) => {
    return { chatApp };
};
export default injectIntl(
    connect(
        mapStateToProps,
        {
            changeConversation,
            createConversation,
            searchContact
        }
    )(ChatApplicationMenu)
);
