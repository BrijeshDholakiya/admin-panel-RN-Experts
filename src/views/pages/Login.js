import React from "react";
import classnames from "classnames";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Row,
  Col,
} from "reactstrap";
import AuthHeader from "../../components/Headers/AuthHeader.js";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../store/actions/Auth";
import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string().email("Wrong email format").required("Email Required"),
  password: Yup.string()
    .required("Password Required")
    .min(6, "Must be more than 6 characters"),
});

function Login() {
  const [focusedPassword] = React.useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <>
      <AuthHeader title="Welcome!" lead=""></AuthHeader>
      <Container className="mt--8 pb-5">
        <Row className="justify-content-center">
          <Col lg="5" md="7">
            <Card className=" border-0 mb-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>Or sign in with credentials</small>
                </div>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={loginSchema}
                  onSubmit={(values, { setSubmitting, setErrors }) => {
                    setSubmitting(true);
                    dispatch(login(values, setSubmitting, history));
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
                  }) => (
                    <Form
                      role="form"
                      onSubmit={handleSubmit}
                      autoComplete="new-password"
                    >
                      <FormGroup className={classnames("mb-3")}>
                        <InputGroup className="input-group-merge input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-email-83" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Email"
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                          />
                        </InputGroup>
                        {errors.email && touched.email && (
                          <div style={{ color: "red" }}>{errors.email} </div>
                        )}
                      </FormGroup>
                      <FormGroup
                        className={classnames({
                          focused: focusedPassword,
                        })}
                      >
                        <InputGroup className="input-group-merge input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="ni ni-lock-circle-open" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Password"
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            autoComplete="new-password"
                            disabled={isSubmitting}
                          />
                        </InputGroup>
                        {errors.password && touched.password && (
                          <div style={{ color: "red" }}>{errors.password} </div>
                        )}
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="info"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Sign in
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Login;
