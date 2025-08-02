// src/app/Service/products.ts

import axiosClient from "@/app/Service/ApiClient";
import { CreateProductRequest } from '../types/product'; // Import type nếu tách riêng

/**
 * Lấy danh sách sản phẩm theo danh mục.
 * @param params - Các tham số phân trang và categoryId.
 * @returns Dữ liệu phản hồi từ API.
 */
const GetAllProductsMyCategory = async (params: { categoryId?: number; page?: number; size?: number } = {}) => {
    try {
        const response = await axiosClient.get('/products/category', {
            params: {
              categoryId: params.categoryId, // Thêm categoryId vào params
                page: params.page || 1, // Mặc định trang 1 nếu không có
                size: params.size || 10, // Mặc định 10 sản phẩm mỗi trang nếu không có

            },
        });

        // Kiểm tra code trả về từ API
        if (response.data.code === 1000) {
            return response.data; // Trả về toàn bộ res.data (chứa result và code)
        } else {
            console.error('API Error in GetAllProductsMyCategory:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi lấy sản phẩm theo danh mục.');
        }
    } catch (error) {
        console.error('Network Error in GetAllProductsMyCategory:', error);
        throw error; // Ném lỗi để xử lý ở nơi gọi hàm (component)
    }
};

/**
 * Lấy thông tin sản phẩm theo ID.
 * @param id - ID của sản phẩm.
 * @returns Dữ liệu phản hồi từ API.
 */
const GetByProductId = async (id: number) => {
    try {
        const response = await axiosClient.get(`/products/${id}`);
        // Kiểm tra code trả về từ API
        if (response.data.code === 1000) {
            return response.data; // Trả về toàn bộ res.data
        } else {
            console.error('API Error in GetByProductId:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi lấy thông tin sản phẩm.');
        }
    } catch (error) {
        console.error('Network Error in GetByProductId:', error);
        throw error;
    }
};

/**
 * Lấy danh sách sản phẩm của người bán hiện tại.
 * @param params - Các tham số phân trang.
 * @returns Dữ liệu phản hồi từ API.
 */
const GetAllProductsMySeller = async (params: { page?: number; size?: number } = {}) => {
    try {
        const response = await axiosClient.get('/products/mySeller', {
            params: {
                page: params.page || 1,
                size: params.size || 10,
            },
        });

        // Kiểm tra code trả về từ API
        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in GetAllProductsMySeller:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi lấy sản phẩm của người bán.');
        }
    } catch (error) {
        console.error('Network Error in GetAllProductsMySeller:', error);
        throw error;
    }
};

/**
 * Tạo một sản phẩm mới.
 * @param productData - Dữ liệu sản phẩm cần tạo.
 * @returns Dữ liệu phản hồi từ API.
 */
const createProduct = async (productData: CreateProductRequest) => {
    try {
        const response = await axiosClient.post('/products', productData);
        // Kiểm tra code trả về từ API
        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in createProduct:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi tạo sản phẩm.');
        }
    } catch (error) {
        console.error('Network Error in createProduct:', error);
        throw error;
    }
};

/**
 * Lấy 5 sản phẩm bán chạy nhất.
 * @returns Dữ liệu phản hồi từ API.
 */
const GetTop5MostPurchase = async () => {
    try {
        const response = await axiosClient.get(`/products/most_purchase`);
        // Kiểm tra code trả về từ API
        if (response.data.code === 1000) {
          console.log(response.data.code  )
          console.log(response.data.result.data)
            return response.data;
        } else {
            console.error('API Error in GetTop5MostPurchase:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi lấy 5 sản phẩm bán chạy nhất.');
        }
    } catch (error) {
        console.error('Network Error in GetTop5MostPurchase:', error);
        throw error;
    }
};

/**
 * Lấy 5 sản phẩm mới nhất.
 * @param params - Các tham số phân trang (mặc định size là 5).
 * @returns Dữ liệu phản hồi từ API.
 */
const GetTop5New = async (params: { page?: number; size?: number } = {}) => {
    try {
        const response = await axiosClient.get('/products', {
            params: {
                page: params.page || 1,
                size: params.size || 4, // Mặc định 5 sản phẩm mỗi trang
            },
        });

        // Kiểm tra code trả về từ API
        if (response.data.code === 1000) {
            return response.data;
        } else {
            console.error('API Error in GetTop5New:', response.data.code, response.data.message);
            throw new Error(response.data.message || 'Lỗi khi lấy 5 sản phẩm mới nhất.');
        }
    } catch (error) {
        console.error('Network Error in GetTop5New:', error);
        throw error;
    }
};

// Export tất cả các hàm để có thể import chúng từ các component khác
export {
    GetAllProductsMyCategory,
    GetByProductId,
    GetTop5MostPurchase,
    GetAllProductsMySeller,
    createProduct,
    GetTop5New
};