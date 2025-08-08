'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { createOrder,OrderItemRequest,CreateOrderRequest } from '@/app/Service/Order'; // Import hàm createOrder từ Service/Order
import { useRouter } from 'next/navigation';

export default function Cart() {
  const { cart, updateCartItem, removeFromCart, getCartTotal, getCart } = useCart();
  const [selectedItems, setSelectedItems] = useState<number[]>([]); // Mảng các ID item đã chọn
  const router = useRouter();
  // 1. Lấy dữ liệu giỏ hàng mới nhất khi component được tải
  useEffect(() => {
    getCart();
  }, []);
  // 2. Kiểm tra an toàn, tránh lỗi khi cart là undefined
  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto w-24 h-24 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
            <p className="text-gray-600 mb-8">Hãy bắt đầu mua sắm để thêm các mặt hàng vào giỏ hàng của bạn!</p>
            <Link
              href="/products"
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    );
  }
  // Chọn tất cả hoặc bỏ chọn
  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]); // Bỏ chọn tất cả
    } else {
      setSelectedItems(cart.map(item => item.id)); // Chọn tất cả
    }
  };
  // Toggle chọn từng item
  const toggleSelectItem = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };
  // Tính tổng tiền cho các item đã chọn
  const getSelectedTotal = () => {
    return cart.reduce((total, item) => {
      if (selectedItems.includes(item.id)) {
        const variant = item.variants[0];
        return total + (variant.price * variant.quantity);
      }
      return total;
    }, 0);
  };
  // Xử lý thanh toán (tạo order cho các item đã chọn)
  const handleCheckout = async () => {
    const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
    const orderItems: OrderItemRequest[] = selectedCartItems.map(item => {
      const variant = item.variants[0];
      const attributeValueIds = variant.attributes.flatMap(attr =>
        attr.attributeValue.map(av => av.attributeValueId)
      );
      return {
        productId: variant.productId,
        attributeValueIds,
        quantity: variant.quantity
      };
    });
    const request: CreateOrderRequest = {
      items: orderItems,
      shippingAddressId: 1, // Giả sử lấy từ state hoặc hardcode, bạn có thể thay đổi
      paymentMethod: 'COD', // Giả sử hardcode, bạn có thể lấy từ input
      couponCode: '', // Optional
      notes: '', // Optional
      fromCart: true
    };
    try {
      await createOrder(request);
      // Optional: Xóa các item đã chọn khỏi cart sau khi thanh toán
      selectedItems.forEach(id => removeFromCart(id));
      router.replace('/checkout')
    } catch (error) {
      console.error('Lỗi khi tạo order:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Checkbox chọn tất cả */}
            <div className="flex items-center space-x-3 mb-4">
              <input
type="checkbox"
checked={selectedItems.length === cart.length}
onChange={toggleSelectAll}
className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <label className="font-medium text-gray-900">Chọn tất cả</label>
            </div>
            {cart.map((item) => {
              // 3. Lấy thông tin biến thể ra một biến riêng để dễ truy cập
              const variant = item.variants[0];
              // Tránh lỗi nếu một item không có variant
              if (!variant) return null;
              return (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    {/* Checkbox chọn item */}
                    <input
type="checkbox"
checked={selectedItems.includes(item.id)}
onChange={() => toggleSelectItem(item.id)}
className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
src={variant.image || '/placeholder.png'}
alt={variant.productName}
layout="fill"
objectFit="cover"
className="rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900">
                        <Link href={`/product/${variant.productId}`} className="hover:text-purple-600 transition-colors">
                            {variant.productName}
                        </Link>
                      </h3>
                      {variant.attributes && variant.attributes.length > 0 && (
                        <p className="text-gray-600 text-sm mt-1">
                          {/* 4. Sửa lỗi truy cập thuộc tính */}
                          {variant.attributes.map(attr =>
                            `${attr.attributeName}: ${attr.attributeValue[0]?.value}`
                          ).join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
onClick={() => updateCartItem(item.id, variant.quantity - 1)}
className="p-1 rounded-md hover:bg-gray-100 transition-colors"
disabled={variant.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{variant.quantity}</span>
                      <button
onClick={() => updateCartItem(item.id, variant.quantity + 1)}
className="p-1 rounded-md hover:bg-gray-100 transition-colors"
disabled={variant.quantity >= variant.stock}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="font-semibold text-lg text-purple-600">
                        {/* 5. Định dạng tiền tệ VNĐ */}
                        {(variant.price * variant.quantity).toLocaleString('vi-VN')} ₫
                      </p>
                      <button
onClick={() => removeFromCart(item.id)}
className="text-red-500 hover:text-red-700 transition-colors mt-2"
title="Xóa sản phẩm khỏi giỏ hàng"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h3>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span>Tổng phụ</span>
                  <span>{getSelectedTotal().toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
                <div className="flex justify-between">
                  <span>Thuế (Ước tính 8%)</span>
                  <span>{(getSelectedTotal() * 0.08).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span>{(getSelectedTotal() * 1.08).toLocaleString('vi-VN')} ₫</span>
                  </div>
                </div>
              </div>
              <button
onClick={handleCheckout}
className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors block text-center font-medium"
              >
                Tiến hành thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}