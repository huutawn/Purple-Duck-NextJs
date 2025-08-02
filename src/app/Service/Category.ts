import axiosClient from "@/app/Service/ApiClient";


const GetAllCategory = async () => {
  return await axiosClient.get('/category');
};
export {GetAllCategory}