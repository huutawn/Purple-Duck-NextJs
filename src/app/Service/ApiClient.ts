// src/app/Service/ApiClient.ts

import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "@/app/Service/Auth";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api/", // Đảm bảo URL này là đúng
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request: Tự động thêm authToken vào header (CHỈ ĐĂNG KÝ MỘT LẦN)
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get("authToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Kiểm tra nếu lỗi là 401 và đây không phải là lần retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Đặt cờ để tránh vòng lặp vô hạn

      try {
        const authToken = Cookies.get("authToken");
        console.log("Lỗi 401 được interceptor bắt.");
        const refreshTokenValue = Cookies.get("refreshToken");

        if (refreshTokenValue && authToken) {
          const res = await refreshToken(authToken, refreshTokenValue);

          const newAccessToken = res.data.result?.token || res.data.token;
          const newRefreshToken = res.data.result?.refreshToken || res.data.refreshToken;
          Cookies.set("authToken", newAccessToken); // Đã bỏ secure/sameSite
          Cookies.set("refreshToken", newRefreshToken); // Đã bỏ secure/sameSite

          axiosClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return axiosClient(originalRequest); // Thử lại request ban đầu
        } else {
          console.error("Không có refresh token hoặc authToken, chuyển hướng đến đăng nhập.");
          Cookies.remove("authToken");
          Cookies.remove("refreshToken");
          // CHUYỂN HƯỚNG ĐẾN TRANG ĐĂNG NHẬP
          window.location.href = "/login"; // Hoặc dùng Next.js router.push nếu có
        }
      } catch (refreshError) {
        console.error("Refresh token thất bại:", refreshError);
        Cookies.remove("authToken");
        Cookies.remove("refreshToken");
        // CHUYỂN HƯỚNG ĐẾN TRANG ĐĂNG NHẬP
        window.location.href = "/login"; // Hoặc dùng Next.js router.push nếu có
      }
    }
    
    // Trả về lỗi nếu không phải lỗi 401 hoặc đã retry
    return Promise.reject(error);
  }
);

export default axiosClient;