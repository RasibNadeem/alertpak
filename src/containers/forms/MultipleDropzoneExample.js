import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import "dropzone/dist/min/dropzone.min.css";
import {NotificationManager} from "../../components/common/react-notifications";
// import {base} from "../../config/env";
var ReactDOMServer = require('react-dom/server');


export default class MultiDropZone extends Component {
    constructor(props) {
        super(props);
        this.componentConfig = { postUrl: 'no-url',  };
        this.djsConfig = { autoProcessQueue: false, maxFiles: 5, maxFilesize: 20, uploadMultiple: true, parallelUploads: 10,
            acceptedFiles: props.fileTypes !== undefined? props.fileTypes :"image/*,application/pdf,.psd",
            accept: function(file, done) {
                done();
            },
            init: function() {
                this.on("error", function(file, message) {
                    NotificationManager.error(
                        message,
                        "Error",
                        3000,
                        null,
                        null,
                        'filled'
                    );
                    this.removeFile(file);
                });
            },
            iconFiletypes: ['.jpg', '.png', '.gif'],
            previewTemplate: ReactDOMServer.renderToStaticMarkup(
                <div className="dz-preview dz-file-preview mb-3">
                    <div className="d-flex flex-row ">
                        <div className="p-0 w-30 position-relative">
                            <div className="dz-error-mark">
            <span>
              <i />{" "}
            </span>
                            </div>
                            <div className="dz-success-mark">
            <span>
              <i />
            </span>
                            </div>
                            <div className="preview-container">
                                {/*  eslint-disable-next-line jsx-a11y/alt-text */}
                                <img data-dz-thumbnail="" className="img-thumbnail border-0" />
                                <i className="simple-icon-doc preview-icon" />
                            </div>
                        </div>
                        <div className="pl-3 pt-2 pr-2 pb-1 w-70 dz-details position-relative">
                            <div>
                                {" "}
                                <span data-dz-name=""/>{" "}
                            </div>
                            <div className="text-primary text-extra-small" data-dz-size=""/>
                            <div className="dz-progress">
                                <span className="dz-upload" data-dz-uploadprogress=""/>
                            </div>
                            <div className="dz-error-message">
                                <span data-dz-errormessage=""/>
                            </div>
                        </div>
                    </div>
                    <a href="#/" className="remove" data-dz-remove="">
                        {" "}
                        <i className="glyph-icon simple-icon-trash" />{" "}
                    </a>
                </div>
            ),
            headers: { "My-Awesome-Header": "header value" }};
    }
    imageUrl =(dz)=> {
        if(this.props.urls !== undefined ){
            let mocks = this.props.urls;
            // console.log(mocks)
            for (var i = 0; i < mocks.length; i++) {
                var mock = mocks[i];
                mock.accepted = true;
                mock.name=  "image.jpg";
                mock.size = 12345;
                // console.log(mock)
                dz.files.push(mock);
                dz.options.addedfile.call(dz, mock);
                dz.options.thumbnail.call(dz, mock, mock.url);
                // dz.emit('addedfile', mock);
                // dz.createThumbnailFromUrl(mock, mock.url);
                // dz.emit('complete', mock);
            }
        }
    }
    render() {
        const eventHandlers = { addedfile: (file) => this.props.onChange(file),
            init: dz => this.imageUrl(dz),
            removedfile: file => this.props.removeFile !== undefined && this.props.removeFile(file)
        }
        const componentConfig = this.componentConfig;
        const djsConfig = this.djsConfig;
        return (
            <DropzoneComponent
                config={componentConfig}
                eventHandlers={eventHandlers}
                djsConfig={djsConfig}
            />
        );
    }
}