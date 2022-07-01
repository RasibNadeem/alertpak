import React, { Component, Fragment } from "react";
import { Row, Col } from "reactstrap";
import {
  Card,
  CardBody,
  CardTitle,
  FormGroup,
  Label,
  Button,
  CustomInput,
  Form,
  Input,
} from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import "../table.css";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import { NotificationManager } from "../../../components/common/react-notifications";
import { config, multipartConfig } from "../../../config/env";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";

import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import customStyles from "../../../data/colourOptions";
import DropzoneExample from "../../../containers/forms/DropzoneExample";
import MultipleDropzoneExample from "../../../containers/forms/MultipleDropzoneExample";
import SelectComponent from "../../../components/SelectComponent";
import TextEditor from "../../../components/ReactDraft";
const quillModules = {
  toolbar: [
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
  ],
};
const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
];
const initialState = {
  title: "",
  description: "",
  categories: [],
  selectedCategory: "",
  selectedMainCategory: [],
  mainCategory: [],
  images: [],
  killed: 0,
  injured: 0,
  arrested: 0,
  protestor: 0,
  roadClosure: false,
  isFeatured: false,
  status: true,
  isLoading: false,
  statusProvince: true,
  isLoadingProvince: false,
  statusCountry: true,
  isLoadingCountry: false,
  statusCity: true,
  isLoadingCity: false,
  location: "",
  provinces: [],
  selectedCountry: "",
  countries: [],
  cities: [],
  selectedProvince: "",
  selectedCity: "",
  riskLevel: [
    { label: "Low", value: "Low" },
    { label: "Medium", value: "Medium" },
    { label: "High", value: "High" },
    { label: "Extreme", value: "Extreme" },
  ],
  selectedRiskLevel: "",
  date: moment(new Date()),

  loading: false,
  spinning: false,
  target: "",
  damage: "",
  responsibility: "",
  modusOperandi: "",
};

export default class CreatePost extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this._isMounted = false;
    this.getAllMainCategories();
  }

  componentWillUnmount() {
    this._isMounted = true;
  }

  getAllMainCategories = async () => {
    if (!this._isMounted) {
      let response = await ApiCall.get(Url.ALL_CATEGORIES_OPEN, await config());
      if (response.status === 200) {
        this.setState({
          mainCategory: response.data.categories.reverse(),
          images: [],
        });
      }
      let responseProvinces = await ApiCall.get(
        Url.ALL_PROVINCES_OPEN,
        await config()
      );
      if (responseProvinces.status === 200) {
        this.setState({
          provinces: responseProvinces.data.provinces.reverse(),
        });
      }
      let responseCountries = await ApiCall.get(
        Url.ALL_COUNTRIES_OPEN,
        await config()
      );
      if (responseCountries.status === 200) {
        this.setState({
          countries: responseCountries.data.countries.reverse(),
        });
      }
    }
  };

  createEvent = async (e) => {
    e.preventDefault();
    const {
      title,
      description,
      selectedRiskLevel,
      selectedProvince,
      selectedCity,
      killed,
      injured,
      arrested,
      protestor,
      roadClosure,
      isFeatured,
      location,
      images,
      date,
      target,
      damage,
      responsibility,
      modusOperandi,
      selectedCountry,
    } = this.state;

    let validation = this.handleValidations();
    if (validation.status) {
      let userSelectedMainCategory = this.state.selectedMainCategory.value;

      let userSelectedCategory = this.state.selectedCategory.map(function (
        item
      ) {
        return item.value;
      });
      this.setState({ loading: true });
      const data = new FormData();
      data.append("title", title);
      data.append("description", description);
      data.append("categories", JSON.stringify(userSelectedCategory));
      data.append("parentCategory", JSON.stringify(userSelectedMainCategory));
      data.append("killed", killed);
      data.append("injured", injured);
      data.append("arrested", arrested);
      data.append("protestor", protestor);
      data.append("roadClosure", roadClosure.toString());
      data.append("isFeatured", isFeatured.toString());
      data.append("location", location);
      data.append("city", selectedCity.value);
      data.append("country", selectedCountry.value);
      data.append("province", selectedProvince.value);
      data.append("riskLevel", selectedRiskLevel.value);
      data.append("date", date);
      data.append("target", target);
      data.append("damage", damage);
      data.append("responsibility", responsibility);
      data.append("modusOperandi", modusOperandi);
      data.append("dateFormat", moment(date).format("DD/MM/YYYY"));
      data.append("monthFormat", moment(date).format("YYYYMM"));
      data.append("time", moment(date).format("hh:mm A"));
      images.forEach((item) => {
        data.append("images", item);
      });

      let response = await ApiCall.post(
        Url.STORE_EVENT,
        data,
        await multipartConfig()
      );
      if (response.status === 200) {
        this.setState(initialState);
        this.setState({ images: null });
        this.props.history.push("/app/event/view");
        return NotificationManager.success(
          "Event Created Successfully",
          "Success",
          3000,
          null,
          null,
          "filled"
        );
      } else {
        this.setState({ loading: false });
      }
    } else {
      return NotificationManager.error(
        validation.message,
        "Error",
        3000,
        null,
        null,
        "filled"
      );
    }
  };
  handleValidations = () => {
    const {
      title,
      description,
      images,
      selectedCategory,
      selectedMainCategory,
      location,
      selectedProvince,
      selectedCountry,
      selectedCity,
      selectedRiskLevel,
      target,
      responsibility,
      modusOperandi,
      damage,
    } = this.state;
    let targetValidation = {
      message: "Please write Target",
      status: false,
    };
    let modusOperandiValidation = {
      message: "Please write ModusOperandi",
      status: false,
    };
    let responsibilityValidation = {
      message: "Please write Responsibility",
      status: false,
    };
    let categoryValidation = {
      message: "Please Select One Or More Sub-Category",
      status: false,
    };
    let categoryMainValidation = {
      message: "Please Select Category",
      status: false,
    };
    let descriptionValidation = {
      message: "Please add description",
      status: false,
    };
    let imageValidation = {
      message: "Please select at least one image",
      status: false,
    };
    let titleValidation = {
      message: "Please write Title",
      status: false,
    };
    let locationValidation = {
      message: "Please write Location",
      status: false,
    };
    let riskValidation = {
      message: "Please Select Risk Level",
      status: false,
    };
    let provinceMainValidation = {
      message: "Please Select Province",
      status: false,
    };
    let countryMainValidation = {
      message: "Please Select Country",
      status: false,
    };
    let cityMainValidation = {
      message: "Please Select City",
      status: false,
    };
    let damageValidation = {
      message: "Please Write Damage",
      status: false,
    };
    let passed = {
      status: true,
    };
    return title !== ""
      ? selectedMainCategory.length == 0
        ? categoryMainValidation
        : selectedCategory.length == 0
        ? categoryValidation
        : selectedCategory === ""
        ? categoryValidation
        : description === ""
        ? descriptionValidation
        : location === ""
        ? locationValidation
        : target === ""
        ? targetValidation
        : responsibility === ""
        ? responsibilityValidation
        : modusOperandi === ""
        ? modusOperandiValidation
        : selectedCountry.length == 0
        ? countryMainValidation
        : selectedProvince.length == 0
        ? provinceMainValidation
        : selectedCity.length == 0
        ? cityMainValidation
        : selectedRiskLevel === ""
        ? riskValidation
        : damage === ""
        ? damageValidation
        : // images.length == 0? imageValidation :
          passed
      : titleValidation;
  };

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSelectTypeChange = (e) => {
    if (e.target.value !== "null") {
      this.setState({ selectedType: e.target.value });
    } else {
      this.setState({ selectedType: "" });
    }
  };
  handleRoadClosureChange = (e) => {
    this.setState({
      roadClosure: e.target.checked,
    });
  };
  handleFeaturedChange = (e) => {
    this.setState({
      isFeatured: e.target.checked,
    });
  };

  handleChangeContent = (content) => {
    this.setState({ description: content });
  };
  updateEditorState = (editorState, fieldName) => {
    // console.log(editorState)
    this.setState({ description: editorState });
  };

  handleChangeCategories = (selectedCategory) => {
    this.setState({ selectedCategory });
  };

  handleChangeCity = (selectedCity) => {
    this.setState({ selectedCity });
  };

  handleChangeMainCategories = async (selectedMainCategory) => {
    this.setState({ selectedCategory: "" });
    this.setState({ selectedMainCategory });
    this.setState({
      isLoading: true,
    });
    if (selectedMainCategory.length === 0) {
      this.setState({ status: false, isLoading: false });
      return null;
    }

    const id = selectedMainCategory.value;

    let response = await ApiCall.get(
      `${Url.SINGLE_SUB_CATEGORIES_OPEN}/${id}`,
      await config()
    );
    if (response.status === 200) {
      if (!this._isMounted) {
        this.setState({
          categories: response.data.subCategory,
          status: false,
          isLoading: false,
        });
      }
    }
  };
  handleChangeCountry = async (selectedCountry) => {
    this.setState({ selectedProvince: "" });
    this.setState({ selectedCity: "" });
    this.setState({ statusCountry: true });
    this.setState({ statusCity: true });
    this.setState({ selectedCountry });
    this.setState({
      isLoadingCountry: true,
    });
    if (selectedCountry.length === 0) {
      this.setState({ statusCountry: false, isLoadingCountry: false });
      return null;
    }

    const id = selectedCountry.value;

    let response = await ApiCall.get(
      `${Url.ALL_PROVINCES}/${id}`,
      await config()
    );
    if (response.status === 200) {
      if (!this._isMounted) {
        this.setState({
          provinces: response.data.countries,
          statusCountry: false,
          isLoadingCountry: false,
        });
      }
    }
  };
  handleChangeProvince = async (selectedProvince) => {
    this.setState({ statusCity: true });
    this.setState({ selectedCity: "" });
    this.setState({ selectedProvince });
    this.setState({
      isLoadingCity: true,
    });
    if (selectedProvince.length === 0) {
      this.setState({ statusCity: false, isLoadingCity: false });
      return null;
    }

    const id = selectedProvince.value;

    let response = await ApiCall.get(`${Url.ALL_CITIES}/${id}`, await config());
    if (response.status === 200) {
      if (!this._isMounted) {
        this.setState({
          cities: response.data.cities,
          statusCity: false,
          isLoadingCity: false,
        });
      }
    }
  };

  handleChangeRiskLevel = (selectedRiskLevel) => {
    this.setState({ selectedRiskLevel });
  };

  handleChangeImages = (file) => {
    let files = this.state.images;
    files.push(file);
    this.setState({
      images: files,
    });
  };
  removeImage = (file) => {
    let images = this.state.images.filter((item) => item !== file);
    if (file) {
      this.setState({
        images,
      });
    }
  };

  handleChangeDate = (date) => {
    this.setState({
      date: date._d,
    });
  };

  render() {
    const {
      title,
      description,
      status,
      isLoading,
      statusCity,
      isLoadingCity,
      statusCountry,
      isLoadingCountry,
      categories,
      selectedCategory,
      mainCategory,
      selectedMainCategory,
      killed,
      injured,
      arrested,
      isFeatured,
      protestor,
      roadClosure,
      provinces,
      selectedProvince,
      cities,
      selectedCity,
      location,
      riskLevel,
      selectedRiskLevel,
      date,
      time,
      spinning,
      target,
      damage,
      responsibility,
      modusOperandi,
      selectedCountry,
      countries,
    } = this.state;
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <div className="text-zero top-right-button-container">
              <Link to="/app/event/view">
                <Button size="lg" color={"secondary"}>
                  <IntlMessages id={"menu.cancel"} />
                </Button>
              </Link>
            </div>
            <Breadcrumb heading="guides.create" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        {spinning ? (
          <div className="loading" />
        ) : (
          <Row>
            <Col xxs="10">
              <div className="col-sm-12 col-lg-10 col-xs-12 ">
                <Card>
                  <div className="position-absolute card-top-buttons"></div>
                  <CardBody>
                    <CardTitle>Create Event</CardTitle>
                    <Form
                      className="dashboard-quick-post"
                      onSubmit={this.createEvent}
                    >
                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.title" /> *
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={title}
                            onChange={this.handleInputChange}
                            name="title"
                            placeholder={"Title *"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">Description *</Label>
                        <Colxx sm="9">
                          {/*<ReactQuill*/}
                          {/*    theme="snow"*/}
                          {/*    value={description}*/}
                          {/*    onChange={this.handleChangeContent}*/}
                          {/*    modules={quillModules}*/}
                          {/*    formats={quillFormats}/>*/}
                          <TextEditor
                            // label="Title Summary"
                            fieldName="description"
                            updateEditorState={this.updateEditorState}
                          />
                        </Colxx>
                      </FormGroup>
                      {/*//categories*/}

                      <FormGroup row>
                        <Label sm="3">
                          Select Category *
                          {/*<IntlMessages id="closed-Opened"/>**/}
                        </Label>
                        <Colxx sm="9">
                          <Select
                            components={{ Input: CustomSelectInput }}
                            className="react-select"
                            classNamePrefix="react-select"
                            placeHoleder={"Please Select Event Category"}
                            name="form-field-name"
                            value={selectedMainCategory}
                            onChange={this.handleChangeMainCategories}
                            options={mainCategory.map((item) => {
                              return {
                                label: item.name,
                                value: item._id,
                                key: item._id,
                              };
                            })}
                          />
                        </Colxx>
                      </FormGroup>

                      {/*//subcategories*/}
                      <FormGroup row>
                        <Label sm="3">
                          Select Sub-Categories *
                          {/*<IntlMessages id="closed-Opened"/>**/}
                        </Label>
                        <Colxx sm="9">
                          <SelectComponent
                            isLoading={isLoading}
                            isDisabled={status}
                            isMulti
                            placeHoleder={"Please Select Event Sub-Categories"}
                            value={selectedCategory}
                            onChange={this.handleChangeCategories}
                            options={categories.map((item) => {
                              return {
                                label: item.name,
                                value: item._id,
                                key: item._id,
                              };
                            })}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">Date</Label>
                        <Colxx sm="9">
                          <DateTime
                            className="mb-5"
                            value={date}
                            onChange={this.handleChangeDate}
                          />
                        </Colxx>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm="3">Select Country *</Label>
                        <Colxx sm="9">
                          <Select
                            components={{ Input: CustomSelectInput }}
                            className="react-select"
                            classNamePrefix="react-select"
                            placeHoleder={"Please Select Event Category"}
                            name="form-field-name"
                            value={selectedCountry}
                            onChange={this.handleChangeCountry}
                            options={countries.map((item) => {
                              return {
                                label: item.name,
                                value: item._id,
                                key: item._id,
                              };
                            })}
                          />
                        </Colxx>
                      </FormGroup>

                      {/*//provinces*/}

                      <FormGroup row>
                        <Label sm="3">Select Province *</Label>
                        <Colxx sm="9">
                          <SelectComponent
                            isLoading={isLoadingCountry}
                            isDisabled={statusCountry}
                            placeHoleder={"Please Select Country"}
                            value={selectedProvince}
                            onChange={this.handleChangeProvince}
                            options={provinces.map((item) => {
                              return {
                                label: item.name,
                                value: item._id,
                                key: item._id,
                              };
                            })}
                          />
                          {/*<Select*/}
                          {/*    components={{ Input: CustomSelectInput }}*/}
                          {/*    className="react-select"*/}
                          {/*    classNamePrefix="react-select"*/}
                          {/*    placeHoleder={'Please Select Event Category'}*/}
                          {/*    name="form-field-name"*/}
                          {/*    value={selectedProvince}*/}
                          {/*    onChange={this.handleChangeProvince}*/}
                          {/*    options={provinces.map(item => {*/}
                          {/*        return {label: item.name, value: item._id, key: item._id}*/}
                          {/*    })}*/}
                          {/*/>*/}
                        </Colxx>
                      </FormGroup>

                      {/*//cities*/}
                      <FormGroup row>
                        <Label sm="3">
                          Select City *{/*<IntlMessages id="closed-Opened"/>**/}
                        </Label>
                        <Colxx sm="9">
                          <SelectComponent
                            isLoading={isLoadingCity}
                            isDisabled={statusCity}
                            placeHoleder={"Please Select City"}
                            value={selectedCity}
                            onChange={this.handleChangeCity}
                            options={cities.map((item) => {
                              return {
                                label: item.name,
                                value: item._id,
                                key: item._id,
                              };
                            })}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.location" /> *
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={location}
                            onChange={this.handleInputChange}
                            name="location"
                            placeholder={"location *"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">Images</Label>
                        <Colxx sm="9">
                          <MultipleDropzoneExample
                            fileTypes="image/*"
                            onChange={this.handleChangeImages}
                            removeFile={this.removeImage}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.injured" />
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={injured}
                            onChange={this.handleInputChange}
                            name="injured"
                            placeholder={"Injured"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.killed" />
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={killed}
                            onChange={this.handleInputChange}
                            name="killed"
                            placeholder={"killed"}
                          />
                        </Colxx>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.arrested" />
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={arrested}
                            onChange={this.handleInputChange}
                            name="arrested"
                            placeholder={"Arrested"}
                          />
                        </Colxx>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.protestor" />
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={protestor}
                            onChange={this.handleInputChange}
                            name="protestor"
                            placeholder={"Protestor"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">
                          Select Risk Level *
                          {/*<IntlMessages id="closed-Opened"/>**/}
                        </Label>
                        <Colxx sm="9">
                          <Select
                            components={{ Input: CustomSelectInput }}
                            className="react-select"
                            classNamePrefix="react-select"
                            placeHolder={"Please Select Post Categories*"}
                            name="form-field-name"
                            value={selectedRiskLevel}
                            onChange={this.handleChangeRiskLevel}
                            options={riskLevel.map((item, index) => {
                              return {
                                label: item.label,
                                value: item.value,
                                key: item.value,
                              };
                            })}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">
                          RoadClosure
                          {/*<IntlMessages id="guide.category"/>*/}
                        </Label>
                        <Colxx sm="9">
                          <CustomInput
                            type="checkbox"
                            key={"roadclosure"}
                            name="isRoadClosure"
                            checked={roadClosure}
                            onChange={this.handleRoadClosureChange}
                            id={"isRoadClosure"}
                            label={"is RoadClosure"}
                          />
                        </Colxx>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm="3">Target *</Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={target}
                            onChange={this.handleInputChange}
                            name="target"
                            placeholder={"Target"}
                          />
                        </Colxx>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm="3">Damage *</Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={damage}
                            onChange={this.handleInputChange}
                            name="damage"
                            placeholder={"Damage"}
                          />
                        </Colxx>
                      </FormGroup>
                      <FormGroup row>
                        <Label sm="3">Militant ORG *</Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={responsibility}
                            onChange={this.handleInputChange}
                            name="responsibility"
                            placeholder={"Miltant Organization"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">Modus Operandi *</Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={modusOperandi}
                            onChange={this.handleInputChange}
                            name="modusOperandi"
                            placeholder={"Modus Operandi"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">Featured</Label>
                        <Colxx sm="9">
                          <CustomInput
                            type="checkbox"
                            key={"isFeatured"}
                            name="isFeatured"
                            checked={isFeatured}
                            onChange={this.handleFeaturedChange}
                            id={"isFeatured"}
                            label={"is Featured"}
                          />
                        </Colxx>
                      </FormGroup>

                      {/**/}
                      <Button
                        className={`float-right btn-shadow btn-multiple-state ${
                          this.state.loading ? "show-spinner" : ""
                        }`}
                        color="primary"
                        disabled={this.state.loading}
                      >
                        <span className="spinner d-inline-block">
                          <span className="bounce1" />
                          <span className="bounce2" />
                          <span className="bounce3" />
                        </span>
                        <span className="label">Create</span>
                      </Button>
                    </Form>
                  </CardBody>
                </Card>
              </div>
            </Col>
          </Row>
        )}
      </Fragment>
    );
  }
}
