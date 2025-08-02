import { myInfo } from "@/app/Service/User";
import { create } from "zustand";
import Cookies from "js-cookie";
import { getCart } from "@/app/Service/Cart";
//zustand
interface Profile {
  address: string;
  city: string;
  country: string;
  dob: string;
  gender: string;
  id: number;
  phone: string;
  fullName: string;
  email: string;
}
interface Address {
  name: string;
  address: string;
  detailsAddress: string;
  phone: string;
  addressDefault: boolean;
  isType: string;
  id: number;
}
[];
interface Cart {
  items: {
    products_order: {
      id_atributes_name: number;
      id_atributes_value: number;
      atributes_name: string;
      id: number;
      atributes_Value: string;
      id_product: number;
      images: {
        url: string;
      }[];
      attributesValuesProduct: {
        id: number;
        name: string;
        price: number;
        quantity: number;
        image?: {
          url: string;
        };
      }[];
      name: string;
      price: number;
    };
    id: number;
    quantity: number;
    unitPrice: number;
  }[];
}
interface dataProduct {
  views: number;
  sku: string;
  id: number;
  title: string;
  description: string;
  price: number;
  category: number;
  trademark: string;
  origin: string;
  style: string;
  material: string;
  discount: number;
  quantity: number;
  images: {
    url: string | null;
  }[];
  attributes: {
    name: string;
    id: string;
    attributesValues: {
      name: string;
      id: string;
      price: number;
      quantity: number;
      image: {
        url: string | null;
      };
    }[];
  }[];
}

interface User {
  id: string;
  fullName: string;
  email: string;
  addresses: Address[];
  seller: {
    phone: string;
    id: number;
    description: string;
    name: string;
    image: {
      url: string;
    };
    taxCode: string;
  };
  roles: [
    {
      name: string;
      description: string;
      permissions: [];
    }
  ];
}

interface ProfileState {
  Cart: Cart | null;
  User: User | null;
  isLoadingg: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  fetchCart: () => Promise<void>;
  Avt: string;
}

export function getInitials(name: string): string {
  // Loại bỏ khoảng trắng thừa và tách thành mảng các từ
  const words = name.trim().split(/\s+/);

  // Lấy 2 từ cuối (nếu có ít hơn 2 từ, lấy tất cả)
  const lastTwoWords = words.slice(-2);

  // Lấy chữ cái đầu của mỗi từ và gộp lại
  const initials = lastTwoWords
    .map((word) => word.charAt(0).toUpperCase())
    .join("");

  // Trả về 2 ký tự đầu tiên (hoặc ít hơn nếu không đủ)
  return initials.slice(0, 2);
}
// Tạo Zustand store
export const useProfileStore = create<ProfileState>((set) => ({
  Cart: null,
  User: null,
  isLoadingg: false,
  error: null,
  Avt: "",

  fetchProfile: async () => {
    set({ isLoadingg: true });
    await myInfo()
      .then((res) => {
        console.log(res?.data?.result);
        Cookies.set("roles", res?.data?.result?.roles[0]?.name);
        set({ User: res?.data?.result, isLoadingg: false });
        return res;
      })
      .catch((err) => {
        console.log(err);
        set({ error: err, isLoadingg: false });
        return err;
      });
  },
  fetchCart: async () => {
    set({ isLoadingg: true });
    await getCart()
      .then((res) => {
        console.log(res?.data?.result);
        set({ isLoadingg: false });
        set({ Cart: res?.data?.result });
        return res;
      })
      .catch((err) => {
        console.log(err);
        set({ error: err, isLoadingg: false });
        return err;
      });
  },
}));
