import React, { Component, Fragment } from "react";
import { Row, Card, CardBody } from "reactstrap";
import { NavLink } from "react-router-dom";
// import axios from "axios";

import Pagination from "../../containers/pages/Pagination";
// import { servicePath } from "../../constants/defaultValues";
import Breadcrumb from "../../containers/navs/Breadcrumb";
import { Separator, Colxx } from "../../components/common/CustomBootstrap";
import ApiCall from "../../config/network";
import Url from "../../config/api";
import {config} from "../../config/env";
// import {notification} from "antd";

// const apiUrl = servicePath + "/cakes/paging";

class AllNotifications extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            currentPage: 1,
            totalPage: 1,
            keyword: "Cake",
            totalItemCount: 0,
            notifications: [],
            isLoading: true,
            pageSize: 5
        };
    }

    onChangePage(page) {
        this.setState(
            {
                currentPage: page
            },
            () => {
                this.dataListRender();
            }
        );
    }

    componentDidMount() {
        this.dataListRender();
    }

    dataListRender = async () =>{
                let response = await ApiCall.get(Url.ALL_NOTIFICATIONS, await config());
                // console.log(response)
                if(response.status === 200) {
                    let totalPages = Math.ceil(response.data.success.length/5)
                    // console.log(totalPages)
                    this.setState({
                        notifications: response.data.success,
                        totalPage: totalPages
                    })
                }
                this.setState({
                    isLoading: false
                });
    }

    render() {
        const indexOfLastItem = this.state.currentPage * this.state.pageSize;
        const indexOfFirstItem = indexOfLastItem - this.state.pageSize;
        const currentItems = this.state.notifications.slice(indexOfFirstItem, indexOfLastItem)
        const rowLength = this.state.items.length;
        const { isLoading } = this.state;
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.all-notifications" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                {!isLoading?
                    <Row>
                        <Colxx xxs="12" className="mb-4">
                            <Card>
                                <CardBody>
                                    {!isLoading ? (
                                        // eslint-disable-next-line array-callback-return
                                        currentItems.map((item, i) => {


                                                return <div
                                                    key={i}
                                                    className={`${rowLength !== i + 1 ? "mb-3" : ""}`}
                                                >

                                                    <NavLink to={`/app/vip-registrations`} className="w-40 w-sm-100">

                                                        <p className="list-item-heading mb-1 color-theme-1">
                                                            <img
                                                                src={'/assets/img/user-register.png'}
                                                                alt={'notification'}
                                                                className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
                                                            />
                                                            <span className={'ml-2'}>
                                                            VIP Registration
                                                            </span>
                                                        </p>
                                                        <p className="mb-4 text-small mt-2">You have received 1 New Request</p>
                                                        <p className="mb-1 text-muted text-small">
                                                              {item.createdAt}
                                                        </p>
                                                    </NavLink>
                                                    {rowLength !== i + 1 && <Separator />}
                                                </div>


                                        })
                                    ) : (
                                        <div className="loading" />
                                    )}
                                </CardBody>
                            </Card>
                        </Colxx>
                        <Pagination
                            currentPage={this.state.currentPage}
                            totalPage={this.state.totalPage}
                            onChangePage={i => this.onChangePage(i)}
                        />
                    </Row>

                    :<div className="loading" />}

            </Fragment>
        );
    }
}
export default AllNotifications;