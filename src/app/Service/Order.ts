import axiosClient from "@/app/Service/ApiClient";

const CreaterOrder = async (data: object) => {
  return await axiosClient.post(`/order`, data);
};
const GetOrder = async () => {
  return await axiosClient.get(`/order`);
};

const GetOrderById = async (id: number) => {
  return await axiosClient.get(`/order/${id}`);
};
export { CreaterOrder, GetOrder, GetOrderById };
