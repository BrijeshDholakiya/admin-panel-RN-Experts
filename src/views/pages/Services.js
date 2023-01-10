import React, { useEffect, useState, useRef } from "react";
import classes from "./css/Service.module.css";
import classnames from "classnames";
import {
  Button,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledTooltip,
  Col,
} from "reactstrap";
import { Formik, FieldArray } from "formik";
import moment from "moment";

import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SimpleHeader from "../../components/Headers/SimpleHeader.js";
import {
  getServicesList,
  createService,
  deleteService,
  editService,
  getServiceById,
} from "../../store/actions/Services.js";
import { uploadImage } from "../../store/actions/Image";
import Swal from "sweetalert2";
import { useHistory } from "react-router";

const serviceSchema = Yup.object().shape({
  name: Yup.string().required("Name Required"),
  description: Yup.string().required("Description Required"),
  logo: Yup.string().required("Image URL is required"),
});

function Services() {
  const history = useHistory();
  const dispatch = useDispatch();
  const servicesList = useSelector(({ services }) => services.servicesList);
  const serviceById = useSelector(({ services }) => services.serviceById);

  const [modal, setModal] = useState(false);
  const [imgModal, setImgModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);
  const [isfile, setFile] = useState();
  const [selectedFile, setSelectedFile] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [search, setSearch] = useState("");
  const [isId, setIsId] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [filterServiceData, setFilterServiceData] = useState([]);

  const fileValue = useRef();
  let id;

  const toggle = () => {
    setModal(!modal);
  };
  const toggleNested = () => {
    setImgModal(!imgModal);
    setCloseAll(false);
  };

  const handleUploadClick = () => {
    setTimeout(() => {
      setUploaded(!uploaded);
    }, 1000);
  };

  /*********** ***** CODE FOR GET SERVICE BY ID *******  *************/

  useEffect(() => {
    dispatch(getServicesList());
  }, [dispatch, search, history.path]);

  /***************  UPLOAD IMAGE CODE HERE ******************/
  const handleFile = async (e) => {
    e.preventDefault();
    let filevalue = fileValue.current.files[0];
    const formData = new FormData();
    formData.append("image", filevalue);
    const resp = await dispatch(uploadImage(formData));
    if (resp.result) {
      setFile(resp?.result.url);
    } else {
      return null;
    }
  };
  ////////////////// FOR DELETING SERVICE /////////////////////////

  const dltService = (id) => {
    Swal.fire({
      title: "Do you really want to Delete?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteService(id));
      }
    });
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0].name);
  };

  var defaultvalues;

  const handleSearchById = (searchValue) => {
    setSearch(searchValue);

    if (searchValue !== "") {
      let serviceById = servicesList.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilterServiceData(serviceById);
    } else {
      setFilterServiceData(servicesList);
    }
  };

  useEffect(() => {
    if (history.location.pathname === "/admin/services") {
      dispatch(getServicesList());
    } else if (history.location.pathname !== "/admin/services") {
      let strArr = history.location.pathname.split("/");
      dispatch(getServiceById(strArr[3]));
    }
  }, [dispatch, history.location]);

  return (
    <div>
      <SimpleHeader name="Services" parentName="Dashboard">
        <Button
          className="btn-neutral createBtn"
          color="white"
          size="sm"
          onClick={toggle}
        >
          Create
        </Button>
      </SimpleHeader>
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              {serviceById === null && (
                <CardHeader
                  className="border-0 row justify-content-between mx-2"
                  style={{
                    backgroundColor: "#fff",
                    alignItems: "center",
                  }}
                >
                  <Col xl={6} lg={6} md={12}>
                    <h3 className="mb-0">Services</h3>
                  </Col>
                  <Col xl={6} lg={6} md={12}>
                    <div className="mb-1 d-flex float-right ">
                      <InputGroup
                        className="input-group-merge input-group-alternative mr-3"
                        style={{ width: "400px" }}
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="fa fa-search" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Search"
                          value={search}
                          onChange={(e) => handleSearchById(e.target.value)}
                          name="search"
                          id="search"
                          type="text"
                          style={{ color: "black" }}
                          className="text-black pb-4 pt-4 pl-2"
                          required
                          autoComplete="off"
                        />
                      </InputGroup>

                      <Button
                        className="btn m-2"
                        color="danger"
                        type="submit"
                        onClick={(event) => {
                          event.preventDefault();
                          setSearch("");
                        }}
                        size="sm"
                      >
                        Reset
                      </Button>
                    </div>
                  </Col>
                </CardHeader>
              )}

              <Table
                className="align-items-center table-flush "
                responsive
                hover
              >
                {serviceById === null ? (
                  <thead className="thead-light">
                    <tr>
                      <th className="sort" scope="col">
                        Index
                      </th>
                      <th className="sort" scope="col">
                        Name
                      </th>
                      <th className="sort" scope="col">
                        Description
                      </th>
                      <th className="sort" scope="col">
                        Features
                      </th>
                      <th className="sort" scope="col">
                        Logo
                      </th>
                      <th scope="col" />
                    </tr>
                  </thead>
                ) : (
                  ""
                )}

                {search.length > 1 ? (
                  <tbody className="list cursor-pointer">
                    {filterServiceData && filterServiceData.length === 0 && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          No record Found
                        </td>
                      </tr>
                    )}
                    {filterServiceData === null && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {filterServiceData &&
                      filterServiceData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">
                              {index + 1 <= 9
                                ? `0${index + 1}`
                                : `${index + 1}`}
                            </th>
                            <td>{item.name}</td>
                            <td>{item.description}</td>

                            {/* <td>{item.features}</td> */}
                            <td>
                              <img src={item.logo} alt="" width="50px" />
                            </td>
                            <td className="table-actions">
                              <span
                                className="table-action"
                                id="tooltip978979647"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  id = item._id;
                                  setIsId(id);
                                  delete item._id;
                                  delete item.admin;
                                  delete item.__v;
                                  delete item.date;
                                  defaultvalues = item;
                                  setSelectedValue(defaultvalues);
                                  toggle();
                                }}
                              >
                                <i className="fas fa-user-edit text-green" />
                              </span>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip978979647"
                              >
                                Edit Service
                              </UncontrolledTooltip>
                              <span
                                className="table-action table-action-delete"
                                id="tooltip664113958"
                                onClick={(e) => dltService(item._id)}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="fas fa-trash text-red" />
                              </span>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip664113958"
                              >
                                Delete Service
                              </UncontrolledTooltip>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                ) : serviceById && serviceById !== null ? (
                  // <Card>
                  // <CollapsibleTable />
                  <div className="serviceCard px-5 py-3  display-flex w-100">
                    <div className="w-50">
                      <img
                        src={serviceById.logo}
                        alt=""
                        width="70px"
                        className="mb-2"
                      />
                      <div>
                        <h1
                          style={{ fontFamily: "Poppins", fontWeight: "600" }}
                        >
                          {serviceById.name}
                        </h1>
                      </div>
                      <p>{serviceById.description}</p>
                      <p>{serviceById._id}</p>
                      <p>{serviceById.admin}</p>
                      <span>{moment(serviceById.date).format("LLLL")}</span>
                    </div>
                    <div className="w-25">
                      {serviceById.features.map((feature, index) => (
                        <p>{feature}</p>
                      ))}
                    </div>
                  </div>
                ) : (
                  <tbody
                    className="list cursor-pointer"
                    style={{ cursor: "pointer" }}
                  >
                    {servicesList && servicesList.length === 0 && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          No record Found
                        </td>
                      </tr>
                    )}
                    {servicesList === null && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {servicesList &&
                      servicesList.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">
                              {index + 1 <= 9
                                ? `0${index + 1}`
                                : `${index + 1}`}
                            </th>
                            <td className="budget">{data.name}</td>
                            <td className="budget">{data.description}</td>
                            <td>
                              {data.features.length === 1
                                ? data.features[0]
                                : `${data.features[0]}...`}
                            </td>
                            <td>
                              <img src={data.logo} alt="logo" width="40px" />
                            </td>
                            <td className="table-actions">
                              <span
                                className="table-action"
                                id="tooltip978979647"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  id = data._id;
                                  setIsId(id);
                                  delete data._id;
                                  delete data.admin;
                                  delete data.__v;
                                  delete data.date;
                                  defaultvalues = data;
                                  setSelectedValue(defaultvalues);
                                  toggle();
                                }}
                              >
                                <i className="fas fa-user-edit text-green text-xl" />
                              </span>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip978979647"
                              >
                                Edit Service
                              </UncontrolledTooltip>
                              <span
                                className="table-action table-action-delete"
                                id="tooltip664113958"
                                onClick={(e) => dltService(data._id)}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="fas fa-trash text-red text-xl px-2" />
                              </span>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip664113958"
                              >
                                Delete Service
                              </UncontrolledTooltip>

                              <span
                                className="table-action"
                                id="tooltip9789796478"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  history.push(`/admin/services/${data._id}`);
                                  dispatch(getServiceById(data._id));
                                }}
                              >
                                <i
                                  className="fa fa-info-circle text-gray text-xl"
                                  aria-hidden="true"
                                />
                              </span>
                              <UncontrolledTooltip
                                delay={0}
                                target="tooltip9789796478"
                              >
                                Detail Information
                              </UncontrolledTooltip>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                )}
              </Table>
            </Card>
          </div>
        </Row>
      </Container>

      <Modal
        isOpen={modal}
        toggle={(e) => {
          toggle();
          setSelectedValue(null);
        }}
        size="lg"
      >
        <ModalHeader
          toggle={(e) => {
            toggle();
            setSelectedValue(null);
          }}
        >
          {selectedValue ? "Edit Service" : "Create Service"}
        </ModalHeader>
        <Formik
          initialValues={
            selectedValue || {
              name: "",
              description: "",
              features: [""],
              logo: "",
            }
          }
          validationSchema={serviceSchema}
          enableReinitialize
          onSubmit={(values, { setSubmitting }) => {
            setSubmitting(true);
            const onSuccess = () => {
              toggle();
            };
            if (!selectedValue) {
              setTimeout(() => {
                dispatch(createService(values, setSubmitting, onSuccess));
              }, 2500);

              setTimeout(() => {
                setFile("");
              }, 3000);
            } else {
              let objId = isId;
              setTimeout(() => {
                dispatch(editService(values, objId, setSubmitting, onSuccess));
              }, 1000);

              setTimeout(() => {
                setFile("");
              }, 1400);
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form
              role="form"
              onSubmit={handleSubmit}
              autoComplete="new-password"
            >
              <ModalBody>
                <Col lg={12} md={6} sm={12}>
                  <FormGroup>
                    <InputGroup className="input-group-merge input-group-alternative ">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-circle-08 text-gray" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Name"
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className={`py-4 ${values.name.length > 0 && "input"}`}
                        style={{ fontSize: "1rem" }}
                      />
                    </InputGroup>
                    {errors.name && touched.name && (
                      <div style={{ color: "red" }}>{errors.name} </div>
                    )}
                  </FormGroup>
                </Col>

                <Col lg={12} md={6} sm={12}>
                  <FormGroup className={classnames("mb-3")}>
                    <InputGroup className="input-group-merge input-group-alternative ">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i
                            className="fa fa-paragraph text-gray"
                            aria-hidden="true"
                          />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Description of Service"
                        type="textarea"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        className={`py-4 pt-5 ${
                          values.description.length > 0 && "input"
                        }`}
                        style={{ fontSize: "1rem" }}
                      />
                    </InputGroup>
                    {errors.description && touched.description && (
                      <div style={{ color: "red" }}>{errors.description} </div>
                    )}
                  </FormGroup>
                </Col>

                <Col lg={12} md={6} sm={12}>
                  <FormGroup className={classnames("mb-3")}>
                    <InputGroup className="input-group-merge input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-image text-gray" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Logo URL"
                        type="text"
                        name="logo"
                        value={
                          selectedValue
                            ? isfile
                              ? (values.logo = `${process.env.REACT_APP_API_URL}${isfile}`)
                              : values.logo
                            : isfile
                            ? (values.logo = `${process.env.REACT_APP_API_URL}${isfile}`)
                            : ""
                        }
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        disabled={isSubmitting}
                        autoComplete="off"
                        className={`py-4 ${values.logo.length > 0 && "input"}`}
                        style={{ fontSize: "1rem" }}
                      />

                      <Button
                        color="secondary"
                        onClick={() => {
                          toggleNested();
                        }}
                        disabled={isSubmitting}
                      >
                        <i className="fa fa-upload" aria-hidden="true"></i>
                      </Button>
                    </InputGroup>
                    {errors.logo && touched.logo && (
                      <div style={{ color: "red" }}>{errors.logo} </div>
                    )}
                  </FormGroup>
                </Col>

                <Col lg={12} md={6} sm={12}>
                  <FieldArray name="features">
                    {({ remove, push }) => (
                      <React.Fragment>
                        <div className="my-2">Add Features Here</div>
                        {values.features.map((value, index) => {
                          return (
                            <FormGroup className={`mb-1`} key={index}>
                              <InputGroup className="input-group-merge input-group-alternative">
                                <InputGroupAddon addonType="prepend">
                                  <InputGroupText>
                                    <i
                                      className="fa fa-align-justify text-gray"
                                      aria-hidden="true"
                                    />
                                  </InputGroupText>
                                </InputGroupAddon>
                                <Input
                                  placeholder="Features"
                                  type="text"
                                  name={`features.${index}`}
                                  value={value}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  autoComplete="new-password"
                                  disabled={isSubmitting}
                                  className={`py-4 ${
                                    value.length > 0 && "input"
                                  }`}
                                  style={{ fontSize: "1rem" }}
                                />
                                <Button
                                  color="danger"
                                  onClick={() => remove(index)}
                                  disabled={isSubmitting}
                                  style={{ fontSize: "1rem", width: "42px" }}
                                >
                                  <i class="fa fa-times" aria-hidden="true"></i>
                                </Button>
                              </InputGroup>
                              {errors.features && touched.features && (
                                <div style={{ color: "red" }}>
                                  {errors.features}{" "}
                                </div>
                              )}
                            </FormGroup>
                          );
                        })}
                        <Button
                          color="primary"
                          onClick={() => push("")}
                          disabled={isSubmitting}
                          className="mt-3"
                        >
                          Add Features
                        </Button>
                      </React.Fragment>
                    )}
                  </FieldArray>
                </Col>
              </ModalBody>

              <ModalFooter>
                <Button color="success" type="submit" disabled={isSubmitting}>
                  {!selectedValue
                    ? isSubmitting
                      ? "Creating..."
                      : "Create"
                    : isSubmitting
                    ? "Updating..."
                    : "Update"}
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    toggle();
                    setSelectedValue(null);
                    setFile();
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
              {/* <pre>{JSON.stringify({ values, errors }, null, 4)}</pre> */}
            </Form>
          )}
        </Formik>
      </Modal>

      {/* **********************
                                  IMAGE UPLOAD MODAL FORM
                                                   ********************* */}
      <React.Fragment>
        <Modal
          isOpen={imgModal}
          toggle={toggleNested}
          onClosed={closeAll ? toggle : undefined}
          className={classes.modal}
        >
          <ModalHeader className={classes.modalHeader}>
            <span>Upload Image here:</span>
          </ModalHeader>
          <ModalBody className={`${classes.modalBody}`}>
            <form onSubmit={handleFile}>
              <label htmlFor="inputTag" className={classes.labelFile}>
                {selectedFile.length > 0 ? (
                  <p className={classes.selectedFile}>
                    <span className="googleSpan" style={{ color: "#3cba54" }}>
                      {selectedFile}
                    </span>
                  </p>
                ) : (
                  <p className={classes.selectedFile}>
                    <span
                      style={{
                        color: "#4885ed",
                      }}
                      className={classes.googleSpan}
                    >
                      Click
                    </span>
                    <span
                      style={{
                        color: "#db3236",
                      }}
                      className={classes.googleSpan}
                    >
                      here
                    </span>
                    <span
                      style={{
                        color: "#f4c20d",
                      }}
                      className={classes.googleSpan}
                    >
                      to
                    </span>
                    <span
                      style={{
                        color: "#4885ed",
                      }}
                      className={classes.googleSpan}
                    >
                      Upload{" "}
                    </span>
                    <span
                      style={{ color: "#3cba54" }}
                      className={classes.googleSpan}
                    >
                      Image
                    </span>
                  </p>
                )}
                <input
                  id="inputTag"
                  type="file"
                  ref={fileValue}
                  onChange={handleFileChange}
                  className={classes.inputFile}
                />
              </label>

              <Button
                color={uploaded ? "success" : "primary"}
                type="submit"
                className={classes.uploadBtn}
                onClick={handleUploadClick}
              >
                {uploaded ? "Image Uploaded" : "Upload Image"}
              </Button>
            </form>
          </ModalBody>
          <ModalFooter className={classes.modalFooter}>
            <Button
              color="success"
              onClick={() => {
                toggleNested();
                setUploaded(false);
                setSelectedFile("");
              }}
            >
              Done
            </Button>
            <Button
              color="danger"
              onClick={() => {
                toggleNested();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    </div>
  );
}

export default Services;
