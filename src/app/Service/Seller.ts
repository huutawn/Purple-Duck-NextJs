import axiosClient from "@/app/Service/ApiClient";

export type SellerProfileResponse = {
    sellerId: number;
    storeName: string;
    storeDescription: string;
    storeLogo?: string;
    rating: number;
    isVerified: boolean;
    sellerCreatedAt: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    picture?: string;
    totalOrders: number;
    pendingOrders: number;
    completedOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    totalProducts: number;
    activeProducts: number;
    totalCustomers: number;
    unreadNotifications: number;
};

export type NotificationResponse = {
    id: number;
    title: string;
    message: string;
    type: string; // ORDER, PAYMENT, SYSTEM, PROMOTION
    isRead: boolean;
    relatedEntityId?: string;
    relatedEntityType?: string;
    createdAt: string;
};

export type SellerProfileApiResponse = {
    code: number;
    message?: string;
    result: SellerProfileResponse;
};

export type NotificationsApiResponse = {
    code: number;
    message?: string;
    result: {
        currentPage: number;
        totalPages: number;
        pageSize: number;
        totalElements: number;
        data: NotificationResponse[];
    };
};

export type NotificationCountApiResponse = {
    code: number;
    message?: string;
    result: number;
};

const CreateSeller = async (storeName:string, storeDescription:string, storeLogo:string) => {
  return await axiosClient.post("/seller", {
    storeName,storeDescription,storeLogo
  });
};

const UpdateSeller = async (formData: FormData, id: number) => {
  return await axiosClient.patch(`/seller/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const CreateAddress = async (formData: any) => {
  return await axiosClient.post("/address", formData);
};

const UpdateAddress = async (id: number, formData: any) => {
  return await axiosClient.patch(`/address/${id}`, formData);
};

const Delete = async (id: number) => {
  return await axiosClient.delete(`/address/${id}`);
};

const CreateProduct = async (formData: FormData, id: number) => {
  return await axiosClient.post(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const CreateNameAttributes = async (name: string, id: number) => {
  return await axiosClient.post(`/attributes/${id}`, { name });
};

const CreateAttributesValue = async (formData: FormData, id: number) => {
  return await axiosClient.post(`/attributes/value/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
const DeleteProduct = async (id: number) => {
  return await axiosClient.delete(`/products/${id}`);
};

const GetMyProducts = async (id_Seller: number, id_Category: number) => {
  return await axiosClient.get(`/products/${id_Seller}/${id_Category}`);
};
const PatchProduct = async (id: number, formData: any) => {
  return await axiosClient.patch(`/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const GetSeller = async (id: number) => {
  return await axiosClient.get(`/seller/${id}`);
};

// Get seller profile with dashboard stats
const getSellerProfile = async (): Promise<SellerProfileApiResponse> => {
    try {
        const response = await axiosClient.get('/seller/profile');
        
        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in getSellerProfile:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi tải thông tin người bán.');
        }
    } catch (error) {
        console.error('Network Error in getSellerProfile:', error);
        throw error;
    }
};

// Get seller notifications
const getSellerNotifications = async (params: { 
    page?: number; 
    size?: number; 
} = {}): Promise<NotificationsApiResponse> => {
    try {
        const response = await axiosClient.get('/seller/notifications', {
            params: {
                page: params.page || 0,
                size: params.size || 10,
            },
        });

        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in getSellerNotifications:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi tải thông báo.');
        }
    } catch (error) {
        console.error('Network Error in getSellerNotifications:', error);
        throw error;
    }
};

// Get unread notification count
const getUnreadNotificationCount = async (): Promise<NotificationCountApiResponse> => {
    try {
        const response = await axiosClient.get('/seller/notifications/count');
        
        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in getUnreadNotificationCount:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi tải số thông báo chưa đọc.');
        }
    } catch (error) {
        console.error('Network Error in getUnreadNotificationCount:', error);
        throw error;
    }
};

export {
  GetSeller,
  PatchProduct,
  GetMyProducts,
  DeleteProduct,
  CreateSeller,
  UpdateSeller,
  CreateAddress,
  UpdateAddress,
  Delete,
  CreateProduct,
  CreateNameAttributes,
  CreateAttributesValue,
  getSellerProfile,
  getSellerNotifications,
  getUnreadNotificationCount,
};
