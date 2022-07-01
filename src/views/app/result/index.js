import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateResult = React.lazy(() => import( './create'));
const UpdateResult = React.lazy(() => import( './edit'));
const AllResults = React.lazy(() => import( './view'));
const Translation = React.lazy(() => import('./translations'));
const Guides = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllResults {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateResult {...props} />}
            />
            <Route
                path={`${match.url}/edit/:id`}
                render={props => <UpdateResult {...props} />}
            />
            <Route
                path={`${match.url}/translations/:id`}
                render={props => <Translation {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Guides;