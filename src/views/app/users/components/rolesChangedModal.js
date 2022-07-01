import React from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import Select from "react-select";
import CustomSelectInput from "../../../../components/common/CustomSelectInput";

const RolesChangedModal = ({
                               toggle,
                               rolesModal,
                               selectedUserRoles,
                               allRoles,
                               rolesUpdating,
                               changeUserRoles,
                               handleSelectedRoles
                           }) => {

    return(
        <Modal isOpen={rolesModal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                <IntlMessages id="user.change-roles" />
            </ModalHeader>
            <ModalBody>
                <Select
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    placeholder="Select Roles..."
                    name="userRoles"
                    value={selectedUserRoles}
                    onChange={handleSelectedRoles}
                    options={allRoles}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    <IntlMessages id="role.close-permissions-modal" />
                </Button>
                <Button disabled={rolesUpdating}
                        className={`float-right btn-shadow btn-multiple-state ${rolesUpdating ? "show-spinner" : ""}`}
                        onClick={changeUserRoles}
                        color="primary">
                        <span className="spinner d-inline-block">
                            <span className="bounce1" />
                            <span className="bounce2" />
                            <span className="bounce3" />
                        </span><span className="label">
                                <IntlMessages id="user.update-roles" /></span>
                </Button>
            </ModalFooter>
        </Modal>
    )

}

export default RolesChangedModal;