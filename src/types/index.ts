export type User = {
  id: string;
  email: string;
  firstName:string;
  lastName:string;
  addresses:AddressResponse[];
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
export type AddToCartBackendRequest = {
    productId: number;
    attributeValueIds: number[];
    quantity: number;
};
export type UserAddressResponse = {
  id: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  name: string;
  isDefault: boolean;
};

export type AttributeValueResponse = {
  attributeValueId: number;
  value: string;
  displayValue: string;
};
export type AddressResponse={
  id:number;
  userId:string;
  userName:string;
  name:string;
  phoneNumber:string;
  city:string;
  district:string;
  commune:string;
  address:string;
  isDefault:boolean;
}


export type ProductVariantResponse = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  price: number;
  stock: number;
  image: string;
  attributes: AttributeResponse[];
};

export type OrderItemResponse = {
  id: number;
  productVariant: ProductVariantResponse;
  quantity: number;
  price: number;
  subTotal: number;
};

export type SubOrderResponse = {
  subOrderId: number;
  orderId: number;
  userName: string;
  status: string;
  orderItems: OrderItemResponse[];
  subTotal: number;
  createdAt: string;
};

export type OrderResponse = {
  orderId: number;
  userId: string;
  userName: string;
  totalAmount: number; // BigDecimal bên BE sẽ là number
  shippingFee: number;
  taxAmount: number;
  discountAmount: number;
  couponCode?: string;
  status: string;
  paymentMethod: string;
  userAddress: UserAddressResponse;
  subOrders: SubOrderResponse[];
  trackingNumber?: string;
  shippingCarrier?: string;
  estimatedDeliveryDate?: string;
  QRCode?: string;
  note?: string;
  createdAt: string;
};

// Kiểu dữ liệu request cho API tạo order
export type OrderItemRequest = {
  productId: number;
  attributeValueIds: number[];
  quantity: number;
};

export type CreateOrderRequest = {
  items: OrderItemRequest[];
  shippingAddressId: number;
  paymentMethod: string;
  couponCode?: string;
  notes?: string;
  fromCart?: boolean;
};
