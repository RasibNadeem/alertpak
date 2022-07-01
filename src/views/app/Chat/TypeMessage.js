import React, { Component } from "react";
import { Input, Button, Spinner } from "reactstrap";
// import IntlMessages from "../../../helpers/IntlMessages";

class TypeMessage extends Component {

        render() {
        const {
            placeholder,
            messageInput,
            handleChatInputPress,
            handleChatInputChange,
            handleSendButtonClick,
            messageSending
        } = this.props;
        if(messageSending === false){

        }
        return (
            <div className="chat-input-container d-flex justify-content-between align-items-center">
                {messageSending?
                    <span className='mr-1'>
                                    <Spinner size="sm" color="primary" />
                </span>
                    : null}
                <Input
                    style={{backgroundColor: 'white'}}
                    readOnly={messageSending}
                    className="form-control flex-grow-1"
                    type="text"
                    autoFocus={messageSending}
                    placeholder={placeholder}
                    value={messageInput}
                    onKeyPress={e => handleChatInputPress(e)}
                    onChange={e => handleChatInputChange(e)}
                />
                <div>
                    {/*{this.props.inQueFilePreview !== "" &&*/}
                    {/*<span style={{marginRight: '20px'}} className={'signal-image'}>*/}
                    {/*    <img src={this.props.inQueFilePreview} alt={'signle'}  style={{maxHeight: '50px'}}/>*/}
                    {/*    <button onClick={this.props.removeFileQued} className='text-small font-weight-bold btn btn-danger btn-sm' style={{marginLeft: '2px'}}>X</button>*/}
                    {/*</span>*/}
                    {/*}*/}

                    <div className="upload-btn-wrapper">
                    {/*<Button outline color="primary" className="icon-button large ml-1">*/}
                    {/*    <i className="simple-icon-paper-clip" />*/}
                    {/*</Button>*/}
                        {this.props.inQueFilePreview !== ""? <span style={{marginRight: '20px', position: 'relative', bottom: '1px'}}>
                        <img src={this.props.inQueFilePreview} alt={'signle'}  style={{maxHeight: '30px'}}/>
                        <button onClick={this.props.removeFileQued} className='text-small font-weight-bold btn btn-danger btn-sm' style={{marginLeft: '2px'}}>X</button>
                    </span> :
                        <label className="custom-file-upload">
                        <input type="file" accept="image/*" name="myfile" onChange={this.props.handleFile} />
                            <i className="simple-icon-paper-clip" /> Upload
                        </label>}
                    </div>
                    <Button
                        color="primary"
                        className={`icon-button large ml-1 btn-multiple-state ${messageSending? "show-spinner" : ""}`}
                        onClick={() => handleSendButtonClick()}
                    >
                                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label"><i className="simple-icon-arrow-right" /></span>
                    </Button>

                </div>
            </div>
        );
    }
}
export default TypeMessage;
