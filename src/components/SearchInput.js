import React from "react";
import {Input} from "reactstrap";

 const SearchButton = ({handleFilterChange}) => {
    return (
        <div className='container d-flex justify-content-end'
             style={{position: "relative", left: '15px'}}
        >
            <div className='row'>
                <div className='col-12 mb-2'
                >
                    <div className="input-group">
                        <Input
                            name="searchKeyword"
                            id="searchKeyword"
                            placeholder={"Search here"}
                            onChange={e => handleFilterChange(e)}
                            onKeyPress={e => handleFilterChange(e)}
                        />
                        <div className="input-group-append">
                            <button className="btn btn-secondary" type="button">
                                                              <span
                                                                  className="search-icon"
                                                                  onClick={e => handleFilterChange(e)}
                                                              >
                                                                      <i className="simple-icon-magnifier" />
                                                                    </span>

                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default SearchButton;