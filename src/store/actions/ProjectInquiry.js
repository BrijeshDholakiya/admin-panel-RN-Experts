import AxiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

export function getProjectsInquiryList(page, limit, search) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/inquiry");
      if (data.status === 200) {
        dispatch({
          type: "SET_PROJECTS_INQUIRY_LIST",
          data: data.data,
        });
        return;
      }
      if (data.status === 400) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}

export function getProjectInquiryListById(id) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/inquiry/" + id);
      if (data.status === 200) {
        dispatch({
          type: "SET_PROJECTS_INQUIRY_BY_ID",
          data: data.data,
        });
        return;
      }
      if (data.status === 400) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}
