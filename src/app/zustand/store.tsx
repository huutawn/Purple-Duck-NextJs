// src/app/zustand/store.tsx

import { myInfo, } from "@/app/Service/User";
import { getCartFromBackEnd } from "@/app/Service/Cart"; // Đổi tên import
import { create } from "zustand";
import Cookies from "js-cookie";
import { refreshToken } from "../Service/Auth";
import { 
    User, 
    Address, 
    CartResponse, 
    CartItemResponse, 
    VariantQuantity,
    // Import các type khác nếu cần
} from '@/types'; // Đảm bảo đường dẫn tới file types của bạn là đúng

// --- CHỈNH SỬA INTERFACE ĐỂ KHỚP VỚI CẤU TRÚC BACKEND ---
// Đã loại bỏ các interface không liên quan đến User và Cart
// và sửa đổi các interface còn lại để khớp chính xác với DTO từ BE.

interface ProfileState {
    Cart: CartResponse | null; // Sử dụng CartResponse từ BE
    User: User | null;
    isLoadingg: boolean;
    error: string | null;
    fetchProfile: () => Promise<void>;
    fetchCart: () => Promise<void>;
    Avt: string;
}

// Hàm getInitials giữ nguyên
export function getInitials(name: string): string {
    const words = name.trim().split(/\s+/);
    const lastTwoWords = words.slice(-2);
    const initials = lastTwoWords
        .map((word) => word.charAt(0).toUpperCase())
        .join("");
    return initials.slice(0, 2);
}

// Tạo Zustand store
export const useProfileStore = create<ProfileState>((set) => ({
    Cart: null, // Khởi tạo Cart là null
    User: null,
    isLoadingg: false,
    error: null,
    Avt: "",

    fetchProfile: async () => {
        set({ isLoadingg: true, error: null }); // Reset error
        try {
            const res = await myInfo();
            if (res?.data?.code === 1000) {
                const userResult = res.data.result;
                Cookies.set("roles", userResult?.roles[0]?.name);
                set({ User: userResult, isLoadingg: false });
            } else {
                set({ error: res?.data?.message || 'Lỗi khi lấy thông tin người dùng.', isLoadingg: false });
            }
            if(res.status === 401){
                const authTokenValue = Cookies.get("authToken");
                const refreshValue=Cookies.get("refreshToken");
                console.log("error 401")
                if(authTokenValue&&refreshValue){

                    const response = await refreshToken(authTokenValue,refreshValue)
                    const newAuth= response.data.result.token;
                    const newRefresh=response.data.result.refreshToken;
                    Cookies.remove("authToken")
                    Cookies.remove("refreshToken")
                    Cookies.set("authToken",newAuth)
                    Cookies.set("refreshToken",newRefresh)
                }
            }
        } catch (err: any) {
            console.error(err);
            set({ error: err.message || 'Lỗi mạng khi lấy thông tin người dùng.', isLoadingg: false });
        }
    },

    fetchCart: async () => {
        set({ isLoadingg: true, error: null }); // Reset error
        try {
            const res = await getCartFromBackEnd();
            
            // Log dữ liệu để debug
            console.log('API Cart Response:', res);

            if (res.data.code === 1000) {
                // Gán trực tiếp đối tượng CartResponse vào state
                set({ Cart: res.data.result, isLoadingg: false });
            } else {
                set({ 
                    error: res.data.message || 'Lỗi khi lấy thông tin giỏ hàng.', 
                    isLoadingg: false,
                    Cart: null // Đảm bảo Cart là null khi có lỗi
                });
            }
        } catch (err: any) {
            console.error(err);
            set({ 
                error: err.message || 'Lỗi mạng khi lấy giỏ hàng.', 
                isLoadingg: false,
                Cart: null // Đảm bảo Cart là null khi có lỗi
            });
        }
    },
}));