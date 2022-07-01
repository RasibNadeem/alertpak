import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreatePermission = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './create')
);
const UpdatePermission = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './edit')
);
const AllPermissions = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);

const Permissions = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllPermissions {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreatePermission {...props} />}
            />
            <Route
                path={`${match.url}/edit/:id`}
                render={props => <UpdatePermission {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Permissions;