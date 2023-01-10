import React, { useEffect, useState, useRef } from "react";
import classnames from "classnames";
import classes from "./css/Service.module.css";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Button,
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Col,
  UncontrolledTooltip,
} from "reactstrap";
import { FieldArray, Formik, Form } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill";
import "../../../node_modules/react-quill/dist/quill.snow.css";

import {
  getProjectsList,
  createProject,
  deleteProject,
  editProject,
  getProjectByTag,
} from "../../store/actions/Projects";
import { uploadImage } from "../../store/actions/Image";

import SimpleHeader from "../../components/Headers/SimpleHeader.js";

let emptyFeatures = { name: "", text: "", icon: "" };

const modules = {
  toolbar: [
    // [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ script: "sub" }, { script: "super" }],
    [
      {
        color: [
          "#000000",
          "#e60000",
          "#ff9900",
          "#ffff00",
          "#008a00",
          "#0066cc",
          "#9933ff",
          "#ffffff",
          "#facccc",
          "#ffebcc",
          "#ffffcc",
          "#cce8cc",
          "#cce0f5",
          "#ebd6ff",
          "#bbbbbb",
          "#f06666",
          "#ffc266",
          "#ffff66",
          "#66b966",
          "#66a3e0",
          "#c285ff",
          "#888888",
          "#a10000",
          "#b26b00",
          "#b2b200",
          "#006100",
          "#0047b2",
          "#6b24b2",
          "#444444",
          "#5c0000",
          "#663d00",
          "#666600",
          "#003700",
          "#002966",
          "#3d1466",
          "custom-color",
        ],
      },
    ],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    // { indent: "-1" }, { indent: "+1" },
    // ["clean"],
  ],
};

const projectSchema = Yup.object().shape({
  name: Yup.string().required("Name Required"),
  image: Yup.string().required("Image URL is Required"),
  cover_image: Yup.string().required("Cover_Image URL is Required"),
  about: Yup.string().required("About is Required"),
  description: Yup.string().required("Description is Required"),
  tag: Yup.string("Tag must be Unique"),
  seo: Yup.string(),
  features: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is Required"),
      text: Yup.string().required("Text is Required"),
      icon: Yup.string().required("Icon is required"),
    })
  ),
});

function Projects() {
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isId, setIsId] = useState("");
  const [imgModal, setImgModal] = useState(false);
  const [closeAll, setCloseAll] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [coverImgUrl, setCoverImgUrl] = useState();
  const [iconFileArr, setIconFileArr] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);
  const [filterPrData, setFilterPrData] = useState([]);
  const [imageClickText, setImageClickText] = useState("");
  const [iconClick, setIconClick] = useState(0);
  const [value, setValue] = useState("");

  const fileValue = useRef();
  const history = useHistory();

  const dispatch = useDispatch();
  const projectsList = useSelector(({ projects }) => projects.projectsList);
  const projectByTag = useSelector(({ projects }) => projects.projectByTag);

  let id;
  var defaultvalues;

  const toggle = () => setModal(!modal);

  const toggleNested = () => {
    setImgModal(!imgModal);
    setCloseAll(false);
  };

  const handleUploadClick = () => {
    setTimeout(() => {
      setUploaded(!uploaded);
    }, 1000);
  };

  /***************  UPLOAD IMAGE CODE HERE ******************/

  const handleFile = async (e) => {
    e.preventDefault();
    let filevalue = fileValue.current.files[0];
    // console.log(filevalue, "filevalueeeeeeeeeeee");

    const formData = new FormData();

    formData.append("image", filevalue);

    let resp = await dispatch(uploadImage(formData));

    if (resp.result) {
      if (imageClickText === "IMAGE") {
        setImageUrl(resp?.result.url);
      } else if (imageClickText === "COVER_IMAGE") {
        setCoverImgUrl(resp?.result.url);
      } else if (imageClickText === "FEATURE_ICON") {
        var check = true;
        if (iconFileArr?.length > 1) {
          for (let i = 1; i < iconFileArr?.length; i++) {
            if (i === iconClick) {
              iconFileArr[
                i
              ] = `${process.env.REACT_APP_API_URL}${resp?.result.url}`;
              check = false;
            }
          }
        }

        if (check !== false) {
          if (
            iconFileArr?.length === 0 &&
            iconFileArr[0] === undefined &&
            0 === iconClick
          ) {
            console.warn(iconFileArr[0], " 1555 dkjfkdsjfkljjkljkdfjjf");
            iconFileArr.push(
              `${process.env.REACT_APP_API_URL}${resp?.result.url}`
            );
          } else if (
            0 === iconClick &&
            iconFileArr[0] !== undefined &&
            iconFileArr.length > 0
          ) {
            iconFileArr[0] = `${process.env.REACT_APP_API_URL}${resp?.result.url}`;
            console.warn(iconFileArr[0], " 161111 dkjfkdsjfkljjkljkdfjjf");
          } else {
            iconFileArr.push(
              `${process.env.REACT_APP_API_URL}${resp?.result.url}`
            );
          }
        }
      }
    } else {
      return null;
    }
  };

  /***************  SELECTED FILE NAME FUNCTION ******************/
  const handleFileChange = (e) => setSelectedFile(e.target.files[0].name);

  /*************** CALLING PROJECTLIST FUNCTION INSIDE USEEFFECT ******************/
  useEffect(() => {
    dispatch(getProjectsList());
  }, [dispatch, search]);

  /********************* FUNCTION FOR DELETING PROJECT  ************************/
  const dltProject = (id) => {
    Swal.fire({
      title: "Do you really want to Delete?",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteProject(id));
      }
    });
  };

  const handleSearchById = (searchValue) => {
    setSearch(searchValue);

    if (searchValue !== "") {
      let projectById = projectsList.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilterPrData(projectById);
    } else {
      setFilterPrData(projectsList);
    }
  };

  useEffect(() => {
    if (history.location.pathname === "/admin/projects") {
      dispatch(getProjectsList());
    } else if (history.location.pathname !== "/admin/projects") {
      let strArr = history.location.pathname.split("/");
      dispatch(getProjectByTag(strArr[3]));
    }
  }, [dispatch, history.location]);

  return (
    <>
      <SimpleHeader name="Projects" parentName="Dashboard">
        <Button
          className="btn-neutral createBtn"
          color="default"
          size="md"
          onClick={() => {
            toggle();
            if (value?.length > 0) {
              setValue("");
              setSelectedValue(null);
              setIconFileArr([]);
              setImageUrl();
              setCoverImgUrl();
            }
          }}
        >
          Create
        </Button>
      </SimpleHeader>

      {/******************** 
                             GET-PROJECT-CARD-DATA SECTION
                                                        ***********************/}
      <Container className="mt--6" fluid>
        <Row>
          <div className="col">
            <Card>
              <CardHeader
                className="border-0 row justify-content-between mx-1"
                style={{
                  backgroundColor: "#fff",
                  alignItems: "center",
                }}
              >
                <Col xl={6} lg={6} md={12}>
                  <h3 className="mb-0">Projects</h3>
                </Col>

                <Col xl={6} lg={6} md={12}>
                  <form className="mb-1 d-flex float-right ">
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
                  </form>
                </Col>
              </CardHeader>

              <Table
                className="align-items-center table-flush"
                responsive
                hover
              >
                <thead className="thead-light">
                  <tr>
                    <th className="sort" scope="col">
                      INDEX
                    </th>
                    <th className="sort" scope="col">
                      Project Name
                    </th>
                    <th className="sort" scope="col">
                      Image
                    </th>
                    <th className="sort" scope="col">
                      Cover Image
                    </th>
                    <th className="sort" scope="col">
                      About
                    </th>
                    <th className="sort" scope="col">
                      Description
                    </th>
                    <th className="sort" scope="col">
                      Unique Tag
                    </th>
                    <th className="sort" scope="col">
                      SEO Description
                    </th>
                    <th className="sort" scope="col">
                      Feature Name
                    </th>
                    <th className="sort" scope="col">
                      Feature Text
                    </th>
                    <th className="sort" scope="col">
                      Feature Icon
                    </th>
                    <th scope="col" />
                  </tr>
                </thead>

                {search?.length > 1 ? (
                  <tbody className="list" style={{ cursor: "pointer" }}>
                    {filterPrData && filterPrData?.length === 0 && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          No record Found
                        </td>
                      </tr>
                    )}
                    {!filterPrData && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {filterPrData &&
                      filterPrData.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th>
                              {index + 1 <= 9
                                ? `0${index + 1}`
                                : `${index + 1}`}
                            </th>
                            <td>{item.name}</td>
                            <td>
                              <img src={item.image} alt="" width="50px" />
                            </td>
                            <td>
                              <img src={item.cover_image} alt="" width="50px" />
                            </td>
                            <td>{item.about}</td>
                            <td>{item.description.substring(0, 100)}...</td>
                            <td>{item.tag}</td>
                            <td>{item.seo}</td>
                            <td>{item.features[0].name}</td>
                            <td>{item.features[0].text}</td>
                            <td>
                              <img
                                src={item.features[0].icon}
                                alt=""
                                width="50px"
                              />
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

                                  item?.features?.length > 0 &&
                                    item.features.map((feature, idx) => {
                                      return delete feature._id;
                                    });

                                  for (
                                    let i = 0;
                                    i < item?.features?.length;
                                    i++
                                  ) {
                                    let features = item.features[i];
                                    iconFileArr.push(features.icon);
                                  }

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
                                onClick={(e) => dltProject(item._id)}
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
                ) : projectByTag && projectByTag !== null ? (
                  <tbody className="list" style={{ cursor: "pointer" }}>
                    <tr>
                      <th>01</th>
                      <td>{projectByTag.name}</td>
                      <td>
                        <img src={projectByTag.image} alt="" width="50px" />
                      </td>
                      <td>
                        <img
                          src={projectByTag.cover_image}
                          alt=""
                          width="50px"
                        />
                      </td>
                      <td>{projectByTag.about}</td>
                      <td>{projectByTag.description.substring(0, 100)}...</td>
                      <td>{projectByTag.tag}</td>
                      <td>{projectByTag.seo}</td>
                      <td>{projectByTag.features[0].name}</td>
                      <td>{projectByTag.features[0].text}</td>
                      <td>
                        <img
                          src={projectByTag.features[0].icon}
                          alt=""
                          width="50px"
                        />
                      </td>
                      <td className="table-actions">
                        <span
                          className="table-action"
                          id="tooltip978979647"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            id = projectByTag._id;
                            setIsId(id);
                            delete projectByTag._id;
                            delete projectByTag.admin;
                            delete projectByTag.__v;
                            delete projectByTag.date;

                            projectByTag?.features?.length > 0 &&
                              projectByTag.features.map((feature, idx) => {
                                return delete feature._id;
                              });

                            for (
                              let i = 0;
                              i < projectByTag?.features?.length;
                              i++
                            ) {
                              let features = projectByTag.features[i];
                              iconFileArr.push(features.icon);
                            }

                            defaultvalues = projectByTag;
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
                          onClick={(e) => dltProject(projectByTag._id)}
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
                  </tbody>
                ) : (
                  <tbody className="list" style={{ cursor: "pointer" }}>
                    {projectsList && projectsList?.length === 0 && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          No record Found
                        </td>
                      </tr>
                    )}
                    {projectsList === null && (
                      <tr style={{ minWidth: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {projectsList &&
                      projectsList.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">
                              {index + 1 <= 9
                                ? `0${index + 1}`
                                : `${index + 1}`}
                            </th>
                            <td>{data.name}</td>
                            <td>
                              <img src={data.image} alt="" width="50px" />
                            </td>
                            <td>
                              <img src={data.cover_image} alt="" width="50px" />
                            </td>
                            <td>{data.about.substring(0, 60)}...</td>
                            <td>{data.description.substring(0, 60)}...</td>
                            <td>{data.tag}</td>
                            <td>{data?.seo || ""}...</td>
                            <td>{data.features[0].name}</td>
                            <td>{data.features[0].text}</td>
                            <td>
                              <img
                                src={data.features[0].icon}
                                alt=""
                                width="50px"
                              />
                            </td>
                            <td className="table-actions">
                              <span
                                className="table-action"
                                id="tooltip978979647"
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  id = data._id;
                                  setIsId(id);
                                  setValue(data.description);
                                  delete data._id;
                                  delete data.admin;
                                  delete data.__v;
                                  delete data.date;

                                  data.features.map((feature, index) => {
                                    return delete feature._id;
                                  });

                                  for (
                                    let i = 0;
                                    i < data?.features?.length;
                                    i++
                                  ) {
                                    let features = data.features[i];
                                    iconFileArr.push(features.icon);
                                  }

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
                                onClick={(e) => dltProject(data._id)}
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

      {/******************** 
                             CREATE PROEJCT SECTION
                                                      ******************/}
      <Modal
        isOpen={modal}
        toggle={(e) => {
          toggle();
          setImageUrl();
          setCoverImgUrl();
        }}
        size="lg"
      >
        <ModalHeader
          toggle={(e) => {
            toggle();
            setImageUrl();
            setCoverImgUrl();
          }}
        >
          {selectedValue ? "Edit Project" : "Create Project"}
        </ModalHeader>
        <Formik
          initialValues={
            selectedValue || {
              name: "",
              image: "",
              cover_image: "",
              about: "",
              description: "",
              tag: "",
              seo: "",
              features: [emptyFeatures],
            }
          }
          validationSchema={projectSchema}
          onSubmit={(values, { setSubmitting, setErrors }) => {
            setSubmitting(true);
            const onSuccess = () => {
              toggle();
            };

            if (!selectedValue) {
              setTimeout(() => {
                dispatch(createProject(values, setSubmitting, onSuccess));
              }, 1500);

              setTimeout(() => {
                setIconFileArr([]);
                setCoverImgUrl();
                setImageUrl();
              }, 1800);
            } else {
              let objId = isId;
              setTimeout(() => {
                dispatch(editProject(values, objId, setSubmitting, onSuccess));
              }, 500);

              setTimeout(() => {
                setIconFileArr([]);
                setCoverImgUrl();
                setImageUrl();
                setValue("");
              }, 1100);
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
                <Row>
                  {/******************** 
                                       NAME INPUT  
                                                  ******************/}
                  <Col lg={12} md={6} sm={12}>
                    <FormGroup className={classnames("mb-3")}>
                      <InputGroup className="input-group-merge input-group-alternative">
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
                          autoComplete="off"
                          disabled={isSubmitting}
                          className={`py-4 ${
                            values?.name?.length > 0 && "prInput"
                          }`}
                          style={{ fontSize: "1rem" }}
                        />
                      </InputGroup>
                      {errors.name && touched.name && (
                        <div style={{ color: "red" }}>{errors.name} </div>
                      )}
                    </FormGroup>
                  </Col>

                  {/******************** 
                             IMAGE INPUT  
                                ******************/}

                  <Col lg={12} md={6} sm={12}>
                    <FormGroup className={classnames("mb-3")}>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-image text-gray" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Image URL"
                          type="text"
                          name="image"
                          value={
                            selectedValue
                              ? imageUrl
                                ? (values.image = `${process.env.REACT_APP_API_URL}${imageUrl}`)
                                : values.image
                              : imageUrl
                              ? (values.image = `${process.env.REACT_APP_API_URL}${imageUrl}`)
                              : (values.image = "")
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          className={`py-4 ${
                            values?.image?.length > 0 && "prInput"
                          }`}
                          style={{ fontSize: "1rem" }}
                          autoComplete="off"
                        />
                        <Button
                          color="secondary"
                          onClick={() => {
                            toggleNested();
                            // handleSelectedValue();
                            (() => {
                              setImageClickText("IMAGE");
                            })();
                            // handleImageClick();
                          }}
                          disabled={isSubmitting}
                        >
                          <i className="fa fa-upload" aria-hidden="true"></i>
                        </Button>
                      </InputGroup>
                      {errors.image && touched.image && (
                        <div style={{ color: "red" }}>{errors.image} </div>
                      )}
                    </FormGroup>
                  </Col>

                  {/******************** 
                             COVER_IMAGE INPUT  
                                ******************/}
                  <Col lg={12} md={6} sm={12}>
                    <FormGroup className={classnames("mb-3")}>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-image text-gray" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="Cover Image URL"
                          type="text"
                          name="cover_image"
                          value={
                            selectedValue
                              ? coverImgUrl
                                ? (values.cover_image = `${process.env.REACT_APP_API_URL}${coverImgUrl}`)
                                : values.cover_image
                              : coverImgUrl
                              ? (values.cover_image = `${process.env.REACT_APP_API_URL}${coverImgUrl}`)
                              : ""
                          }
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={isSubmitting}
                          className={`py-4 ${
                            values?.cover_image?.length > 0 && "prInput"
                          }`}
                          style={{ fontSize: "0.9rem" }}
                          autoComplete="off"
                        />
                        <Button
                          color="secondary"
                          onClick={() => {
                            toggleNested();
                            // handleSelectedValue();
                            setImageClickText("COVER_IMAGE");
                            // handleCoverImgClick();
                          }}
                          disabled={isSubmitting}
                        >
                          <i className="fa fa-upload" aria-hidden="true"></i>
                        </Button>
                      </InputGroup>
                      {errors.cover_image && touched.cover_image && (
                        <div style={{ color: "red" }}>
                          {errors.cover_image}{" "}
                        </div>
                      )}
                    </FormGroup>
                  </Col>
                  {/******************** 
                             ABOUT INPUT  
                                ******************/}
                  <Col lg={12} md={6} sm={12}>
                    <FormGroup className={classnames("mb-3")}>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i
                              className="fa fa-paragraph text-gray"
                              aria-hidden="true"
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="About"
                          type="textarea"
                          name="about"
                          value={values.about}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          disabled={isSubmitting}
                          className={`py-4 pt-5 ${
                            values?.about?.length > 0 && "prInput"
                          }`}
                          style={{ fontSize: "1rem" }}
                        />
                      </InputGroup>
                      {errors.about && touched.about && (
                        <div style={{ color: "red" }}>{errors.about} </div>
                      )}
                    </FormGroup>
                  </Col>
                  {/******************** 
                             TAG INPUT  
                                ******************/}
                  <Col lg={12} md={6} sm={12}>
                    <FormGroup className={classnames("mb-3")}>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="ni ni-tag text-gray" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="*Unique Tag "
                          type="text"
                          name="tag"
                          value={values.tag}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          disabled={isSubmitting}
                          className={`py-4 ${
                            values?.tag?.length > 0 && "prInput"
                          }`}
                          style={{ fontSize: "1rem" }}
                        />
                      </InputGroup>
                      {errors.tag && touched.tag && (
                        <div style={{ color: "red" }}>{errors.tag} </div>
                      )}
                    </FormGroup>
                  </Col>

                  {/******************** 
                             SEO DESCRIPTION INPUT  
                                ******************/}
                  <Col lg={12} md={6} sm={12}>
                    <FormGroup className={classnames("mb-3")}>
                      <InputGroup className="input-group-merge input-group-alternative">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i
                              className="fa fa-paragraph text-gray"
                              aria-hidden="true"
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          placeholder="SEO Description "
                          type="textarea"
                          name="seo"
                          value={values.seo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          autoComplete="off"
                          disabled={isSubmitting}
                          className={`py-4 pt-5 ${
                            values?.seo?.length > 0 && "prInput"
                          }`}
                          style={{ fontSize: "1rem" }}
                        />
                      </InputGroup>
                      {errors.seo && touched.seo && (
                        <div style={{ color: "red" }}>{errors.seo} </div>
                      )}
                    </FormGroup>
                  </Col>

                  {/******************** 
                             DESCRIPTION ---> PRODUCTS TITLE INPUT  
                                ******************/}
                  <Col lg={12} md={6} sm={12} className="ml-3">
                    <FormGroup className={`${classnames("mb-3")}`}>
                      <div className="w-0 pl-5 addDescTag">
                        <h6>Add Description</h6>
                      </div>
                      <InputGroup className="row">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i
                              className="fa fa-paragraph text-gray"
                              aria-hidden="true"
                            />
                          </InputGroupText>
                        </InputGroupAddon>
                        <ReactQuill
                          theme="snow"
                          name="description"
                          modules={modules}
                          placeholder="Description Of Project"
                          onChange={setValue}
                          className="h-75 react-quill-container"
                          value={
                            selectedValue
                              ? (values.description = value)
                              : (values.description = value)
                          }
                          // style={{ fontSize: "1rem", color: "#000", }}
                          required
                        />

                        {/* {console.log(value, "value for testinggg")} */}
                      </InputGroup>
                      {errors.description &&
                        touched.description &&
                        value?.length === 0 && (
                          <div style={{ color: "red", marginTop: "100px" }}>
                            {errors.description}Please..
                          </div>
                        )}
                      <p className="Error">
                        {errors.descriptionContent && "Enter valid content"}
                      </p>
                    </FormGroup>
                  </Col>
                  {/******************** 
                             FEATURES SECTION
                                ******************/}
                  <Col lg={12} md={6} sm={12}>
                    <FieldArray
                      name="features"
                      render={(arrayHelpers) => (
                        <div>
                          <div>
                            <h5 className="mt-4">Add Features here</h5>
                          </div>
                          {values.features.map((feature, index) => {
                            return (
                              <div
                                style={{ display: "flex", flex: "0 0 50" }}
                                key={index}
                              >
                                <FormGroup
                                  className={`${classnames("mb-3")} w-100 mb-5`}
                                >
                                  <InputGroup className="input-group-merge input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="ni ni-circle-08 text-gray " />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      placeholder="Name of Feature"
                                      type="text"
                                      name={`features[${index}].name`}
                                      value={feature.name}
                                      onChange={handleChange}
                                      disabled={isSubmitting}
                                      required
                                      className={`py-4 ${
                                        feature?.name?.length > 0 && "prInput"
                                      }`}
                                      style={{ fontSize: "1rem" }}
                                      autoComplete="off"
                                    />
                                  </InputGroup>

                                  <InputGroup className="input-group-merge input-group-alternative ">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i
                                          className="fa fa-paragraph text-gray mt-1"
                                          aria-hidden="true"
                                        />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      placeholder="Description of Feature"
                                      type="textarea"
                                      name={`features[${index}].text`}
                                      value={feature.text}
                                      onChange={handleChange}
                                      disabled={isSubmitting}
                                      required
                                      className={`py-4 pt-5 mt-1 ${
                                        feature?.text?.length > 0 && "prInput"
                                      }`}
                                      style={{ fontSize: "1rem" }}
                                      autoComplete="off"
                                    />
                                  </InputGroup>

                                  <InputGroup className="input-group-merge input-group-alternative ">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="ni ni-image text-gray mt-1" />
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    {console.log(
                                      "iconFileArr....",
                                      JSON.stringify(iconFileArr)
                                    )}
                                    <Input
                                      placeholder="Icon URL"
                                      type="text"
                                      name={`features.${index}.icon`}
                                      value={
                                        selectedValue
                                          ? iconFileArr[index] !== undefined
                                            ? (feature.icon = `${iconFileArr[index]}`)
                                            : (feature.icon = "")
                                          : iconFileArr?.length > 0
                                          ? iconFileArr[index] !== undefined
                                            ? (feature.icon = `${iconFileArr[index]}`)
                                            : (feature.icon = "")
                                          : ""
                                      }
                                      onChange={handleChange}
                                      disabled={isSubmitting}
                                      required
                                      className={`py-4 mt-1 ${
                                        feature?.icon?.length > 0 && "prInput"
                                      }`}
                                      style={{ fontSize: "1rem" }}
                                      autoComplete="off"
                                    />
                                    <Button
                                      color="secondary"
                                      onClick={() => {
                                        toggleNested();
                                        // handleSelectedValue();
                                        setIconClick(index);
                                        setImageClickText("FEATURE_ICON");
                                      }}
                                      disabled={isSubmitting}
                                    >
                                      <i
                                        className="fa fa-upload"
                                        aria-hidden="true"
                                      ></i>
                                    </Button>
                                  </InputGroup>
                                  {errors.features && touched.features && (
                                    <div style={{ color: "red" }}>
                                      {errors.features}
                                    </div>
                                  )}
                                </FormGroup>

                                <Button
                                  color="danger"
                                  onClick={(e) => {
                                    (() => {
                                      arrayHelpers.remove(index);
                                      iconFileArr.splice(index, 1);
                                    })();
                                  }}
                                  disabled={isSubmitting}
                                  className="h-25 mt-auto mb-5 ml-1 removeBtn"
                                >
                                  <i
                                    className="fa fa-times"
                                    aria-hidden="true"
                                  ></i>
                                </Button>
                              </div>
                            );
                          })}

                          <Button
                            color="primary"
                            onClick={(e) => {
                              e.preventDefault();
                              arrayHelpers.push(emptyFeatures);
                            }}
                            disabled={isSubmitting}
                          >
                            Add Features
                          </Button>
                        </div>
                      )}
                    />
                  </Col>
                </Row>
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
                {selectedFile?.length > 0 ? (
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
                // handleSelectedValue();
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    </>
  );
}

export default Projects;
