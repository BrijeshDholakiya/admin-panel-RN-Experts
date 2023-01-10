import AxiosInstance from "../../AxiosInstance";
import { toast } from "react-toastify";

export function uploadImage(payload) {
  return async () => {
    try {
      const { data } = await AxiosInstance().post(
        `/api/v1/upload/image`,
        payload
      );
      if (data.status === 201) {
        return data;
      }
      if (data.status === 400) {
        toast.error(data.message);
        return null;
      }
    } catch (error) {
      console.log("item delete error", error);
    }
  };
}
