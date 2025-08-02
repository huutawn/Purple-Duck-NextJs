'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/app/types/product'; // Đảm bảo đường dẫn này đúng
// import { useCart } from '@/hooks/useCart'; // XÓA IMPORT NÀY

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  // const { addToCart } = useCart(); // XÓA DÒNG NÀY

  // XÓA HÀM handleAddToCart NÀY VÌ KHÔNG CÒN SỬ DỤNG
  // const handleAddToCart = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   if (product.productVariants && product.productVariants.length > 0) {
  //     const defaultVariant = product.productVariants[0];
  //     addToCart(product, 1, defaultVariant.id);
  //   } else {
  //     console.warn("Không có biến thể nào để thêm vào giỏ hàng!");
  //   }
  // };

  // Tính toán giá thấp nhất từ tất cả các biến thể của sản phẩm
  const minPrice = product.productVariants && product.productVariants.length > 0
    ? Math.min(...product.productVariants.map(v => v.price))
    : 0;

  // Yêu cầu: "tạm thời chưa có giảm giá"
  const discountPercentage = 0;

  // Yêu cầu: "tạm thời chưa có giảm giá", nên giá gốc sẽ không hiển thị
  const displayOriginalPrice = 0;

  // Lấy ảnh hiển thị cho Product Card
  const displayImage = product.coverImage || 
                       (product.images && product.images.length > 0 ? product.images[0].imageUrl : '') || 
                       '/placeholder.png';

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group ${className}`}>
      <div className="relative">
        {/* Link đến trang chi tiết sản phẩm, ưu tiên slug nếu có */}
        <Link href={`/product/${product.id}`}>
          <Image
            src={displayImage}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Phần trăm giảm giá (sẽ không hiển thị) */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}

        {/* Nút yêu thích */}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        {/* Link đến trang chi tiết sản phẩm */}
        <Link href={`/product/${product.slug || product.id}`}>
          <h3 className="font-semibold text-lg text-gray-800 hover:text-purple-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Hiển thị tên danh mục nếu có */}
        {product.categoryName && (
          <p className="text-sm text-gray-500 mt-1">{product.categoryName}</p>
        )}

        <div className="flex items-center space-x-2 mt-2">
          <div className="flex items-center">
            {/* Rating cố định 5 sao */}
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm text-gray-600 ml-1">5.0</span>
          </div>
          {/* Lượt mua hàng */}
          <span className="text-sm text-gray-500">({product.purchase ?? 0} lượt mua)</span>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            {/* Hiển thị giá thấp nhất của sản phẩm */}
            <span className="text-2xl font-bold text-purple-600">${minPrice.toFixed(2)}</span>
            {/* Giá gốc (sẽ không hiển thị) */}
            {displayOriginalPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">${displayOriginalPrice.toFixed(2)}</span>
            )}
          </div>
          {/* THAY ĐỔI NÚT "THÊM VÀO GIỎ HÀNG" THÀNH LINK ĐẾN TRANG CHI TIẾT */}
          <Link
            href={`/product/${product.slug || product.id}`}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            title="Xem chi tiết để thêm vào giỏ hàng" // Thêm tooltip
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
          {/* KẾT THÚC THAY ĐỔI */}
        </div>
      </div>
    </div>
  );
}