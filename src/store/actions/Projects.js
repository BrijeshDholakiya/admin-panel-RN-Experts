import AxiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

export function createProject(payload, setSubmitting, onSuccess) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().post("/api/v1/projects", payload);
      if (data.success) {
        setSubmitting();
        onSuccess();
        dispatch(getProjectsList());
        toast.success("Service Created");
        return;
      }
      if (!data.success) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}

export function getProjectsList() {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/projects");
      if (data.success) {
        dispatch({
          type: "SET_PROJECTS_LIST",
          data: data.result,
        });
        return;
      }
      if (!data.success) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}

export function getProjectById(id) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/projects/" + id);
      if (data.status === 200) {
        dispatch({
          type: "SET_PROJECT_BY_ID",
          data: data.result,
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

export function getProjectByTag(slug) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/projects/" + slug);
      if (data.success) {
        dispatch({
          type: "SET_PROJECT_BY_TAG",
          data: data.result,
        });
        return;
      }
      if (!data.success) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}

export function editProject(payload, objId, setSubmitting, onSuccess) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().patch(
        `/api/v1/projects/${objId}`,
        payload
      );
      if (data.success) {
        setSubmitting();
        onSuccess();
        dispatch(getProjectsList());
        toast.success("Project Edited");
        return;
      }
      if (!data.success) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}

export function deleteProject(payload) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().delete(
        `/api/v1/projects/${payload}`
      );
      if (data.success) {
        dispatch(getProjectsList());
        toast.success("Project Deleted");
        return;
      }
      if (!data.success) {
        toast.error(data.message);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}
