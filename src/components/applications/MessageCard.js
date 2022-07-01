import React, {Fragment, useState} from "react";
import { Card, CardBody } from "reactstrap";
// import {Button} from "reactstrap";
import ChatTranslationModal from "../../views/app/Chat/ChatTranslationModal";
// import {Link} from "react-router-dom";

const MessageCard = ({ sender, item, removeMessage, languages, getSignals}) => {
  const [state, setState] = useState({translations: '', translationModal: false, chatId: null})
 const toggle = (item) => {
   setState(prevState => ({
     ...prevState,
     translationModal: !prevState.translationModal
   }))
   if(item.id){
     setState(prevState => ({
       ...prevState,
       translations: item.translations,
       chatId: item.id
     }))
   }
   if(item === 'close'){
     setState(prevState => ({
       ...prevState,
       translationModal: false
     }))
   }
   if(item === 'show'){
     setState(prevState => ({
       ...prevState,
       translationModal: true
     }))
   }
  }
  return (
    <Fragment>
      <Card
        className={`d-inline-block mb-3 float-right chat-card-width`}
        // style={{width: '460px'}}
        // className={`d-inline-block mb-3 float-${
        //   item.sender !== currentUserid ? "left" : "right"
        // }`}
      >
        <div className="position-absolute  pt-1 pr-2 r-0">
          <span className="text-extra-small text-muted">{item.createdAt}</span>
        </div>
        <CardBody>
          <div className="d-flex flex-row pb-1">
            <img
              alt={sender.name}
              src={'/assets/img/data-trades-logo.png'}
              className="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
            />
            <div className=" d-flex flex-grow-1 min-width-zero">
              <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                <div className="min-width-zero">
                  <p className="mb-0 truncate list-item-heading">
                    {/*{console.log(item)}*/}
                    {item.category !== null && item.category.name}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-text-left">
            <p className="mb-0 text-semi-muted">{item.message}</p>
          </div>
          {item.attachment !== null && <div className="chat-text-left">
           <img src={item.attachment.path} alt={'message'} style={{height: '80px'}}/>
          </div>}

          <div className="position-relative  pt-1 pr-2 mb-2 r-0" style={{float: 'right'}}>
            {/*<a className="text-extra-small" style={{color: '#138496', cursor: 'pointer'}} onClick={()=>toggle(item)}>*/}
            {/*  Translations*/}
            {/*</a>*/}
            {" "}{"|"}{" "}
            {item.translations.length> 0 && <React.Fragment>
              {/*{item.translations.map(item => {*/}
              {/*  if(item.language.name === 'French'){*/}
              {/*    return <img key={item.language.id} src={'/assets/img/french-flag.png'} alt='french' style={{height: '10px'}}/>*/}
              {/*  }*/}
              {/*})}{" "}{" "}*/}
              {/*{item.translations.map(item => {*/}
              {/*  if(item.language.name === 'Dutch'){*/}
              {/*    return <img key={item.language.id} src={'/assets/img/dutch-flag.jpg'} alt='dutch' style={{height: '10px'}}/>*/}
              {/*  }*/}
              {/*})}{" "} {" "}{"|"}*/}

            </React.Fragment>}
            {/*<a className="text-extra-small" onClick={()=> removeMessage(item.id)} style={{cursor: 'pointer', color: 'red'}}>Remove</a>*/}
          </div>
        </CardBody>
        {state.translationModal &&
        <ChatTranslationModal
            showModal={state.translationModal}
            toggle={toggle}
            getSignals={getSignals}
            languages={languages}
            chatId={state.chatId}
            translations={state.translations}
        />}
      </Card>
      <div className="clearfix" />
    </Fragment>
  );
};

export default MessageCard;
