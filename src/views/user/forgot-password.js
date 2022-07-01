import React, { Component } from "react";
import { Row, Card, CardTitle, Label, FormGroup, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import { Colxx } from "../../components/common/CustomBootstrap";
import IntlMessages from "../../helpers/IntlMessages";
import { forgotPassword } from "../../redux/actions";
import { NotificationManager } from "../../components/common/react-notifications";
import { connect } from "react-redux";
import ApiCall from "../../config/network";
import Url from "../../config/api";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      loading: false,
      error: {status: false, message: ''}
    };
  }


  onForgotPassword = async(values) => {
    if (!this.props.loading) {
      if (values.email !== "") {
        // this.setState({loading: true});
        let response = await ApiCall.post(Url.STORE_SUPPORT, {
          user: values.email
        })

        if (response.status === 200){
          this.setState({loading: false, error: {status: false, message: ''}});
          return  NotificationManager.success(
              "Query sent to Admin Successfully",
              "Success",
              3000,
              null,
              null,
              'filled');
          this.props.history.push('/')
        }else {
          this.setState({loading: false});
          // return  NotificationManager.error(
          //     "This Email is not registered as Staff member.Kindly contact with Admin.",
          //     "Email Sent Error",
          //     3000,
          //     null,
          //     null,
          //     'filled'
          // );
        }
      }
    }
  }

  validateEmail = (value) => {
    let error;
    if (!value) {
      error = "Please enter your email address";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
      error = "Invalid email address";
    }
    return error;
  }

  render() {

    const { email } = this.state;
    // const initialValues = { email };
    return (
      <Row className="h-100">
        <Colxx xxs="12" md="10" className="mx-auto my-auto">
          <Card className="auth-card">
            <div className="position-relative image-side ">
              <p className=" h2">
                <NavLink to={`/`} className="white">
                  <img className="rounded-pill" alt='Alert Pak Logo' src={'/assets/img/AlertPak.png'} style={{maxHeight: '60px'}}/>
                </NavLink>
              </p>
              <p className=" mb-0">
                Please use your e-mail to reset your password. <br />
                If you are not a member, please contact with Admin.
              </p>
            </div>
            <div className="form-side">

              <CardTitle className="mb-4">
                <IntlMessages id="user.forgot-password" />
              </CardTitle>

              <Formik
                onSubmit={this.onForgotPassword}>
                {({ errors, touched }) => (
                  <Form className="av-tooltip tooltip-label-bottom">
                    <FormGroup className="form-group has-float-label">
                      <Label>
                        <IntlMessages id="user.email" />
                      </Label>
                      <Field
                        className="form-control"
                        name="email"
                        validate={this.validateEmail}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback d-block">
                          {errors.email}
                        </div>
                      )}
                    </FormGroup>

                    <div className="d-flex justify-content-between align-items-center">
                      <NavLink to={`/user/forgot-password`}>
                        <IntlMessages id="user.forgot-password-question" />
                      </NavLink>
                      <Button
                        color="primary"
                        className={`btn-shadow btn-multiple-state ${this.state.loading ? "show-spinner" : ""}`}
                        size="lg"
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label"><IntlMessages id="user.reset-password-button" /></span>
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Card>
        </Colxx>
      </Row>
    );
  }
}

const mapStateToProps = ({ authUser }) => {
  const { forgotUserMail, loading, error } = authUser;
  return { forgotUserMail, loading, error };
};

export default connect(
  mapStateToProps,
  {
    forgotPassword
  }
)(ForgotPassword);

