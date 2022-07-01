import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateFaq = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './create')
);
const UpdateFaq = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './edit')
);
const AllFaqs = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);
const Translation = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './translation')
);

const FAQS = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllFaqs {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateFaq {...props} />}
            />
            <Route
                path={`${match.url}/edit/:slug`}
                render={props => <UpdateFaq {...props} />}
            />
            <Route
                path={`${match.url}/translations/:id`}
                render={props => <Translation {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default FAQS;