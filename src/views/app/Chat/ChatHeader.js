import React, {Fragment, useEffect} from "react";
import Pusher from 'pusher-js';
const ChatHeader = ({ name,   discussionId, getAllDiscussions, }) => {
    // console.log(name)
    useEffect(()=>{
        var pusher = new Pusher('d84aeb4d828dae52aa65', {
            cluster: 'ap2',
            encrypted: true
        })
        Pusher.logToConsole = false;
        // console.log(Pusher)
        var channel = pusher.subscribe('fetch-messages-' + discussionId);
        channel.bind('Modules\\Division\\Events\\Notification', function (data) {
            // console.log(data)
           if(data.msg === "success"){
               getAllDiscussions()
           }
        });
        // var pusher = new Pusher('d84aeb4d828dae52aa65', {
        //     cluster: 'ap2',
        //     encrypted: true
        // })
        // Pusher.logToConsole = true;
        // // console.log(Pusher)
        // var channel = pusher.subscribe('fetch-missions');
        // channel.bind('Modules\\Mission\\Events', function (data) {
        //     console.log("Pusher : ======>",data)
        // });
    }, [discussionId, getAllDiscussions])

    return (
        <Fragment>
            <div className="d-flex flex-row chat-heading">
                <div className="d-flex">
                    {/*<img*/}
                    {/*    alt={name}*/}
                    {/*    src={thumb}*/}
                    {/*    className="img-thumbnail border-0 rounded-circle ml-0 mr-4 list-thumbnail align-self-center small"*/}
                    {/*/>*/}
                </div>
                <div className=" d-flex min-width-zero">
                    <div className="card-body pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                        <div className="min-width-zero">
                            <div>
                                <p className="list-item-heading mb-1 truncate ">{name}
                                </p>
                            </div>
                            {/*<p className="mb-0 text-muted text-small">*/}
                            {/*    {lastSeenDate === "0" ? "-" : lastSeenDate}*/}
                            {/*</p>*/}
                        </div>
                    </div>
                </div>
            </div>
            <div className="separator mb-5" />
        </Fragment>
    );
};

export default ChatHeader;
