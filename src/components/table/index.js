import React, { useState, useEffect } from "react";
import { Table } from "rsuite";
import "./table.css";
import SearchButton from "./SearchInput";
import TablePagination from "./TablePagination";

const ReactTable = (props) => {
  const {
    activePage,
    displayLength = 100,
    total,
    onChangePage,
    onChangeLength,
    data,
    loading,
    handleFilterChange,
    children,
  } = props;

  return (
    <>
      <SearchButton handleFilterChange={handleFilterChange} />

      <Table
        autoHeight={true}
        data={data}
        bordered
        cellBordered
        virtualized={false}
        hover={true}
        loading={loading}
      >
        {children}
      </Table>
      <div className="mt-4 m-2">
        <TablePagination
          handleChangeLength={onChangeLength}
          pageSizeOptions={[]}
          onChangePage={onChangePage}
          showPageSizeOptions={false}
          pageSize={displayLength}
          canPrevious={true}
          currentPage={activePage}
          totalPage={Math.floor(total / displayLength)}
          pages={Math.ceil(total / displayLength)}
          canNext={true}
        />
      </div>
    </>
  );
};

export default ReactTable;
