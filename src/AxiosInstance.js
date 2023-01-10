import Axios from "axios";

const instance = Axios.create({
  baseURL: "/api",
});

const AxiosInstance = () => {
  let token = window.localStorage.getItem("jwt_access_token");
  if (token) {
    instance.defaults.headers["token"] = token;
  }
  return instance;
};

export default AxiosInstance;
