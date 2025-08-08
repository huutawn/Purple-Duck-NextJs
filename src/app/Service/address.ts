import axiosClient from "@/app/Service/ApiClient";

export type CreateAddressReq={
  city:string;
  district:string;
  commune:string;
  address:string;
  isDefault:boolean;
  phoneNumber:string;
  Name:string;
}
const getAddress = async ()=>{
  try {
         // Giả sử endpoint để tạo order là /orders
         const response = await axiosClient.post('/address', );
 
         if (response.data.code === 1000) {
             return response.data; // Trả về toàn bộ data response nếu thành công
         } else {
             console.error('API Error in createOrder:', response.data.code, response.data.message);
             throw new Error(response.data.message || 'Lỗi khi tạo đơn hàng.');
         }
     } catch (error) {
         console.error('Network Error in createOrder:', error);
         throw error;
     }
}

const createAddress = async ()=>{
  try {
         // Giả sử endpoint để tạo order là /orders
         const response = await axiosClient.post('/address', );
 
         if (response.data.code === 1000) {
             return response.data; // Trả về toàn bộ data response nếu thành công
         } else {
             console.error('API Error in createOrder:', response.data.code, response.data.message);
             throw new Error(response.data.message || 'Lỗi khi tạo đơn hàng.');
         }
     } catch (error) {
         console.error('Network Error in createOrder:', error);
         throw error;
     }
}
const updateMyInfo = async (id: number, data: object) => {
  return await axiosClient.patch(`/profile/${id}`, {
    ...data,
  });
};



export { getAddress,createAddress };
