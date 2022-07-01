import React, {Component, Fragment} from "react";
import {Button, Card, CardBody, CardTitle, Col, Row} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import {Colxx, Separator} from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import {Link} from "react-router-dom";
import VideoUploader from "../../../components/VideoUploader";
// import ReactPlayer from 'react-player'
export default class Videos extends Component {



    render() {

        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <div className="text-zero top-right-button-container">
                            <Link to='/app/results/view'><Button size='lg' color={'secondary'}><IntlMessages
                                id={"menu.cancel"}/></Button></Link>
                        </div>
                        <Breadcrumb heading="menu.create" match={this.props.match}/>
                        <Separator className="mb-5"/>
                    </Colxx>
                </Row>
                <Row>
                    <Col xxs="10">
                        <div className='col-sm-12 col-lg-10 col-xs-12 '>
                            <Card>
                                <div className="position-absolute card-top-buttons">
                                </div>
                                <CardBody>
                                    <CardTitle>
                                        Upload Video
                                    </CardTitle>
                                    <div className='control-pane'>
                                        <div className='control-section row uploadpreview'>
                                            <div className='col-lg-8'>
                                                <div className='upload_wrapper'>
                                                    <VideoUploader/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </Col>

                </Row>
            </Fragment>
        )
    }
}
