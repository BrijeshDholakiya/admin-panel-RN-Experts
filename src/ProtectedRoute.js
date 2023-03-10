import React from "react";
import { Redirect, Route } from "react-router-dom";

function ProtectedRoute({ component: Component, ...restOfProps }) {
  const isAuthenticated = localStorage.getItem("user");
  return (
    <Route
      {...restOfProps}
      render={() =>
        isAuthenticated ? <Redirect to="/admin" /> : <Redirect to="/login" />
      }
    />
  );
}

export default ProtectedRoute;
