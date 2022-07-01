import React, { Component, Fragment } from "react";
import { Row, Card, CardTitle,Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Colxx } from "../components/common/CustomBootstrap";
import IntlMessages from "../helpers/IntlMessages";


class Error extends Component {
  componentDidMount() {
    document.body.classList.add("background");
  }
  componentWillUnmount() {
    document.body.classList.remove("background");
  }
  render() {
    return (
      <Fragment>
        <div className="fixed-background" />
        <main>
          <div className="container">
            <Row className="h-100">
              <Colxx xxs="12" md="10" className="mx-auto my-auto">
                <Card className="auth-card">
                  <div className="position-relative image-side text-center">
                    <p className="h2">Hexaa Blog Admin Panel</p>
                    <img alt='Blog logo' src={'/assets/img/AlertPak.png'} style={{maxHeight: '250px'}}/>
                    {/*<p className="white mb-0">Yes, it is indeed!</p>*/}
                  </div>
                  <div className="form-side">
                    <NavLink to={`/`} className="black">
                      {/*<span className="logo-single" />*/}
                      <h2>The Hexaa</h2>
                    </NavLink>
                    <CardTitle className="mb-4">
                      <IntlMessages id="pages.error-title" />
                    </CardTitle>
                    <p className="mb-0 text-muted text-small mb-0">
                      <IntlMessages id="pages.error-code" />
                    </p>
                    <p className="display-1 font-weight-bold mb-5">404</p>
                    <Button
                      href="/app"
                      color="primary"
                      className="btn-shadow"
                      size="lg"
                    >
                      <IntlMessages id="pages.go-back-home" />
                    </Button>
                  </div>
                </Card>
              </Colxx>
            </Row>
          </div>
        </main>
      </Fragment>
    );
  }
}
export default Error;
