import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateSignal = React.lazy(() => import(/* webpackChunkName: "create-guide" */ './create'));
const UpdateSignal = React.lazy(() => import(/* webpackChunkName: "create-guide" */ './edit'));
const AllSignals = React.lazy(() => import(/* webpackChunkName: "create-guide" */ './view'));

const Guides = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllSignals {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateSignal {...props} />}
            />
            <Route
                path={`${match.url}/edit/:id`}
                render={props => <UpdateSignal {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Guides;