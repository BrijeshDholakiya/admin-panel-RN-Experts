import { combineReducers } from "redux";
import auth from "./Auth";
import projects from "./Projects";
import services from "./Services";
// import suplier from "./Suplier";
// import item from "./Item";
// import order from "./Order";

const createReducer = (asyncReducers) =>
  combineReducers({
    auth,
    services,
    projects,
    // suplier,
    // item,
    // order,
    ...asyncReducers,
  });

export default createReducer;
