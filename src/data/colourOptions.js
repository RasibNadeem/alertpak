const customStyles = {
    option: (provided, state) => ({
        ...provided,
        borderBottom: '1px dotted pink',
        color: state.isDisabled ? 'red' : 'blue',
        padding: 20,
    }),
    control: () => ({
        backgroundColor:"blue",
        background_color: "#D8D8D8 !important",
    }),
    singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
    },

}


 export default customStyles;