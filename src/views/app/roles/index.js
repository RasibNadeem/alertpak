import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateRole = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './create')
);

const AllRoles = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);
const UpdateRole = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './edit')
);

const Roles = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllRoles {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateRole {...props} />}
            />
            <Route
                path={`${match.url}/edit/:id`}
                render={props => <UpdateRole {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Roles;