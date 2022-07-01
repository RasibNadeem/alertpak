import React, {Suspense} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';

const CreateUser = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './create')
);
const AllUsers = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);
const Blog = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ '../../../components/details')
);

const UpdateUser = React.lazy(() => import( './edit'));


const Roles = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateUser {...props} />}
            />
            <Route
                path={`${match.url}/view`}
                render={props => <AllUsers {...props} />}
            />
            <Route
                path={`${match.url}/edit/:id`}
                render={props => <UpdateUser {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Roles;