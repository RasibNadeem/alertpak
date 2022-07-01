import React, {useEffect, useState} from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Card, CardBody, CardTitle} from "reactstrap";
import Spinner from "reactstrap/es/Spinner";
import Url from '../../../../config/api';
import ApiCall from '../../../../config/network';
import {config} from "../../../../config/env";
export default function Users() {
    const [state, setState] = useState({ loading: true,  users: []})
    useEffect(()=> {
        let isUnmount = false
        const getUsers =async ()=> {
            setState(prevState => ({
                ...prevState,
                loading: true
            }))
            let response = await ApiCall.get(Url.ALL_USERS, await config());
            if(response.status === 200){
                if(!isUnmount){
                    setState(prevState => ({
                        ...prevState,
                        users: response.data.users.reverse(),
                        loading: false
                    }))
                }

            }
            // console.log("RECENT MISSIONS",response)
        };
        getUsers();
        return ()=> {
            isUnmount = true
        }
    }, []);
    const getUsers =async ()=> {
        setState(prevState => ({
            ...prevState,
            loading: true
        }))
        let response = await ApiCall.get(Url.ALL_USERS, await config());
        if(response.status === 200){

                setState(prevState => ({
                    ...prevState,
                    users: response.data.users.reverse(),
                    loading: false
                }))

        }
        // console.log("RECENT MISSIONS",response)
    };
    return (
        <Card>
            <div className="position-absolute card-top-buttons">
                <button className="btn btn-header-light icon-button" onClick={getUsers}>
                    <i className="simple-icon-refresh" />
                </button>
            </div>
            <CardBody>
                <CardTitle>
                    {/*<IntlMessages id="dashboards.recent-orders" />*/}
                    Users
                </CardTitle>
                <div className="dashboard-list-with-user">
                    <PerfectScrollbar
                        options={{ suppressScrollX: true, wheelPropagation: false }}
                    >
                        {state.loading ?
                            <div className="d-flex flex-row mb-3 pb-3 border-bottom"  style={{justifyContent: 'center', padding: '50px'}}>
                                <h3 className="text-center mt-3 mb-3">
                                    <Spinner/>
                                    <br/>
                                    Loading
                                </h3>
                            </div> :
                            state.users.length > 0 ?
                                state.users.map((item, index) => {
                                    return (
                                        <div key={index}
                                             className="d-flex flex-row mb-3 pb-3 border-bottom">
                                                <img
                                                    src={item.image === null? '/assets/img/user-image.png': item.image}
                                                    alt={'notes'}
                                                    className="list-thumbnail border-0 list-thumbnail align-self-center xsmall"
                                                    ref={(node) => {
                                                        if (node) {
                                                            node.style.setProperty('width', '50px', "important");
                                                        }
                                                    }}
                                                    style={{
                                                        borderRadius: '50%',
                                                        height: '50px',
                                                    }}
                                                />
                                            <div className="pl-3 pr-2">
                                                    <p className="font-weight-medium mb-0">{item.name}</p>
                                                    <p className="text-muted mb-0 text-small">
                                                        {item.email}
                                                    </p>
                                            </div>
                                        </div>
                                    );
                                })
                                : <div className="d-flex flex-row mb-3 pb-3 border-bottom"  style={{justifyContent: 'center', padding: '50px'}}>
                                    <h2 className="text-center mt-3 mb-3">
                                        <i className="simple-icon-notebook" aria-hidden="true" style={{fontSize: '2em'}}/>
                                        <br/>
                                        No User Created Yet!
                                    </h2>
                                </div>}
                    </PerfectScrollbar>
                </div>
            </CardBody>
        </Card>
    );
}
