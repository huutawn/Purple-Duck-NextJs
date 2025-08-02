import { axiosClient } from "@/app/Service/ApiClient"; // Đường dẫn đến axiosClient của bạn

// API cho người dùng và xác thực cơ bản
const createUser = async (
  email: string,
  password: string,
  fullName: string
) => {
  const res = await axiosClient.post("/users", { email, password, fullName });
  return res;
};

const activeUser = async (email: string, code: string) => {
  return await axiosClient.post("/users/active", { email, code });
};

const sendCode = async (email: string) => {
  return await axiosClient.post("/users/sendcode", { email });
};

const login = async (email: string, password: string) => {
  return await axiosClient.post("/auth/token", { email, password });
};

const refreshToken = async (token: string) => {
  return await axiosClient.post("/auth/refresh", { token });
};

// API MỚI: Trao đổi mã ủy quyền Google lấy token từ Backend
const exchangeCodeForToken = async (authCode: string) => {
  try {
    
    const response = await axiosClient.post(
      `/auth/outbound/authentication?code=${authCode}`,
      {} 
    );

    return response || null;
  } catch (error: any) {
    console.error("Error exchanging code for Google token:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to exchange Google code for token.');
  }
};

export { 
  createUser, 
  activeUser, 
  sendCode, 
  login, 
  refreshToken, 
  exchangeCodeForToken // Export hàm mới
};