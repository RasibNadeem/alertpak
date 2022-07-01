import React, {Component} from "react";
import {UploaderComponent} from '@syncfusion/ej2-react-inputs';
import {isNullOrUndefined} from '@syncfusion/ej2-base';
export default class VideoUploader extends Component {
    constructor(props) {
        super(props);
        this.value = 0;
        this.ddlDatas = [
            {value: 500000, size: '500 KB'},
            {value: 1000000, size: '1 MB'},
            {value: 2000000, size: '2 MB'}
        ];
        this.fields = {text: 'size', value: 'value'};
        this.isInteraction = false;
        this.asyncSettings = {
            saveUrl: props.uploadUrl,
            // removeUrl: 'https://ej2.syncfusion.com/services/api/uploadbox/Remove',
            chunkSize: props.chunkSize? props.chunkSize : 20000000
        };
        this.autoUpload = false;
    }
    onChange = (args) => {
        this.uploadObj.asyncSettings.chunkSize = parseInt(args.itemData.value, 10);
    }
    onRemoveFile = (args) => {
        args.postRawFile = false;
    }
    // to update flag variable value for automatic pause and resume
    onPausing = (args) => {
        this.isInteraction = args.event !== null && !navigator.onLine;
    }
    // to update flag variable value for automatic pause and resume
    onResuming = (args) => {
        this.isInteraction = args.event !== null && !navigator.onLine;
    }
    // to prevent triggering chunk-upload failure event and to pause uploading on network failure
    onBeforeFailure = (args) => {
        let proxy = this;
        args.cancel = !this.isInteraction;
        // interval to check network availability on every 500 milliseconds
        let clearTimeInterval = setInterval(function () {
            if (navigator.onLine && !isNullOrUndefined(proxy.uploadObj.filesData[0]) && proxy.uploadObj.filesData[0].statusCode === 4) {
                proxy.uploadObj.resume(proxy.uploadObj.filesData);
                clearSetInterval();
            } else {
                if (!proxy.isInteraction && !isNullOrUndefined(proxy.uploadObj.filesData[0]) && proxy.uploadObj.filesData[0].statusCode === 3) {
                    proxy.uploadObj.pause(proxy.uploadObj.filesData);
                }
            }
        }, 500);
        // clear Interval after when network is available.
        const clearSetInterval = () => {
            clearInterval(clearTimeInterval);
        }
    };
    render() {
        return (
            <UploaderComponent
                minFileSize = {10000}
                maxFileSize= {30000000}
                id='file'
                type='file'
                multiple={this.props.isMulti}
                ref={(scope) => {this.uploadObj = scope;}}
                asyncSettings={this.asyncSettings}
                // actionComplete={this.props.onUploadComplete}
                autoUpload={this.autoUpload}
                allowedExtensions="video/*"
                removing={this.onRemoveFile}
                pausing={this.onPausing}
                // template={this.template}
                resuming={this.onResuming}
                chunkFailure={this.onBeforeFailure}
            />
        )
    }
}