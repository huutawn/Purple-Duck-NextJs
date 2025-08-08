'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/app/types/product';

type ProductCardProps = {
  product: Product;
  className?: string;
};

export default function ProductCard({ product, className = '' }: ProductCardProps) {
  const minPrice = product.productVariants && product.productVariants.length > 0
    ? Math.min(...product.productVariants.map(v => v.price))
    : 0;

  const discountPercentage = 0;
  const displayOriginalPrice = 0;

  const displayImage = product.coverImage ||
                       (product.images && product.images.length > 0 ? product.images[0].imageUrl : '') || 
                       '/placeholder.png';

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group ${className}`}>
      <div className="relative">
        {/* SỬA: Dùng trực tiếp product.id cho Link */}
        <Link href={`/product/${product.id}`}>
          <Image
            src={displayImage}
            alt={product.name}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}
        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>
      
      <div className="p-4">
        {/* SỬA: Dùng trực tiếp product.id cho Link */}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg text-gray-800 hover:text-purple-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {product.categoryName && (
          <p className="text-sm text-gray-500 mt-1">{product.categoryName}</p>
        )}
        <div className="flex items-center space-x-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-sm text-gray-600 ml-1">5.0</span>
          </div>
          <span className="text-sm text-gray-500">({product.purchase ?? 0} lượt mua)</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-purple-600">
              {minPrice.toLocaleString('vi-VN')} ₫
            </span>
            {displayOriginalPrice > 0 && (
              <span className="text-sm text-gray-500 line-through">${displayOriginalPrice.toFixed(2)}</span>
            )}
          </div>
          {/* SỬA: Dùng trực tiếp product.id cho Link */}
          <Link
            href={`/product/${product.id}`}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
            title="Xem chi tiết để thêm vào giỏ hàng"
          >
            <ShoppingCart className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}