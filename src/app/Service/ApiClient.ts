import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "@/app/Service/Auth"; // Import hàm refeshToken

export const axiosClient = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor cho request (đã có, giữ nguyên nhưng rename sessionToken thành accessToken cho rõ)
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

// // Response interceptor: Handle 401 with refresh
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if ((error.response?.status === 401 ||error.response?.status !== 1000) && !originalRequest._retry) {
//       originalRequest._retry = true; // Prevent infinite loop
//       const refreshTokenValue = Cookies.get("refreshToken"); // Giả sử có refreshToken cookie
//       if (refreshTokenValue) {
//         try {
//           const res = await refreshToken(refreshTokenValue);
//           const newAccessToken = res.data.result?.token||res.data.token;
//           console.log('api client: '+ newAccessToken) // Adjust based on response
//           Cookies.set("authToken", newAccessToken, { expires: 7, secure: true, sameSite: 'strict' });

      

//           // Retry original request
//           return axiosClient(originalRequest);
//         } catch (refreshError) {
//           console.error("Refresh failed:", refreshError);
//           // Logout on fail
//           Cookies.remove("authToken");
//           Cookies.remove("refreshToken");
//           Cookies.remove("roles"); // Clean roles
//           window.location.href = "/login"; // Force redirect to break loop
//         }
//       } else {
//         // No refresh, logout
//         Cookies.remove("authToken");
//         Cookies.remove("roles");
//         window.location.href = "/login";
//       }
//     }
//     return Promise.reject(error);
//   }
// );

export default axiosClient;