import classnames from "classnames";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import {
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Navbar,
  Nav,
  Container,
} from "reactstrap";

function AdminNavbar({ theme }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogout = () => {
    window.localStorage.removeItem("jwt_access_token");
    window.localStorage.removeItem("user");
    dispatch({
      type: "SET_USER_PROFILE",
      data: null,
    });
    history.push("/login");
  };

  const loginUser = useSelector(({ auth }) => auth.user);

  return (
    <>
      <Navbar
        className={classnames(
          "navbar-top navbar-expand border-bottom",
          { "navbar-dark bg-info": theme === "dark" },
          { "navbar-light bg-secondary": theme === "light" }
        )}
      >
        <Container fluid>
          <Collapse navbar isOpen={true}>
            <Nav className="align-items-center ml-md-auto" navbar></Nav>
            <Nav className="align-items-center ml-auto ml-md-0" navbar>
              <UncontrolledDropdown nav>
                <DropdownToggle
                  className="nav-link pr-0"
                  color=""
                  tag="a"
                  style={{ cursor: "pointer" }}
                >
                  <Media className="align-items-center">
                    <i className="ni ni-circle-08 text-white text-lg pb-1" />
                    <Media className="ml-2 d-none d-lg-block">
                      <span className="mb-0 text-sm font-weight-bold">
                        {loginUser.name.substring(0, 1).toUpperCase()}
                        {loginUser.name
                          .substring(1, loginUser.name.length)
                          .toLowerCase()}
                      </span>
                    </Media>
                  </Media>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem className="noti-title" header tag="div">
                    <h6 className="text-overflow m-0">Welcome!</h6>
                  </DropdownItem>
                  <DropdownItem
                    tag="div"
                    onClick={(e) => handleLogout()}
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ni ni-user-run" />
                    <span>Logout</span>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

AdminNavbar.defaultProps = {
  toggleSidenav: () => {},
  sidenavOpen: false,
  theme: "dark",
};
AdminNavbar.propTypes = {
  toggleSidenav: PropTypes.func,
  sidenavOpen: PropTypes.bool,
  theme: PropTypes.oneOf(["dark", "light"]),
};

export default AdminNavbar;
