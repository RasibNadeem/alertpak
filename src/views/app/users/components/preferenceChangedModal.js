import React,{useState} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import IntlMessages from "../../../../helpers/IntlMessages";
import Select from "react-select";
import CustomSelectInput from "../../../../components/common/CustomSelectInput";

const RolesChangedModal = ({
                               toggle,
                               preferenceModal,
                               selectedUserPreferences,
                               allCategories,
                               preferenceUpdating,
                               changeUserPreferences,
                               handleSelectedRoles
                           }) => {

console.log({ toggle,
    preferenceModal,
    selectedUserPreferences,
    allCategories,
    preferenceUpdating,
    changeUserPreferences,
    handleSelectedRoles})
    return(

        <Modal isOpen={preferenceModal} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                Assign Preferences
            </ModalHeader>
            <ModalBody>
                <Select
                    components={{ Input: CustomSelectInput }}
                    className="react-select"
                    classNamePrefix="react-select"
                    placeholder="Select Preference..."
                    isMulti
                    name="userPreference"
                    value={selectedUserPreferences}
                    onChange={handleSelectedRoles}
                    options={allCategories}
                />
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={toggle}>
                    <IntlMessages id="role.close-permissions-modal" />
                </Button>
                <Button disabled={preferenceUpdating}
                        className={`float-right btn-shadow btn-multiple-state ${preferenceUpdating ? "show-spinner" : ""}`}
                        onClick={changeUserPreferences}
                        color="primary"
                >
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