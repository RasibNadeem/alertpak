import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Row } from "reactstrap";

import {
    Colxx,
    // Separator
} from "../../../components/common/CustomBootstrap";

import {
    getContacts,
    getConversations,
    changeConversation,
    addMessageToConversation
} from "../../../redux/actions";
// import ChatApplicationMenu from "../../../containers/applications/ChatApplicationMenu";
// import ChatHeading from "../../../components/applications/ChatHeading";
import MessageCard from "../../../components/applications/MessageCard";
// import SaySomething from "../../../components/applications/SaySomething";
// import allContacts from '../../../data/chat.contacts';
// import conversations from '../../../data/chat.conversations';
import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {config, multipartConfig} from "../../../config/env";
import ChatMenu from "./ChatMenu";
import TypeMessage from "./TypeMessage";
import ChatHeader from "./ChatHeader";
import {NotificationManager} from "../../../components/common/react-notifications";
// import {NotificationManager} from "../../../components/common/react-notifications";
// import Pusher from 'pusher-js';
// import Breadcrumb from "../../../containers/navs/Breadcrumb";
function getBase64(img, callback) {
    if(img){
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

}
class ChatApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuActiveTab: "public",
            messageInput: "",
            discussionMembers: [],
            languages: [],
            signals: [],
            discussionId: '',
            loading: true,
            messageSending: false,
            selectedPrivateCategory: '',
            selectedPublicCategory: '',
            inQueFilePreview: '',
            inQueFile: '',
            groupName: ''
        };


    }

    componentDidMount() {
        const currentUserId = 0;
        this.props.getContacts();
        this.props.getConversations(currentUserId);
        if(this.state.menuActiveTab === "public"){
            this.getPublicSignals(true);
        }else { this.getPrivateSignals(true)}


    }

    getPublicSignals = async (item) => {
        // if(item === undefined && this.state.messageSending === false){
        //     this.playAudio()
        // }
        // console.log(this.props.match.params.slug)
        let response = await ApiCall.get(`${Url.GET_PUBLIC_CHAT}`, await config());
        // return  console.log(response)
        if(response.status === 200){
            localStorage.setItem('signals', JSON.stringify(response.data.signals));
            // localStorage.setItem('discussionMembers', JSON.stringify(response.data.success.members));
            this.setState({
                signals: response.data.signals,
                languages: response.data.languages,
                loading: false,
            })
            if(this.state.messageSending === true){
                this.setState({
                    messageSending: false,
                    messageInput: "",
                    inQueFile: '',
                    inQueFilePreview: ''
                })
            }
        }


    }
    getPrivateSignals = async (item) => {
        let response = await ApiCall.get(`${Url.GET_PRIVATE_CHAT}`, await config());
        // return  console.log(response)
        if(response.status === 200){
            localStorage.setItem('signals', JSON.stringify(response.data.signals));
            this.setState({
                signals: response.data.signals,
                languages: response.data.languages,
                loading: false,
            })
            if(this.state.messageSending === true){
                this.setState({
                    messageSending: false,
                    messageInput: "",
                    inQueFile: '',
                    inQueFilePreview: ''
                })
            }
        }


    }
    componentDidUpdate() {
        if (this._scrollBarRef) {
            this._scrollBarRef._ps.element.scrollTop = this._scrollBarRef._ps.contentHeight;
        }
    }

    handleChatInputPress =async e => {
        if (e.key === "Enter") {
           // return  console.log(this.props.chatApp)
            if (this.state.messageInput.length > 0  || this.state.inQueFile !== '') {

                if(this.state.menuActiveTab === "public" && this.state.selectedPublicCategory === ""){
                    return NotificationManager.error(
                        'Please Select Chat Category',
                        "Error",
                        3000,
                        null,
                        null,
                        'filled'
                    );
                }else if(this.state.menuActiveTab === "private" && this.state.selectedPrivateCategory === ""){
                    return NotificationManager.error(
                        'Please Select Chat Private Category',
                        "Error",
                        3000,
                        null,
                        null,
                        'filled'
                    );
                }else {
                    this.setState({messageSending: true})
                    if(this.state.inQueFile === ''){
                        let response = await ApiCall.post(`${Url.STORE_CHAT}`, {
                            type: 'text',
                            message: this.state.messageInput,
                            status: this.state.menuActiveTab,
                            category_id:
                                this.state.menuActiveTab === "public"?
                                    this.state.selectedPublicCategory : this.state.selectedPrivateCategory
                        }, await config());
                        if(response.status === 200){
                            if(this.state.menuActiveTab === "public"){
                                this.getPublicSignals(true);
                            }else { this.getPrivateSignals(true)}
                            // this.setState({
                            //     menuActiveTab: "messages"});
                        }else {
                            this.setState({messageSending: false})
                        }
                    }else {
                        const data = new FormData();
                        data.append('type','file')
                        data.append('file',this.state.inQueFile)
                        data.append('message',this.state.messageInput)
                        data.append('status',this.state.menuActiveTab)
                        data.append('category_id',this.state.menuActiveTab === "public"?
                            this.state.selectedPublicCategory : this.state.selectedPrivateCategory)
                        let response = await ApiCall.post(`${Url.STORE_CHAT}`, data, await multipartConfig());
                        if(response.status === 200){
                            if(this.state.menuActiveTab === "public"){
                                this.getPublicSignals(true);
                            }else { this.getPrivateSignals(true)}
                            // this.setState({
                            //     menuActiveTab: "messages"});
                        }else {
                            this.setState({messageSending: false})
                        }
                    }

                }




            }
        }
    };

    handleChatInputChange = e => {
        this.setState({
            messageInput: e.target.value
        });
    };

    handleSendButtonClick =async () => {
        if (this.state.messageInput.length > 0 || this.state.inQueFile !== '') {
            if(this.state.menuActiveTab === "public" && this.state.selectedPublicCategory === ""){
                // console.log(this.state.selectedPublicCategory)
                return NotificationManager.error(
                    'Please Select Chat Category',
                    "Error",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else if(this.state.menuActiveTab === "private" && this.state.selectedPrivateCategory === ""){
                return NotificationManager.error(
                    'Please Select Chat Private Category',
                    "Error",
                    3000,
                    null,
                    null,
                    'filled'
                );
            }else {
                this.setState({messageSending: true})
                if(this.state.inQueFile !== '') {
                    const data = new FormData();
                    data.append('type','file')
                    data.append('message',this.state.messageInput)
                    data.append('file',this.state.inQueFile)
                    data.append('status',this.state.menuActiveTab)
                    data.append('category_id',this.state.menuActiveTab === "public"?
                        this.state.selectedPublicCategory : this.state.selectedPrivateCategory);
                    let response = await ApiCall.post(`${Url.STORE_CHAT}`, data, await multipartConfig());
                    if (response.status === 200) {
                        if (this.state.menuActiveTab === "public") {
                            this.getPublicSignals(true);
                        } else {
                            this.getPrivateSignals(true)
                        }
                        // this.setState({
                        //     menuActiveTab: "messages",
                        // });
                    } else {
                        this.setState({messageSending: false})
                    }
                }else {
                    let response = await ApiCall.post(`${Url.STORE_CHAT}`, {
                        type: 'text',
                        message: this.state.messageInput,
                        status: this.state.menuActiveTab,
                        category_id:
                            this.state.menuActiveTab === "public" ?
                                this.state.selectedPublicCategory : this.state.selectedPrivateCategory
                    }, await config());
                    if (response.status === 200) {
                        if (this.state.menuActiveTab === "public") {
                            this.getPublicSignals(true);
                        } else {
                            this.getPrivateSignals(true)
                        }
                        // this.setState({
                        //     menuActiveTab: "messages",
                        // });
                    } else {
                        this.setState({messageSending: false})
                    }
                }
            }






            // console.log(response)

        }
    };

    toggleAppMenu = tab => {
        this.setState({
            menuActiveTab: tab
        });
        if(tab === "public"){
            this.getPublicSignals(true)
        }else {
            this.getPrivateSignals(true)
        }

    };
    // playAudio =() =>{
    //     const audioEl = document.getElementsByClassName("audio-element")[0]
    //     audioEl.play()
    // }
    handleSelectCategoryChange = (e) => {
        // console.log("OK")
        if(e.target.value !== 'null'){
            this.setState({selectedPrivateCategory: e.target.value})
        }else {
            this.setState({selectedPrivateCategory: ''})
        }
    }
    handleSelectPublicCategoryChange = (e) => {
        if(e.target.value !== 'null'){
            this.setState({selectedPublicCategory: e.target.value})
        }else {
            this.setState({selectedPublicCategory: ''})
        }
    };
    handleFile = (event) =>{
        let file = event.target.files[0];
        getBase64(file, imageUrl =>{
            this.setState({
                inQueFilePreview: imageUrl,
                inQueFile: file
            })
        })
        if (file) {
            let data = new FormData();
            data.append('file', file);
        }
    }
    removeFileQued = () => {
        this.setState({
            inQueFilePreview: '',
            inQueFile: ''
        })
    }
    removeMessage = async (id) => {
       let response = await ApiCall.post(Url.DELETE_CHAT_MESSAGE, {id}, await config());
       if(response.status === 200){
           if(this.state.menuActiveTab === "public"){
               this.getPublicSignals(true);
           }else { this.getPrivateSignals(true)}
       }
    }
    render() {


        const { menuActiveTab, messageInput } = this.state;
        const { messages } = this.props.intl;

        return !this.state.loading ? (
            <Fragment>
                {/*<Row>*/}
                {/*    <Colxx xxs="12">*/}
                {/*        <Breadcrumb heading="menu.chat" match={this.props.match} />*/}
                {/*        <Separator className="mb-5" />*/}
                {/*    </Colxx>*/}
                {/*</Row>*/}
                <div>
                    <audio className="audio-element">
                        <source src="/assets/message.mp3"/>
                    </audio>
                </div>
                <Row className="app-row">
                    <Colxx xxs="12" className="chat-app">

                            <ChatHeader
                                messageSending={this.state.messageSending}
                                name={this.state.groupName}
                                discussionId={this.state.discussionId}
                                getAllDiscussions={this.state.menuActiveTab === "public"?
                                    ()=> this.getPublicSignals(true) :
                                    ()=>  this.getPrivateSignals(true)}
                                // thumb={'selectedUser.thumb'}
                            />



                            <PerfectScrollbar
                                ref={ref => {
                                    this._scrollBarRef = ref;
                                }}
                                containerRef={ref => {}}
                                options={{ suppressScrollX: true, wheelPropagation: false }}>
                                {this.state.signals.map((item, index) => {
                                    let currentUser = JSON.parse(localStorage.currentUser)
                                    return (
                                        <MessageCard
                                            key={index}
                                            getSignals={this.state.menuActiveTab === 'public'?
                                                this.getPublicSignals: this.getPrivateSignals}

                                            languages={this.state.languages}
                                            removeMessage={this.removeMessage}
                                            sender={currentUser}
                                            item={item}
                                        />
                                    );
                                })}
                            </PerfectScrollbar>

                    </Colxx>
                </Row>
                <TypeMessage
                    placeholder={messages["chat.saysomething"]}
                    messageInput={messageInput}
                    removeFileQued={this.removeFileQued}
                    handleFile={this.handleFile}
                    inQueFilePreview={this.state.inQueFilePreview}
                    messageSending={this.state.messageSending}
                    handleChatInputPress={this.handleChatInputPress}
                    handleChatInputChange={this.handleChatInputChange}
                    handleSendButtonClick={this.handleSendButtonClick}
                />
                <ChatMenu
                    discussionMembers={this.state.discussionMembers}
                    activeTab={menuActiveTab}
                    handleSelectCategoryChange={this.handleSelectCategoryChange}
                    selectedPrivateCategory={this.state.selectedPrivateCategory}
                    selectedPublicCategory={this.state.selectedPublicCategory}
                    toggleAppMenu={this.toggleAppMenu}
                    handleSelectPublicCategoryChange={this.handleSelectPublicCategoryChange}
                />
            </Fragment>
        ) : (
            <div className="loading" />
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
            getContacts,
            getConversations,
            changeConversation,
            addMessageToConversation
        }
    )(ChatApp)
);
