import React from "react";
import { useLocation, Route, Switch, Redirect } from "react-router-dom";

import routes from "../routes.js";

function Auth() {
  const location = useLocation();
  const mainContentRef = React.useRef(null);
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
    document.body.classList.add("bg-default");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.remove("bg-default");
    };
  });
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContentRef.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === null) {
        return <Route path={prop.path} component={prop.component} key={key} />;
      } else {
        return null;
      }
    });
  };

  const isAuthenticated = localStorage.getItem("user");

  return (
    <>
      <div className="main-content" ref={mainContentRef}>
        {isAuthenticated ? (
          <Redirect to="/admin" />
        ) : (
          <Switch>
            {getRoutes(routes)}
            <Redirect from="*" to="/login" />
          </Switch>
        )}
      </div>
    </>
  );
}

export default Auth;
