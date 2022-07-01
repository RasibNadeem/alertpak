import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
const CreateCategory = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './create')
);
const UpdateCategory = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './edit')
);
const AllCategories = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './view')
);
const Translation = React.lazy(() =>
    import(/* webpackChunkName: "create-client" */ './translations')
);

const Categories = ({ match }) => (
    <Suspense fallback={<div className="loading" />}>
        <Switch>
            <Redirect exact from={`${match.url}/`} to={`${match.url}/view`} />
            <Route
                path={`${match.url}/view`}
                render={props => <AllCategories {...props} />}
            />
            <Route
                path={`${match.url}/create`}
                render={props => <CreateCategory {...props} />}
            />
            <Route
                path={`${match.url}/edit/:slug`}
                render={props => <UpdateCategory {...props} />}
            />
            <Route
                path={`${match.url}/translations/:id`}
                render={props => <Translation {...props} />}
            />
            <Redirect to="/error" />
        </Switch>
    </Suspense>
);
export default Categories;