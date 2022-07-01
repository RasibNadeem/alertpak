import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateGuide = React.lazy(() => import( './create'));
const UpdateGuide = React.lazy(() => import( './edit'));
const AllGuides = React.lazy(() => import( './view'));
const Translation = React.lazy(() => import( './translations'));
const Guides = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllGuides {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateGuide {...props} />}
            />
            <Route
                path={`${match.url}/edit/:slug`}
                render={props => <UpdateGuide {...props} />}
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