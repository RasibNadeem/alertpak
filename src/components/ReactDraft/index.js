import {Editor} from "react-draft-wysiwyg";
import React, {Fragment} from "react";
import draftToHtml from "draftjs-to-html";
import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import {FormGroup, Label} from "reactstrap";
import htmlToDraft from 'html-to-draftjs';
import './draft.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

export default class TextEditor extends React.Component {
    constructor(props) {
        super(props);
        const contentBlock = htmlToDraft(props.data? props.data : '');
        this.state = {
            editorState: EditorState.createWithContent(ContentState.createFromBlockArray(contentBlock))
        }
        this.onEditorStateChange = this.onEditorStateChange.bind(this);
    }

    onEditorStateChange = state => {
        this.setState({editorState: state});
        const htmlText = draftToHtml(convertToRaw(state.getCurrentContent()));
        this.props.updateEditorState(htmlText, this.props.fieldName)
    };

    render() {
        return (
            <Fragment>
                <Editor
                    editorState={this.state.editorState}
                    onEditorStateChange={this.onEditorStateChange}
                    name={this.props.fieldName}
                    toolbar={{image: {
                            uploadCallback: this.props.onImageChange,
                            urlEnabled: false,
                            previewImage: false,
                            inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                            alt: { present: true, mandatory: false },
                            defaultSize: {
                                height: 'auto',
                                width: 'auto',
                            },
                        }}}
                    id={this.props.fieldName}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"/>
            </Fragment>
        )
    }
}
