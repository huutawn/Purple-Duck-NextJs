// app/seller/types/product.ts (tùy chọn, nếu muốn tách riêng)
export type AttributeValue = {
  value: string;
  displayValue: string;
};

export type Attribute = {
  name: string;
  displayName: string;
  attributeValue: AttributeValue[];
};

export type Variant = {
  sku: string;
  price: number;
  stock: number;
  image: string;
  attributes: Attribute[];
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
export type CreateProductRequest = {
  categoryId: number;
  name: string;
  slug: string;
  images: string[];
  coverImage: string;
  warrantyInfo: string;
  variants: Variant[];
};
export type CartItem = {
  id: string;
  productId: number;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
};