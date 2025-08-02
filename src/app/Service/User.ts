import axiosClient from "@/app/Service/ApiClient";

const myInfo = async () => {
  return await axiosClient.get("/users/my-info");
};

const updateMyInfo = async (id: number, data: object) => {
  return await axiosClient.patch(`/profile/${id}`, {
    ...data,
  });
};

export { myInfo, updateMyInfo };
