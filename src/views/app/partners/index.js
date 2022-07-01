import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreatePartner = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './create')
);
const UpdatePartner = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './edit')
);
const AllPartners = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);

const Partners = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllPartners {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreatePartner {...props} />}
            />
            <Route
                path={`${match.url}/edit/:slug`}
                render={props => <UpdatePartner {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Partners;