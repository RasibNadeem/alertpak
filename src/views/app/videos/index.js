import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const UploadVideo = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './upload')
);


const UploadVideos = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/upload`}
                render={props => <UploadVideo {...props} />}
            />
            {/*<Route*/}
            {/*    path={`${match.url}/create`}*/}
            {/*    render={props => <CreateUser {...props} />}*/}
            {/*/>*/}
            {/*<Route*/}
            {/*    path={`${match.url}/edit/:id`}*/}
            {/*    render={props => <UpdateUser {...props} />}*/}
            {/*/>*/}
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default UploadVideos;