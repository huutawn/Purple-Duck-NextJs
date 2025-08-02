import axiosClient from "@/app/Service/ApiClient";

const GetAllUsers = async () => {
  return await axiosClient.get("/users");
};

const DeleteUsers = async (id: string) => {
  return await axiosClient.delete(`/users/${id}`);
};

const createUser = async (formData: any) => {
  return await axiosClient.post("/users/admin", formData);
};


const GetAllCategories = async () => {
  return await axiosClient.get("/categories");
};
const DeleteCategories = async (id: number) => {
  return await axiosClient.delete(`/categories/${id}`);
};
const UpdateCategories = async (id: number, formData: any) => {
  for (const [key, value] of formData.entries()) {
    console.log(`${key}: ${value}`);
  }
  return await axiosClient.patch(`/categories/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export {
  GetAllUsers,
  DeleteUsers,
  createUser,
  GetAllCategories,
  DeleteCategories,
  UpdateCategories,
};
