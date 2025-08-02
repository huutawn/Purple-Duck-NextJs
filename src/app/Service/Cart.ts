import axiosClient from "@/app/Service/ApiClient";

import { CartResponse, VariantQuantity,CartItemResponse } from '@/types';
export type AddToCartBackendRequest = {
    productId: number;
    attributeValueIds: number[];
    quantity: number;
};
export type AddToCartBatchBackendRequest = AddToCartBackendRequest[]; // Đây chỉ là một mảng của AddToCartBackendRequest


const getCartFromBackEnd = async () => {
  const response= await axiosClient.get("/cart");
  return response;
};
const addProductToCartBackend = async (data: AddToCartBackendRequest) => {
    try {
        const response = await axiosClient.post('/cart', data); // Endpoint của bạn để thêm vào giỏ hàng
        
        if (response.data.code === 1000) {
            return response.data; // Trả về toàn bộ data response nếu thành công
        } else {
            console.error('API Error in addProductToCartBackend:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi thêm sản phẩm vào giỏ hàng.');
        }
    } catch (error) {
        console.error('Network Error in addProductToCartBackend:', error);
        throw error;
    }
};
const deleteCart = async (id: number) => {
  return await axiosClient.delete(`/cart/${id}`);
};
const updateQuantityCart = async (id: number, quantity: number) => {
  return await axiosClient.post(`/cart/updateQuantity`, { id, quantity });
};
const updateCartItem = async (id: number, id_atributes_value: number) => {
  return await axiosClient.post(`/cart/updateCartItem`, {
    id,
    id_atributes_value,
  });
};
const getAttributesValue = async (id: number) => {
  return await axiosClient.get(`cart/AtributesValue/${id}`);
};

export {
  getCartFromBackEnd,
  addProductToCartBackend,
  deleteCart,
  updateQuantityCart,
  updateCartItem,
  getAttributesValue,
};
