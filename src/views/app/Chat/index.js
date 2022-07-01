import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';


const ChatApp = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './chat')
);

const Discussions = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/send`} />
            <Route
                path={`${match.url}/:slug`}
                render={props => <ChatApp {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Discussions;