import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from '../../layout/AppLayout';

// const Dashboards = React.lazy(() =>
//   import(/* webpackChunkName: "dashboards" */ './dashboards')
// );
const Pages = React.lazy(() =>
  import(/* webpackChunkName: "pages" */ './pages')
);
const Applications = React.lazy(() =>
  import(/* webpackChunkName: "applications" */ './applications')
);
const Ui = React.lazy(() => import(/* webpackChunkName: "ui" */ './ui'));
const Menu = React.lazy(() => import(/* webpackChunkName: "menu" */ './menu'));
const BlankPage = React.lazy(() =>
  import(/* webpackChunkName: "blank-page" */ './blank-page')
);
// const Chat = React.lazy(()=> import('./Chat/chat'));
const Dashboard = React.lazy(() =>
    import(/* webpackChunkName: "dashboards" */ './dashboard/dashboard.js')
);
const Categories = React.lazy(() =>
    import(/* webpackChunkName: "dashboards" */ './categories')
);
const SubCategories = React.lazy(() =>
    import(/* webpackChunkName: "dashboards" */ './sub-categories')
);
// const Guides = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './guides')
// );
const Settings = React.lazy(() =>
    import(/* webpackChunkName: "dashboards" */ './settings')
);
// const FAQS = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './faqs')
// );
// const Partners = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './partners')
// );
// const ContactUs = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './contact')
// );
// const Signals = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './Signals')
// );
// const Results = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './result')
// );
// const VIPRegistrations = React.lazy(() =>
//     import(/* webpackChunkName: "dashboards" */ './VIP-Registration/view')
// );
// const AllNotifications = React.lazy(()=> import('./all-notifications'));
// const Users = React.lazy(()=> import('./users'));
const AdminProfile = React.lazy(()=> import('./admin-profile'));
// const UploadVideo = React.lazy(()=> import('./videos'));
const Roles = React.lazy(()=> import('./roles'));
const Permissions = React.lazy(()=> import('./permissions'));
const City = React.lazy(()=> import('./city'));
const Province = React.lazy(()=> import('./province'));
const Country = React.lazy(()=> import('./country'));
const Users = React.lazy(() => import( './users'));
// const NewsLetter = React.lazy(() => import( './News-Letter'));
// const Tags = React.lazy(() => import( './Tags'));
// const SeoTags = React.lazy(() => import( './Seo-Tags'));
// const Authors = React.lazy(() => import( './Authors'));
const Events = React.lazy(() => import( './events'));
const Files = React.lazy(() => import( './files'));
// const Quotes = React.lazy(() => import( './Quotes'));

class App extends Component {

  constructor(props) {
    super(props);
    // if (window.performance) {
    //   if (performance.navigation.type == 1) {
    //     if(!localStorage.userToken){
    //       this.props.history.push('/user/login')
    //     }
    //   } else {
    //     this.setupBeforeUnloadListener();
    //   }
    // }
  }

  componentDidMount() {
    if(!localStorage.userToken){
      this.props.history.push('/user/login')
    }
  }

  // setupBeforeUnloadListener = () => {
  //   window.addEventListener("beforeunload", (ev) => {
  //     ev.preventDefault();
  //     localStorage.removeItem('userToken');
  //     localStorage.removeItem('currentUser');
  //     localStorage.removeItem('userPermission');
  //     window.location.reload();
  //
  //   });
  // };
  render() {
    const { match } = this.props;

    return (
      <AppLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect
                exact
                from={`${match.url}/`}
                to={`${match.url}/dashboard`}
              />
              {/*<Route*/}
              {/*    path={`${match.url}/chat`}*/}
              {/*    render={props => <Chat {...props} />}*/}
              {/*/>*/}
              <Route
                  path={`${match.url}/roles`}
                  render={props => <Roles {...props} />}
              />

              <Route
                  path={`${match.url}/permissions`}
                  render={props => <Permissions {...props} />}
              />

              <Route
                  path={`${match.url}/city`}
                  render={props => <City {...props} />}
              />

              <Route
                  path={`${match.url}/province`}
                  render={props => <Province {...props} />}
              />
              <Route
                  path={`${match.url}/country`}
                  render={props => <Country {...props} />}
              />

              <Route
                  path={`${match.url}/files`}
                  render={props => <Files {...props} />}
              />

              <Route
                  path={`${match.url}/users`}
                  render={props => <Users {...props} />}
              />

              <Route
                  path={`${match.url}/sub-categories`}
                  render={props => <SubCategories {...props} />}
              />
              {/*<Route*/}
              {/*    path={`${match.url}/quote`}*/}
              {/*    render={props => <Quotes {...props} />}*/}
              {/*/>*/}

              {/*<Route*/}
              {/*    path={`${match.url}/author`}*/}
              {/*    render={props => <Authors {...props} />}*/}
              {/*/>*/}
              <Route
                  path={`${match.url}/event`}
                  render={props => <Events {...props} />}
              />
              {/*<Route*/}
              {/*    path={`${match.url}/newsletter`}*/}
              {/*    render={props => <NewsLetter {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/tags`}*/}
              {/*    render={props => <Tags {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/seo-tags`}*/}
              {/*    render={props => <SeoTags {...props} />}*/}
              {/*/>*/}
              <Route
                  path={`${match.url}/profile`}
                  render={props => <AdminProfile {...props} />}
              />
              {/*<Route*/}
              {/*    path={`${match.url}/notifications`}*/}
              {/*    render={props => <AllNotifications {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/vip-registrations`}*/}
              {/*    render={props => <VIPRegistrations {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/results`}*/}
              {/*    render={props => <Results {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/users`}*/}
              {/*    render={props => <Users {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/vip-signals`}*/}
              {/*    render={props => <Signals {...props} />}*/}
              {/*/>*/}
              <Route
                  path={`${match.url}/categories`}
                  render={props => <Categories {...props} />}
              />
              {/*<Route*/}
              {/*    path={`${match.url}/faqs`}*/}
              {/*    render={props => <FAQS {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/contact`}*/}
              {/*    render={props => <ContactUs {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/partners`}*/}
              {/*    render={props => <Partners {...props} />}*/}
              {/*/>*/}
              {/*<Route*/}
              {/*    path={`${match.url}/guides`}*/}
              {/*    render={props => <Guides {...props} />}*/}
              {/*/>*/}
              <Route
                  path={`${match.url}/settings`}
                  render={props => <Settings {...props} />}
              />
              <Route
                path={`${match.url}/dashboard`}
                render={props => <Dashboard {...props} />}
              />
              <Route
                path={`${match.url}/applications`}
                render={props => <Applications {...props} />}
              />
              <Route
                path={`${match.url}/pages`}
                render={props => <Pages {...props} />}
              />
              <Route
                path={`${match.url}/ui`}
                render={props => <Ui {...props} />}
              />
              <Route
                path={`${match.url}/menu`}
                render={props => <Menu {...props} />}
              />
              <Route
                path={`${match.url}/blank-page`}
                render={props => <BlankPage {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AppLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(App)
);
