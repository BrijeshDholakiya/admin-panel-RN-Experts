import AxiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

export function createService(payload, setSubmitting, onSuccess) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().post("/api/v1/services", payload);
      if (data.status === 200) {
        setSubmitting();
        onSuccess();
        dispatch(getServicesList());
        toast.success("Service Created");
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

export function getServicesList() {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/services");
      if (data.status === 200) {
        dispatch({
          type: "SET_SERVICES_LIST",
          data: data.data,
        });
        return;
      }
      if (data.status === 400) {
        toast.error(data.msg);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}

export function getServiceById(id) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().get("/api/v1/services/" + id);

      if (data.status === 200) {
        dispatch({
          type: "SET_SERVICE_BY_ID",
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

export function editService(payload, objId, setSubmitting, onSuccess) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().put(
        `/api/v1/services/${objId}`,
        payload
      );

      if (data.success) {
        setSubmitting();
        onSuccess();
        dispatch(getServicesList());
        toast.success("Service Edited");
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

export function deleteService(payload) {
  return async (dispatch) => {
    try {
      const { data } = await AxiosInstance().delete(
        `/api/v1/services/${payload}`
      );
      if (data.success) {
        dispatch(getServicesList());
        toast.success("Service Deleted");
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
