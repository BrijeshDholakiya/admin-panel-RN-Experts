import instance from "../../AxiosInstance";
import { toast } from "react-toastify";

export function login(payload, setSubmitting, history) {
  return async (dispatch) => {
    try {
      const { data } = await instance().post("/api/v1/user/signin", payload);
      if (data.status === 200) {
        localStorage.setItem("jwt_access_token", data.token);
        localStorage.setItem("user", JSON.stringify(data.result));
        dispatch({
          type: "SET_USER_PROFILE",
          data: data?.result,
        });
        history.push(`/admin`);
        toast.success(data.message);
        return;
      }
      if (data.status !== 200) {
        toast.error(data.message);
        setSubmitting(false);
        return;
      }
    } catch (error) {
      console.log("login error", error);
    }
  };
}
