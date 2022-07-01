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
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ApiCall from "../../../config/network";
import Url from "../../../config/api";
import { NotificationManager } from "../../../components/common/react-notifications";
import { config, multipartConfig } from "../../../config/env";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "react-quill/dist/quill.bubble.css";
import DropzoneExample from "../../../containers/forms/DropzoneExample";
import Select from "react-select";
import CustomSelectInput from "../../../components/common/CustomSelectInput";
import DatePicker from "react-datepicker";
import TimePicker from "react-time-picker";
import DateTime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import moment from "moment";
import SelectComponent from "../../../components/SelectComponent";
import MultipleDropzoneExample from "../../../containers/forms/MultipleDropzoneExample";
import "./style.scss";
import { confirmAlert } from "react-confirm-alert";
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
  killed: 0,
  injured: 0,
  arrested: 0,
  protestor: 0,
  roadClosure: "",
  location: "",
  statusProvince: true,
  isLoadingProvince: false,
  statusCountry: true,
  isLoadingCountry: false,
  provinces: [],
  cities: [],
  selectedProvince: [],
  selectedCity: "",
  riskLevels: ["Low", "Medium", "High", "Extreme"],
  riskLevel: "",
  selectedRiskLevel: "",
  date: moment(new Date()),
  loading: false,
  spinning: true,
  status: true,
  isFeatured: false,
  isLoading: false,
  statusCity: true,
  isLoadingCity: false,
  imageUrl: [],
  images: [],
  target: "",
  damage: "",
  responsibility: "",
  modusOperandi: "",
  selectedCountry: "",
  countries: [],
};

export default class UpdatePost extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this._isMounted = false;
    this.getSingleEvent();
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
          images: [],
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

  getSingleEvent = async () => {
    let response = await ApiCall.get(
      `${Url.EDIT_EVENT}/${this.props.match.params.slug}`,
      await config()
    );
    if (response.status === 200) {
      const event = response.data.event;
      this.setState({
        title: event.title,
        description: event.description,
        selectedMainCategory: {
          label: event.parentCategory[0].name,
          key: event.parentCategory[0]._id,
          value: event.parentCategory[0]._id,
        },
        selectedCategory: event.categories.map((item) => {
          return { label: item.name, key: item._id, value: item._id };
        }),
        selectedProvince: {
          label: event.province.name,
          key: event.province._id,
          value: event.province._id,
        },
        selectedCountry: {
          label: event.country.name,
          key: event.country._id,
          value: event.country._id,
        },
        selectedCity: {
          label: event.city.name,
          key: event.city._id,
          value: event.city._id,
        },
        killed: event.killed,
        injured: event.injured,
        arrested: event.arrested,
        protestor: event.protestor,
        roadClosure: event.roadClosure,
        location: event.location,
        riskLevel: {
          key: event.riskLevel,
          value: event.riskLevel,
          label: event.riskLevel,
        },
        date: event.date,
        time: event.time,
        imageUrl: event.images,
        target: event.target,
        damage: event.damage,
        responsibility: event.responsibility,
        modusOperandi: event.modusOperandi,
        isFeatured: event.isFeatured,
        spinning: false,
      });
    }
  };

  updatePost = async (e) => {
    e.preventDefault();
    const {
      title,
      description,
      statusCountry,
      isLoadingCountry,
      riskLevel,
      killed,
      injured,
      arrested,
      selectedProvince,
      selectedCity,
      images,
      protestor,
      roadClosure,
      location,
      date,
      target,
      damage,
      responsibility,
      modusOperandi,
      isFeatured,
      selectedCountry,
    } = this.state;
    let validation = this.handleValidations();
    if (validation.status) {
      let userSelectedCategory = this.state.selectedCategory.map(function (
        item
      ) {
        return item.value;
      });

      let userSelectedMainCategory = this.state.selectedMainCategory.value;
      console.log(userSelectedMainCategory);

      this.setState({ loading: true });
      const data = new FormData();

      data.append("title", title);
      data.append("description", description);
      data.append("categories", JSON.stringify(userSelectedCategory));
      data.append("parentCategory", userSelectedMainCategory);
      data.append("killed", killed);
      data.append("injured", injured);
      data.append("arrested", arrested);
      data.append("protestor", protestor);
      data.append("roadClosure", roadClosure.toString());
      data.append("country", selectedCountry.value);
      data.append("city", selectedCity.value);
      data.append("province", selectedProvince.value);
      data.append("location", location);
      data.append("riskLevel", riskLevel.value);
      data.append("date", date);
      data.append("target", target);
      data.append("damage", damage);
      data.append("responsibility", responsibility);
      data.append("modusOperandi", modusOperandi);
      data.append("dateFormat", moment(date).format("L"));
      data.append("isFeatured", isFeatured.toString());
      data.append("monthFormat", moment(date).format("YYYYMM"));
      data.append("time", moment(date).format("LTS"));
      images.forEach((item) => {
        data.append("images", item);
      });
      let response = await ApiCall.post(
        `${Url.UPDATE_EVENT}/${this.props.match.params.slug}`,
        data,
        await multipartConfig()
      );
      if (response.status === 200) {
        this.setState(initialState);
        this.setState({ images: [] });
        this.props.history.push("/app/event/view");
        return NotificationManager.success(
          "Event Updated Successfully",
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
      selectedCategory,
      location,
      riskLevel,
      damage,
      target,
      responsibility,
      modusOperandi,
      selectedProvince,
      selectedCountry,
      selectedCity,
    } = this.state;
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
      message: "Please Select One Or More Category",
      status: false,
    };
    let descriptionValidation = {
      message: "Please add description",
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
    let damageValidation = {
      message: "Please Write Damage",
      status: false,
    };
    let passed = {
      status: true,
    };
    return title !== ""
      ? selectedCategory === ""
        ? categoryValidation
        : selectedCategory.length == 0
        ? categoryValidation
        : description === ""
        ? descriptionValidation
        : location === ""
        ? locationValidation
        : riskLevel === ""
        ? riskValidation
        : target === ""
        ? targetValidation
        : responsibility === ""
        ? responsibilityValidation
        : damage === ""
        ? damageValidation
        : modusOperandi === ""
        ? modusOperandiValidation
        : selectedCountry.length == 0
        ? countryMainValidation
        : selectedProvince.length == 0
        ? provinceMainValidation
        : selectedCity.length == 0
        ? cityMainValidation
        : passed
      : titleValidation;
  };

  handleInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSelectAuthorChange = (e) => {
    if (e.target.value !== "null") {
      this.setState({ selectedAuthor: e.target.value });
    } else {
      this.setState({ selectedAuthor: "" });
    }
  };

  handleSelectTypeChange = (e) => {
    if (e.target.value !== "null") {
      this.setState({ selectedType: e.target.value });
    } else {
      this.setState({ selectedType: "" });
    }
  };

  handleFeaturedChange = (e) => {
    this.setState({
      isFeatured: e.target.checked,
    });
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

  handleRoadClosureChange = (e) => {
    this.setState({
      roadClosure: e.target.checked,
    });
  };

  handleChangeRiskLevel = (riskLevel) => {
    this.setState({ riskLevel });
  };

  handleChangeContent = (content) => {
    this.setState({ description: content });
  };
  handleFeaturedChange = (e) => {
    this.setState({
      isFeatured: e.target.checked,
    });
  };

  updateEditorState = (editorState, fieldName) => {
    // console.log(editorState)
    this.setState({ description: editorState });
  };

  handleChangeMainCategories = async (selectedMainCategory) => {
    this.setState({ selectedCategory: "" });
    this.setState({ selectedMainCategory });
    this.setState({
      isLoading: true,
    });

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

  handleChangeCategories = (selectedCategory) => {
    this.setState({ selectedCategory });
  };

  handleChangeDate = (date) => {
    this.setState({
      date: date._d,
    });
  };

  ConfirmDeleteImage = async (item) => {
    const eventId = this.props.match.params.slug;
    this.setState({ spinning: true });
    let response = await ApiCall.post(
      `${Url.DELETE_EVENT_IMAGE_SINGLE}/${eventId}`,
      {
        name: item,
      },
      await config()
    );
    if (response.status === 200) {
      this.setState({ spinning: false });
      this.getSingleEvent();
      return NotificationManager.success(
        "Event Image deleted Successfully",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    } else if (response.status === 204) {
      this.setState({ spinning: false });
      return NotificationManager.error(
        "Event Image Already Deleted.",
        "Success",
        3000,
        null,
        null,
        "filled"
      );
    }
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
  removeMoneyReqFile = (item) => {
    confirmAlert({
      title: "Confirmation!",
      message: "Are you sure you want to Delete ?",
      buttons: [
        {
          label: "Yes",
          onClick: () => this.ConfirmDeleteImage(item),
        },
        {
          label: "No",
        },
      ],
    });
  };
  handleChangeCity = (selectedCity) => {
    this.setState({ selectedCity });
  };
  render() {
    const {
      isLoading,
      status,
      title,
      description,
      categories,
      selectedCategory,
      selectedMainCategory,
      mainCategory,
      killed,
      injured,
      arrested,
      protestor,
      roadClosure,
      provinces,
      selectedProvince,
      cities,
      selectedCity,
      location,
      riskLevels,
      riskLevel,
      date,
      spinning,
      statusCity,
      isLoadingCity,
      isFeatured,
      target,
      damage,
      responsibility,
      modusOperandi,
      selectedCountry,
      countries,
      statusCountry,
      isLoadingCountry,
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
            <Breadcrumb heading="guides.edit" match={this.props.match} />
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
                    <CardTitle>Update Event</CardTitle>
                    <Form
                      className="dashboard-quick-post"
                      onSubmit={this.updatePost}
                    >
                      <FormGroup row>
                        <Label sm="3">
                          <IntlMessages id="guide.title" />
                        </Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={title}
                            onChange={this.handleInputChange}
                            name="title"
                            placeholder={"Title *"}
                            required
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
                            data={description}
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

                      {/*sub categories*/}
                      <FormGroup row>
                        <Label sm="3">
                          Select Categories *
                          {/*<IntlMessages id="closed-Opened"/>**/}
                        </Label>
                        <Colxx sm="9">
                          <Select
                            isLoading={isLoading}
                            isDisabled={status}
                            components={{ Input: CustomSelectInput }}
                            className="react-select"
                            classNamePrefix="react-select"
                            isMulti
                            placeHoleder={"Please Select Post Categories"}
                            name="form-field-name"
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
                            placeHoleder={"Please Select Event Country"}
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
                            placeholder={"Location *"}
                          />
                        </Colxx>
                      </FormGroup>

                      <FormGroup row>
                        <Label sm="3">Image</Label>
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
                            placeHolder={"Please Select Risk Level*"}
                            name="form-field-name"
                            value={riskLevel}
                            onChange={this.handleChangeRiskLevel}
                            options={riskLevels.map((item) => {
                              return { label: item, value: item, key: item };
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
                        <Label sm="3">Militant ORG*</Label>
                        <Colxx sm="9">
                          <Input
                            type="text"
                            value={responsibility}
                            onChange={this.handleInputChange}
                            name="responsibility"
                            placeholder={"Militant Organization"}
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

                      {this.state.imageUrl.length > 0 && (
                        <Row className={"mb-5"}>
                          <Label sm="3">Images of this Event</Label>
                          <Colxx sm="9">
                            <Card className="mb-4">
                              <CardBody>
                                <div className="image-wrapper">
                                  {this.state.imageUrl.map((item, index) => {
                                    return (
                                      <div key={index}>
                                        {/*<span className={'remove-image-icon mb-1'} onClick={()=>this.removeMoneyReqFile(item)}/>*/}
                                        {
                                          <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                          >
                                            <figure className="image-fig image-1">
                                              <img
                                                style={{
                                                  height: "100px",
                                                  width: "100px",
                                                  objectFit: "contain",
                                                  cursor: "pointer",
                                                }}
                                                src={item}
                                                alt="1"
                                              />
                                            </figure>
                                          </a>
                                        }
                                        <span
                                          className={"btn btn-danger btn-xs"}
                                          onClick={() =>
                                            this.removeMoneyReqFile(item)
                                          }
                                          style={{ cursor: "pointer" }}
                                        >
                                          Remove
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </CardBody>
                            </Card>
                          </Colxx>
                        </Row>
                      )}

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
                        <span className="label">Update</span>
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
