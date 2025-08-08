import axiosClient from "@/app/Service/ApiClient";

export type OrderItemRequest = {
    productId: number;
    attributeValueIds: number[];
    quantity: number;
};

export type CreateOrderRequest = {
    items: OrderItemRequest[];
    shippingAddressId: number; // Long bên BE sẽ là number bên TS
    paymentMethod: string;
    couponCode?: string;
    notes?: string;
    fromCart?: boolean;
};
export type startOrderReq= {
    orderId:number;
    addressId:number;
    isQR:boolean;
    note:string;
}
const createOrder = async (orderData: CreateOrderRequest) => {
    try {
        // Giả sử endpoint để tạo order là /orders
        const response = await axiosClient.post('/order', orderData);

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
};
const getInit = async()=>{
     try {
        // Giả sử endpoint để tạo order là /orders
        const response = await axiosClient.get('/order/init');

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
};
const startOrder = async(orderData:startOrderReq)=>{
     try {
        // Giả sử endpoint để tạo order là /orders
        const response = await axiosClient.patch('/order/start',orderData);

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
};
const GetOrder = async () => {
  return await axiosClient.get(`/order`);
};

const GetOrderById = async (id: number) => {
  return await axiosClient.get(`/order/${id}`);
};
export { createOrder, GetOrder, GetOrderById,getInit,startOrder };
