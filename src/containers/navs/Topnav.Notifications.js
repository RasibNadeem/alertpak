import React from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {NavLink, Link} from "react-router-dom";
//
// import notifications from "../../data/notifications";
import {Separator} from "../../components/common/CustomBootstrap";
const NotificationItem = ({createdAt, readAt }) => {
  return (
    <div className="d-flex flex-row mb-3 pb-3 border-bottom"
         style={{backgroundColor: readAt? '': '#dce1e8',
        borderRadius: readAt? '' : '14px',
        padding: readAt? '': '5px 10px'}}>
      <NavLink to="/app/vip-registrations">
        <img
          src={'/assets/img/user-register.png'}
          alt={'notification'}
          className="img-thumbnail list-thumbnail xsmall border-0 rounded-circle"
        />
      </NavLink>
      <div className="pl-3 pr-2">
        <NavLink to="/app/vip-registrations">
          <p className="font-weight-medium mb-1">You have received 1 New Request</p>
          <p className="text-muted mb-0 text-small">{createdAt}</p>
        </NavLink>
      </div>
    </div>
  );
};

const TopnavNotifications = (props) => {
  return (
    <div className="position-relative d-inline-block">
      <UncontrolledDropdown className="dropdown-menu-right">
        <DropdownToggle
          className="header-icon notificationButton"
          color="empty"
        >
          <i className="simple-icon-bell" />
          <span className="count">{props.notifications.filter(item => item.readAt === undefined).length}</span>
        </DropdownToggle>
        <DropdownMenu
          className="position-absolute mt-3 scroll"
          right
          id="notificationDropdown"
        >
            {props.notifications.length > 0?
                <React.Fragment>
                    <PerfectScrollbar
                        options={{ suppressScrollX: true, wheelPropagation: false }}
                    >

                        {/* eslint-disable-next-line array-callback-return */}
                        { props.notifications.map((notification, index) => {
                                return <NotificationItem key={index} {...notification} />;
                        })}


                    </PerfectScrollbar>

                    <Separator/>
                    <Link className="mb-0 text-small mt-1" to={'/app/notifications'} onClick={props.readAllNotifications}
                          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>See All Notifications</Link>
                    {/*{props.notifications.filter(item => item.readAt === undefined).length> 0 &&*/}
                    {/*<p className="mb-0 text-small mt-1"*/}
                    {/*   style={{display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}} onClick={props.readAllNotifications}>Mark All As Read</p>*/}
                    {/*}*/}
                </React.Fragment>


                : <h4 className="text-center mt-3 mb-3" >
                    <i className="simple-icon-bell" aria-hidden="true" style={{fontSize: '2em'}}/>
                    <br/>
                    You're all caught up!
                </h4>}
        </DropdownMenu>
      </UncontrolledDropdown>
    </div>
  );
};

export default TopnavNotifications;
