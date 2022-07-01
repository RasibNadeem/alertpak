import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";

const RolesViewModal = ({
                            rolesViewModal,
                            userRoles,
                            toggleView
                        }) => {
    // alert("HI")
return (
    <Modal isOpen={rolesViewModal} toggle={toggleView}>
        <ModalHeader toggle={toggleView}>
            <IntlMessages id="user.roles" />
        </ModalHeader>
        <ModalBody>
            {userRoles.length>0?
                userRoles.map((item, index)=> {
                    return (
                        <ul key={index}>
                            <li>{item.name}</li>
                        </ul>
                    )
                })
                : <h3>This User Have No Role, Please Assign a Role</h3>}

        </ModalBody>
        <ModalFooter>
            <Button color="secondary" onClick={toggleView}>
                <IntlMessages id="role.close-permissions-modal" />
            </Button>
        </ModalFooter>
    </Modal>
)
};

export default RolesViewModal;