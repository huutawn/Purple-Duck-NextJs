export type User = {
  id: string;
  email: string;
  firstName:string;
  lastName:string;
  role: string;
};

export type ProductVariant = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  attributes: {
    attributeId: number;
    attributeName: string;
    attributeValue: { attributeValueId: number; value: string; displayValue: string }[];
  }[];
};

export type Product = {
  id: number;
  categoryId: number;
  categoryName?: string; // THÊM DÒNG NÀY: Để lưu trữ tên danh mục
  sellerId: number;
  name: string;
  slug: string;
  coverImage: string;
  images: { id: number; productId: number; variantId: number | null; imageUrl: string; displayOrder: number; createdAt: string }[];
  metaTitle: string | null;
  purchase: number | null;
  metaDescription: string | null;
  warrantyInfo: string;
  createdAt: string;
  productVariants: ProductVariant[];
  active: boolean;
};

export type ProductsResponse = {
  code: number;
  result: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalElements: number;
    data: Product[];
  };
};
export type AttributeResponse = {
  attributeId: number; // Thêm id nếu BE trả về
  attributeName: string;
  attributeValue: { attributeValueId: number; value: string; displayValue: string }[];
};

// Định nghĩa VariantQuantity (từ CartItemResponse)
export type VariantQuantity = {
  variantId: number; // ID của ProductVariant
  productName: string; 
  productId:number;// Tên sản phẩm từ Product
  price: number; // BigDecimal bên BE sẽ là number/string bên TS
  stock: number; // Số lượng tồn kho
  image: string; // Link ảnh
  attributes: AttributeResponse[]; // Thuộc tính của biến thể
  quantity: number; // Số lượng của biến thể này trong giỏ
};

// Định nghĩa CartItemResponse (từ CartResponse)
export type CartItemResponse = {
  id: number; // ID của CartItem (Long bên BE)
  addedAt: string; // LocalDateTime bên BE sẽ là string bên TS
  variants: VariantQuantity[]; // Danh sách biến thể và số lượng
};

// Định nghĩa CartResponse (Top-level response)
export type CartResponse = {
  id: number; // Long bên BE
  userId: string;
  userName: string;
  cartItems: CartItemResponse[]; // Danh sách các CartItemResponse
  sessionId: string;
  createdAt: string; // LocalDateTime bên BE
  updatedAt: string; // LocalDateTime bên BE
};

export type CartItemVariantInfo = {
  id: number; // ID của ProductVariant
  sku: string;
  price: number;
    stock: number; // <-- Thuộc tính này được yêu cầu

  image: string; // Ảnh của biến thể
  attributes: { attributeName: string; value: string; }[]; // Các thuộc tính đã chọn của biến thể
   attributeValueIds: number[]; // <-- THÊM DÒNG NÀY

};

export type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
};


export type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
};