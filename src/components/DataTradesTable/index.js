import React, { Fragment} from 'react';
import {Table} from "rsuite";
import '../../views/app/table.css';

const {Pagination} = Table;
const DataTradesTable = ({
                             activePage,
                             displayLength,
                             total,
                             onChangePage,
                             onChangeLength,
                             data,
                             loading,
                             children
                         }) => {
    return (
        <Fragment>
            <Table autoHeight={true}
                   data={data}
                   bordered
                   cellBordered
                   virtualized={false}
                   hover={true}
                   loading={loading}
                   shouldUpdateScroll>
                {children}
            </Table>
            {onChangePage && <Pagination
                lengthMenu={[
                    {
                        value: 25,
                        label: 25
                    },
                    {
                        value: 35,
                        label: 35
                    }
                ]}
                activePage={activePage}
                displayLength={displayLength}
                total={total}
                onChangePage={onChangePage}
                onChangeLength={onChangeLength}
            />}

        </Fragment>
    )
}
export default DataTradesTable;
