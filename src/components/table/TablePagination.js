import React, {Component, Fragment} from "react";
import {DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, NavLink, UncontrolledDropdown} from "reactstrap";
import {Colxx} from "../common/CustomBootstrap";

export default class TablePagination extends Component {
    constructor(props) {
        super(props);

        this.getSafePage = this.getSafePage.bind(this);
        this.changePage = this.changePage.bind(this);
        this.changePageSize = this.changePageSize.bind(this);
        this.renderPageJump = this.renderPageJump.bind(this);

        this.state = {
            page: props.page,
            pageSize: this.props.defaultPageSize
        };
    }

    static getDerivedStateFromProps(props, state) {
        return {page: props.page};
    }

    getSafePage(page) {
        if (Number.isNaN(page)) {
            page = this.props.page;
        }
        return Math.min(Math.max(page, 0), this.props.pages - 1);
    }

    changePageSize(size) {
        this.props.onPageSizeChange(size);
        this.setState({ pageSize: size });
    }

    changePage(page) {
        page = this.getSafePage(page);
        this.setState({ page });
        if (this.props.page !== page) {
            this.props.onPageChange(page);
        }
    }






    renderPageJump() {
        let pages = this.props.pages;
        let pageNumbers = [];
        for (let i = 0; i < pages; i++) {
            pageNumbers.push(
                <DropdownItem
                    key={i}
                    onClick={() => this.changePage(i)}
                >
                    {i + 1}
                </DropdownItem>
            );
        }
        return pageNumbers;
    }
    onChangePage(e) {
        this.props.onChangePage(e);
    }
    render() {
        const {
            pages,
            pageSizeOptions,
            pageSize,
            showPageSizeOptions,
            showPageJump,handleChangeLength
        } = this.props;
        // 1 4 true true, [1, 2, 3 ,4], true, true,
        const {
            totalPage = 0,
            currentPage = 1,
            numberLimit = 5,
            lastIsActive = true,
            firstIsActive = true
        } = this.props;

        let startPoint = 1;
        let endPoint = numberLimit;

        if (numberLimit > totalPage) {
            startPoint = 1;
            endPoint = totalPage;
        } else if (currentPage <= parseInt(numberLimit / 2, 10)) {
            startPoint = 1;
            endPoint = numberLimit;
        } else if (currentPage + parseInt(numberLimit / 2, 10) <= totalPage) {
            startPoint = currentPage - parseInt(numberLimit / 2, 10);
            endPoint = currentPage + parseInt(numberLimit / 2, 10);
        } else {
            startPoint = totalPage - (numberLimit - 1);
            endPoint = totalPage;
        }
        startPoint = startPoint === 0 ? 1 : startPoint;
        const points = [];
        for (var i = startPoint; i <= endPoint; i++) {
            points.push(i);
        }

        let firstPageButtonClassName = currentPage <= 1 ? "disabled" : "";
        let lastPageButtonClassName = currentPage >= totalPage ? "disabled" : "";
        let prevPageButtonClassName = currentPage <= 1 ? "disabled" : "";
        let nextPageButtonClassName = currentPage >= totalPage ? "disabled" : "";
        return (
            <Fragment>
                <div className="text-center">
                    {
                        showPageJump &&
                        <div className="float-left pt-2"><span>Page </span>
                            <UncontrolledDropdown className="d-inline-block">
                                <DropdownToggle caret color="outline-primary" size="xs">
                                    {this.state.page + 1}
                                </DropdownToggle>
                                <DropdownMenu direction="left" >
                                    {this.renderPageJump()}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            <span> of </span>{pages}</div>
                    }

                    {totalPage > 0 ? (
                        <Colxx xxs="12" className="mt-3">
                            <Nav className="pagination justify-content-center">
                                {firstIsActive && (
                                    <NavItem className={`page-item ${firstPageButtonClassName} cursor-pointer`}>
                                        <NavLink
                                            className="page-link first"
                                            onClick={() => this.onChangePage(1)}>
                                            <i className="simple-icon-control-start"/>
                                        </NavLink>
                                    </NavItem>
                                )}

                                <NavItem className={`page-item ${prevPageButtonClassName}`}>
                                    <NavLink
                                        className="page-link prev"
                                        onClick={() => this.onChangePage(currentPage - 1)}
                                    >
                                        <i className="simple-icon-arrow-left"/>
                                    </NavLink>
                                </NavItem>
                                {points.map(i => {
                                    return (
                                        <NavItem
                                            key={i}
                                            className={`page-item ${currentPage === i? "active" : 'cursor-pointer'}`}>
                                            <NavLink
                                                className="page-link"
                                                onClick={() => this.onChangePage(i)}
                                            >
                                                {i}
                                            </NavLink>
                                        </NavItem>
                                    );
                                })}

                                <NavItem className={`page-item ${nextPageButtonClassName}`}>

                                    <NavLink
                                        className="page-link next"
                                        onClick={() => this.onChangePage(currentPage + 1)}
                                    >
                                        <i className="simple-icon-arrow-right"/>
                                    </NavLink>
                                </NavItem>
                                {lastIsActive && (
                                    <NavItem className={`page-item ${lastPageButtonClassName} cursor-pointer`}>
                                        <NavLink
                                            className="page-link last"
                                            onClick={() => this.onChangePage(totalPage)}>
                                            <i className="simple-icon-control-end"/>
                                        </NavLink>
                                    </NavItem>
                                )}
                            </Nav>
                        </Colxx>
                    ) : (
                        <Colxx xxs="12" className="mt-2"/>
                    )}
                    {
                        showPageSizeOptions &&
                        <div className="float-right pt-2">
                            <span className="text-muted text-small mr-1">Items </span>
                            <UncontrolledDropdown className="d-inline-block">
                                <DropdownToggle caret color="outline-primary" size="xs">
                                    {pageSize}
                                </DropdownToggle>
                                <DropdownMenu right>
                                    {pageSizeOptions.map((size, index) => {
                                        return (
                                            <DropdownItem
                                                key={index}
                                                onClick={() => handleChangeLength(size)}
                                            >
                                                {size}
                                            </DropdownItem>
                                        );
                                    })}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div>
                    }
                </div>
            </Fragment>
        );
    }
}
