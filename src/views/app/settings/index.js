import React, { Suspense } from "react";
import { Redirect, Route, Switch } from "react-router-dom";

const TermsAndConditions = React.lazy(() => import("./terms"));
const PrivacyPolicy = React.lazy(() => import("./privacy"));
const Security = React.lazy(() => import("./security"));

const Settings = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect
        exact
        from={`${match.url}/`}
        to={`${match.url}/privacy-policy`}
      />
      <Route
        path={`${match.url}/privacy-policy`}
        render={(props) => <PrivacyPolicy {...props} />}
      />
      <Route
        path={`${match.url}/security`}
        render={(props) => <Security {...props} />}
      />
      <Route
        path={`${match.url}/terms-and-conditions`}
        render={(props) => <TermsAndConditions {...props} />}
      />
      <Redirect to="/error" />
    </Switch>
  </Suspense>
);
export default Settings;
