import React, {Fragment} from "react";
import {Button, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Colxx} from "../../../components/common/CustomBootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import 'react-quill/dist/quill.bubble.css';

const quillModules = {
    toolbar: [
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
            {list: "ordered"},
            {list: "bullet"},
            {indent: "-1"},
            {indent: "+1"}
        ],
        ["link", "image"],
        ["clean"]
    ]
};
const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image"
];
const TranslationsModal = ({showModal, toggle, languages, handleSelectLanguage, selectedLanguage,
                               handleChangeTranslationContent, translationContent, loadingApi,
                               storeTranslation, updateTranslation, modalMethod, handleInputChange,
                               handleGuidesInputChange, question, answer, title, paragraph,
                               handleChangeParagraph, handleCategoryInputChange, categoryName,
                               handleResultInputChange, heading, subTitle, total, addResultList, handleChangeChatMessage, message
                           }) => {
    return (
        <Modal isOpen={showModal} toggle={toggle} size='lg'>
            <ModalHeader toggle={toggle}>
                {modalMethod === 'store' ? "Store Translation" : 'Update Translation'}
            </ModalHeader>
            <ModalBody>
                <div className="react-modal-custom-overflow p-2">
                <FormGroup row>
                    <Colxx sm="12">
                        <label>Language</label>
                        <select
                            name="select"
                            className="form-control"
                            value={selectedLanguage}
                            onChange={handleSelectLanguage}
                            placeholder='Please Select Language..'
                        >
                            <option value={null}>Please Select Language</option>
                            {languages.map(item => (
                                <option key={item.id} value={item.id}>{item.name}</option>
                            ))}

                        </select>
                    </Colxx>
                </FormGroup>
                {handleChangeTranslationContent &&
                <FormGroup row>
                    <Colxx sm="12">
                        <label>Content</label>
                        <ReactQuill
                            theme="snow"
                            value={translationContent}
                            onChange={handleChangeTranslationContent}
                            modules={quillModules}
                            formats={quillFormats}/>
                    </Colxx>
                </FormGroup>}
                {handleInputChange && <div>
                    <FormGroup row>
                        <Colxx sm="12">
                            <label>Question</label>
                            <Input type="text" value={question} onChange={handleInputChange} name="question"
                                   placeholder={'Question *'} required/>
                        </Colxx>
                    </FormGroup>
                    <FormGroup row>
                        <Colxx sm="12">
                            <label>Answer</label>
                            <Input type="textarea" rows='5' value={answer} onChange={handleInputChange} name="answer"
                                   placeholder={'Answer *'} required/>
                        </Colxx>
                    </FormGroup>
                </div>}
                {handleGuidesInputChange &&
                <Fragment>
                    <FormGroup row>
                        <Colxx sm="12">
                            <label>Title</label>
                            <Input type="text" value={title} onChange={handleGuidesInputChange} name="title"
                                   placeholder={'Title *'} required/>
                        </Colxx>
                    </FormGroup>
                    <FormGroup row>
                        <Colxx sm="12">
                            <label>Paragraph</label>
                            <ReactQuill
                                theme="snow"
                                value={paragraph}
                                onChange={handleChangeParagraph}
                                modules={quillModules}
                                formats={quillFormats}/>
                        </Colxx>
                    </FormGroup>
                </Fragment>}
                {handleCategoryInputChange &&

                    <FormGroup row>
                        <Colxx sm="12">
                            <label>Name</label>
                            <Input type="text"
                                   value={categoryName}
                                   onChange={handleCategoryInputChange}
                                   name="categoryName"
                                   placeholder={'Name *'}
                                   required
                            />
                        </Colxx>
                    </FormGroup>}
                    {handleResultInputChange &&
                        <Fragment>

                                <FormGroup row>
                                    <Colxx sm="12">
                                        <label> Heading </label>
                                        <Input type="text"
                                               value={heading}
                                               onChange={handleResultInputChange}
                                               name="heading"
                                               placeholder={'Heading *'}
                                               required
                                        />
                                    </Colxx>
                                </FormGroup>
                                <FormGroup row>
                                    <Colxx sm="12">
                                        <label> Subtitle </label>
                                        <Input type="text"
                                               value={subTitle}
                                               onChange={handleResultInputChange}
                                               name="subTitle"
                                               placeholder={'Subtitle *'}
                                               required
                                        />
                                    </Colxx>
                                </FormGroup>
                            <FormGroup row>
                                <Colxx sm="12">
                                    <label> Total </label>
                                    <Input type="text"
                                           value={total}
                                           onChange={handleResultInputChange}
                                           name="total"
                                           placeholder={'Total *'}
                                           required
                                    />
                                </Colxx>
                            </FormGroup>
                                <FormGroup row>
                                    <Colxx sm="12">
                                        <label> Rows </label>
                                        {addResultList()}
                                    </Colxx>
                                </FormGroup>
                        </Fragment>
                  }
                {handleChangeChatMessage &&
                <FormGroup row>
                    <Colxx sm="12">
                        <label>Message</label>
                        <Input type="textarea" rows='5' value={message} onChange={handleChangeChatMessage} name="message"
                               placeholder={'Message *'} required/>
                    </Colxx>
                </FormGroup>}
                </div>
            </ModalBody>
            <ModalFooter>
                {modalMethod === 'store' ?
                    <Button disabled={loadingApi}
                            className={`float-right btn-shadow btn-multiple-state ${loadingApi ? "show-spinner" : ""}`}
                            onClick={storeTranslation}
                            color="primary"
                    >
                                        <span className="spinner d-inline-block">
                                            <span className="bounce1"/>
                                            <span className="bounce2"/>
                                            <span className="bounce3"/>
                                        </span><span className="label">
                                               Store
                </span>
                    </Button> :
                    <Button disabled={loadingApi}
                            className={`float-right btn-shadow btn-multiple-state ${loadingApi ? "show-spinner" : ""}`}
                            onClick={updateTranslation}
                            color="primary"
                    >
                                        <span className="spinner d-inline-block">
                                            <span className="bounce1"/>
                                            <span className="bounce2"/>
                                            <span className="bounce3"/>
                                        </span><span className="label">
                                               Update
                </span>
                    </Button>}
            </ModalFooter>
        </Modal>
    )
}
export default TranslationsModal;