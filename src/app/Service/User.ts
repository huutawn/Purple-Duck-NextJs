import axiosClient from "@/app/Service/ApiClient";

const myInfo = async () => {
  return await axiosClient.get("/users/my-info");
};

const updateMyInfo = async (id: number, data: object) => {
  return await axiosClient.patch(`/profile/${id}`, {
    ...data,
  });
};

const getUsers = async () => {
  return await axiosClient.get("/users");
};

const getUser = async (userId: string) => {
  return await axiosClient.get(`/users/${userId}`);
};

const deleteUser = async (userId: string) => {
  return await axiosClient.delete(`/users/${userId}`);
};

const updateUser = async (userId: string, data: object) => {
  return await axiosClient.put(`/users/${userId}`, data);
};

export { myInfo, updateMyInfo, getUsers, getUser, deleteUser, updateUser };
