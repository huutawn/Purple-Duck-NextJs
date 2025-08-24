import axiosClient from "@/app/Service/ApiClient";

export type CustomerResponse = {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    picture?: string;
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderStatus?: string;
    lastOrderDate?: string;
    firstOrderDate?: string;
    phone?: string;
    city?: string;
    address?: string;
    isActive: boolean;
    customerTier: string; // VIP, Regular, New
};

export type CustomersResponse = {
    code: number;
    result: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalElements: number;
        data: CustomerResponse[];
    };
};

const getCustomersBySeller = async (params: { 
    page?: number; 
    size?: number; 
    search?: string 
} = {}) => {
    try {
        const response = await axiosClient.get('/seller/customers', {
            params: {
                page: params.page || 0,
                size: params.size || 10,
                search: params.search,
            },
        });

        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in getCustomersBySeller:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi lấy danh sách khách hàng.');
        }
    } catch (error) {
        console.error('Network Error in getCustomersBySeller:', error);
        throw error;
    }
};

export { getCustomersBySeller };
