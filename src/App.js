import { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import "react-notification-alert/dist/animate.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "sweetalert2/dist/sweetalert2.min.css";
import "select2/dist/css/select2.min.css";
import "quill/dist/quill.core.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
// plugins styles downloaded
import "./assets/vendor/nucleo/css/nucleo.css";
import "./assets/css/cusome-css.css";
// core styles
import "./assets/scss/argon-dashboard-pro-react.scss?v1.2.0";

import AdminLayout from "./layouts/Admin";
import AuthLayout from "./layouts/Auth.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const { isAuthorized } = useSelector(({ auth }) => {
    return {
      isAuthorized: auth.user,
    };
  }, shallowEqual);

  useEffect(() => {
    const admin = localStorage.getItem("user");
    const getProfile = async () => {
      try {
        dispatch({
          type: "SET_USER_PROFILE",
          data: JSON.parse(admin),
        });
      } catch (error) {
        console.log("error", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (admin) {
      getProfile();
    } else {
      setIsLoading(false);
    }
  }, [dispatch]);

  return (
    <>
      {" "}
      <BrowserRouter>
        {isLoading ? (
          <div className="bg-info loader-container">
            <div className="lds-roller">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        ) : (
          <Switch>
            <ProtectedRoute exact path="/" />
            {!isAuthorized && <ProtectedRoute path="/admin" />}
            <Route
              path="/login"
              render={(props) => <AuthLayout {...props} />}
            />
            <Route
              path="/admin"
              render={(props) => <AdminLayout {...props} />}
            />
          </Switch>
        )}
        <ToastContainer
          position="top-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          draggable
        />
      </BrowserRouter>
    </>
  );
}

export default App;
