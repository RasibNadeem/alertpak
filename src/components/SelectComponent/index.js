import React from 'react';
import Select from "react-select";
import CustomSelectInput from "../common/CustomSelectInput";
import './style.scss';

const SelectComponent = ({
                             value,
                             isDisabled,
                             isLoading,
                             isMulti,
                             placeHolder,
                             onChange,
                             options
                         }) => {
    return (
        <Select
        value={value}
        className={isDisabled? "css-1fhf3k1-control" : "css-yk16xz-control"}
        classNamePrefix="react-select"
        isLoading={isLoading}
        isClearable={false}
        isDisabled={isDisabled}
        components={{Input: CustomSelectInput}}
        isMulti={isMulti}
        placeHoleder={placeHolder}
        name="form-field-name"
        onChange={onChange}
        options={options}
        />
    )
};

export default SelectComponent;