import { axiosClient } from "@/app/Service/ApiClient";

const upload = async (formData: FormData) => {
  return await axiosClient.post("/cloudinary", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export {upload}