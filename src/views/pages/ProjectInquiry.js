import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  Table,
  Container,
  Row,
  Button,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Col,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

import { getProjectsInquiryList } from "../../store/actions/ProjectInquiry";

import SimpleHeader from "../../components/Headers/SimpleHeader.js";

function ProjectInquiry() {
  const [filterPrInquiry, setFilterPrInquiry] = useState([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const projectsInquiryList = useSelector(
    ({ projects }) => projects.projectsInquiryList
  );

  useEffect(() => {
    dispatch(getProjectsInquiryList());
  }, [dispatch, search]);

  const handleSearchById = (searchValue) => {
    setSearch(searchValue);

    if (searchValue !== "") {
      let projectInquiry = projectsInquiryList.filter((item) => {
        return Object.values(item)
          .join("")
          .toLowerCase()
          .includes(searchValue.toLowerCase());
      });
      setFilterPrInquiry(projectInquiry);
    } else {
      setFilterPrInquiry(projectsInquiryList);
    }
  };

  return (
    <>
      <SimpleHeader name="Project Inquiry" parentName="Dashboard" />
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
                  <h3 className="mb-0">Projects Inquiry List</h3>
                </Col>
                <Col xl={6} lg={6} md={12}>
                  <div className="mb-0 d-flex float-right">
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

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th className="sort" scope="col">
                      INQUIRY ID
                    </th>
                    <th className="sort" scope="col">
                      Name
                    </th>
                    <th className="sort" scope="col">
                      EMAIL
                    </th>
                    <th className="sort" scope="col">
                      Phone No.
                    </th>
                    <th className="sort" scope="col">
                      Description
                    </th>
                    <th className="sort" scope="col">
                      Date
                    </th>
                  </tr>
                </thead>
                {search.length > 1 ? (
                  <tbody className="list">
                    {filterPrInquiry && filterPrInquiry.length === 0 && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={3}>
                          No record Found
                        </td>
                      </tr>
                    )}
                    {filterPrInquiry === null && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={3}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {filterPrInquiry &&
                      filterPrInquiry.map((item, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{item._id}</th>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.phone_no}</td>
                            <td>{item.description}</td>
                            <td>{item.date}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                ) : (
                  <tbody className="list">
                    {projectsInquiryList &&
                      projectsInquiryList.length === 0 && (
                        <tr style={{ width: "100%" }}>
                          <td className="text-center" colSpan={12}>
                            No record Found
                          </td>
                        </tr>
                      )}
                    {projectsInquiryList === null && (
                      <tr style={{ width: "100%" }}>
                        <td className="text-center" colSpan={12}>
                          Loading...
                        </td>
                      </tr>
                    )}
                    {projectsInquiryList &&
                      projectsInquiryList.map((data, index) => {
                        return (
                          <tr key={index}>
                            <th scope="row">{data._id}</th>
                            <td>{data.name}</td>
                            <td>{data.email}</td>
                            <td>{data.phone_no}</td>
                            <td>{data.description}</td>
                            <td>{moment(data.date).format("LLLL")}</td>
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
                             GET INQUIRY LIST BY ID
                                                      ******************/}

      {/* <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>Project Inquiry List</ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody> */}
      {/******************** 
                                       NAME INPUT  
                                                  ******************/}
      {/* <FormGroup className={classnames("mb-3")}>
              <InputGroup className="input-group-merge input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-email-83" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Enter Your ID"
                  type="text"
                  name="id"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              type="submit"
              onClick={(event) => {
                event.preventDefault();
                handleRequest();
                toggle();
              }}
            >
              Search
            </Button>
            <Button
              color="secondary"
              onClick={(e) => {
                e.preventDefault();
                toggle();
                setIsById(false);
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </form>
      </Modal> */}
    </>
  );
}

export default ProjectInquiry;
