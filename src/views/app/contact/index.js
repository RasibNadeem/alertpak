import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// const ViewContact = React.lazy(() =>
//     import(/* webpackChunkName: "create-client" */ './edit')
// );
const AllContact = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);

const Contact = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllContact {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Contact;