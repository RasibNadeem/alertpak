import React, { Component } from "react";
import DropzoneComponent from "react-dropzone-component";
import "dropzone/dist/min/dropzone.min.css";
import {NotificationManager} from "../../components/common/react-notifications";
// import {ImageDrop} from "./ImageDrop";
var ReactDOMServer = require('react-dom/server');

class DropzoneExample extends Component {
  constructor(props) {
    super(props);
    this.componentConfig = { postUrl: 'no-url',  };
    this.djsConfig = { autoProcessQueue: false, maxFiles: 1, maxFilesize: .9, uploadMultiple: false, parallelUploads: 1,
      acceptedFiles: props.fileTypes !== undefined? props.fileTypes :"image/*,application/pdf,.psd",
      accept: function(file, done) {
        done();
      },
      init: function() {
        this.on("addedfile", function() {
          if (this.files[1]!=null){
            this.removeFile(this.files[0]);
          }
        })
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
          })
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
    if(this.props.url !== undefined && this.props.url !== null && this.props.url !== ''){
        // console.log(this.props.url)
      let url = this.props.url
      var mockFile = { name: "image.jpg", size: 12345 };
      dz.options.addedfile.call(dz, mockFile);
      dz.options.thumbnail.call(dz, mockFile, url);
    }
  }
  render() {
    const eventHandlers = { addedfile: (file) => this.props.onChange(file), init: dz => this.imageUrl(dz),
        removedfile: file => this.props.removeFile !== undefined && this.props.removeFile(true)
    }
    const componentConfig = this.componentConfig;
    const djsConfig = this.djsConfig;
    // console.log(this.props)

    return (
        <DropzoneComponent
            config={componentConfig}
            eventHandlers={eventHandlers}
            djsConfig={djsConfig}
        />
    );
  }
}
export default DropzoneExample;
