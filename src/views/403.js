import React, {Component, Fragment} from "react";
import {Button, Card, CardTitle, Row} from "reactstrap";
import {Colxx} from "../components/common/CustomBootstrap";
import IntlMessages from "../helpers/IntlMessages";


class FourZeroThree extends Component {

    componentDidMount() {
        document.body.classList.add("background");
    }
    componentWillUnmount() {
        document.body.classList.remove("background");
    }
    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(this.props.location)
    //     console.log(nextProps.location)
    //     if (nextProps.location !== this.props.location) {
    //         console.log(this.props.location)
    //     }
    // }

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
                                        {/*<NavLink to={`/`} >*/}
                                        {/*    /!*<span className="logo-single" />*!/*/}
                                        {/*    <img alt={'notfound'} src={'/assets/img/xprojets.png'} style={{maxHeight: '100px'}}/>*/}
                                        {/*</NavLink>*/}
                                        <CardTitle className="mb-4">
                                            Unauthorized
                                        </CardTitle>
                                        <p className="mb-0 text-muted text-small mb-0">
                                            <IntlMessages id="pages.error-code" />
                                        </p>
                                        <p className="display-1 font-weight-bold mb-5">403</p>
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
export default FourZeroThree;
