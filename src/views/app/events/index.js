import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateEvent = React.lazy(() => import( './create'));
const UpdateEvent = React.lazy(() => import( './edit'));
const AllEvents = React.lazy(() => import( './view'));
const UploadVideo = React.lazy(() => import( './uploadVideo'));
const Events = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllEvents {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateEvent {...props} />}
            />
            <Route
                path={`${match.url}/edit/:slug`}
                render={props => <UpdateEvent {...props} />}
            />
            <Route
                path={`${match.url}/upload/:id`}
                render={props => <UploadVideo {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Events;