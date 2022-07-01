import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const AllFiles = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);

const Roles = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllFiles {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Roles;