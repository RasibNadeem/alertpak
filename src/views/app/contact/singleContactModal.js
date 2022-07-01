import React, {
    useEffect, useState,
} from "react";
import {
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody, ModalFooter,

} from "reactstrap";

import ApiCall from '../../../config/network';
import Url from '../../../config/api';
import {config} from "../../../config/env";
import Spinner from "reactstrap/es/Spinner";
export default function SingleContactModal(props) {
    const [state, setState] = useState({contact: '', isLoaded: false});
    useEffect(() => {
        const getSingleContactView = async () => {
            if(props.contactId){
                setState(prevState => ({
                    ...prevState,
                    isLoaded: false,
                }))
                let response = await ApiCall.get(`${Url.CONTACT_US_SINGLE_VIEW}/${props.contactId}`, await config());
                if(response.status === 200){
                    setState(prevState => ({
                        ...prevState,
                        contact: response.data.success,
                        isLoaded: true
                    }))
                }
            }

        }
            getSingleContactView()
    }, [props.contactId])


    return (

            <Modal isOpen={props.contactDetailsModal} toggle={props.toggle} size="lg">
                <ModalHeader toggle={props.toggle}>
                    Contact Us View
                </ModalHeader>
                <ModalBody>
                    {state.isLoaded?
                        <div className={'react-modal-custom-overflow'}>

                        <p className="text-muted text-secondary font-weight-semibold mb-2">
                            Message
                        </p>
                        <p className="mb-3">
                            {state.contact.message}
                        </p>
                            <Row>
                                <Col xs='4'>
                                    <p className="text-muted text-small mb-2">Name</p>
                                    <p className="mb-3">{state.contact.name}</p>
                                </Col>
                                <Col xs='8'>
                                    <p className="text-muted text-small mb-2">Email</p>
                                    <p className="mb-3">{state.contact.email}</p>
                                </Col>
                                <Col xs='6'>
                                    <p className="text-muted text-small mb-2">Sent At</p>
                                    <p className="mb-3">{state.contact.createdAt}</p>
                                </Col>
                            </Row>
                    </div>
                        :
                        <div className="d-flex flex-row mb-3 pb-3 border-bottom"  style={{justifyContent: 'center', padding: '50px'}}>
                            <h3 className="text-center mt-3 mb-3">
                                <Spinner/>
                                <br/>
                                Loading
                            </h3>
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={props.toggle}>
                        Close
                    </Button>
                </ModalFooter>
            </Modal>




    )
}