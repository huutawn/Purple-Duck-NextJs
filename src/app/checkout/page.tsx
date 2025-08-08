'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Lock, CheckCircle, QrCode, ClipboardList, MapPin, Plus } from 'lucide-react';
import { getInit, startOrder, CreateOrderRequest, startOrderReq } from '@/app/Service/Order'; // Import StartOrderReq
import { useProfileStore } from '@/app/zustand/store';
// Import các type đã được thống nhất
import { OrderResponse, AddressResponse, UserAddressResponse } from '@/types/index'; 

function Checkout() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // Lấy User từ store, và User.addresses giờ là mảng
  const { User: user, fetchProfile } = useProfileStore();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // selectedAddress có kiểu dữ liệu khớp với item trong user.addresses
  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch init order data and user address on mount
  useEffect(() => {
    const fetchInitData = async () => {
      setLoading(true);
      setError(null);
      try {
       

        if (!user) {
            await fetchProfile();
        }

        const res = await getInit();

        if (res.code === 1000 && res.result) {
          setOrder(res.result);
          // SỬA: Truy cập user?.addresses thay vì user?.address
          const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0];
          if (defaultAddress) {
            setSelectedAddress(defaultAddress);
          }
        } else {
          setError(res.message || 'Lỗi khi lấy thông tin đơn hàng.');
        }
      } catch (err: any) {
        console.error('Failed to fetch checkout data:', err);
        setError(err.message || 'Lỗi khi tải dữ liệu thanh toán.');
      } finally {
        setLoading(false);
      }
    };
    fetchInitData();
  }, [searchParams, user, fetchProfile, router]);

  const handleStartOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    if (!order || !selectedAddress) {
      setIsProcessing(false);
      setError('Vui lòng chọn địa chỉ giao hàng và đảm bảo giỏ hàng hợp lệ.');
      return;
    }
    
    // SỬA: Ánh xạ paymentMethod sang isQR
    const isQR = paymentMethod === 'qr';

    // SỬA: Tạo request body cho startOrder
    const startOrderData: startOrderReq = {
      orderId: order.orderId,
      addressId: selectedAddress.id,
      isQR: isQR,
      note: note, // Thêm note
    };

    try {
      const res = await startOrder(startOrderData);
      if (res.code === 1000) {
        router.push(`/order-success?orderId=${res.result.orderId}`);
        // clearCart();
      } else {
        setError(res.message || 'Có lỗi xảy ra khi đặt hàng.');
      }
    } catch (err: any) {
      console.error('Lỗi khi đặt hàng:', err);
      setError(err.message || 'Lỗi mạng khi đặt hàng.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {loading ? 'Đang tải thông tin đơn hàng...' : error}
      </div>
    );
  }

  const total = order.totalAmount + order.taxAmount + order.shippingFee - order.discountAmount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn một cách an toàn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form thanh toán */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán & Địa chỉ</h3>
            <div className="space-y-6">
              {/* Lựa chọn phương thức thanh toán */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="paymentMethod" value="qr" checked={paymentMethod === 'qr'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-purple-600 focus:ring-purple-500" />
                    <QrCode className="w-5 h-5 text-gray-600" />
                    <span>Thanh toán bằng QR</span>
                  </label>
                  <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-purple-600 focus:ring-purple-500" />
                    <ClipboardList className="w-5 h-5 text-gray-600" />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                </div>
              </div>

              {/* Lựa chọn địa chỉ */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
                <div className="space-y-2">
                  {user?.addresses?.map(address => ( // SỬA: Sử dụng user?.addresses
                    <label key={address.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="address" value={address.id} checked={selectedAddress?.id === address.id} onChange={() => setSelectedAddress(address)} className="text-purple-600 focus:ring-purple-500" />
                      <div className="flex-1">
                        <p className="font-medium">{address.name} - {address.phoneNumber}</p>
                        <p className="text-sm text-gray-600">{address.address}, {address.commune}, {address.district}, {address.city}</p>
                      </div>
                    </label>
                  ))}
                  <button onClick={() => alert("Chức năng thêm địa chỉ mới sẽ được xây dựng sau")} className="w-full text-purple-600 text-sm font-medium flex items-center justify-center space-x-2 p-3 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                    <Plus className="w-4 h-4" /> <span>Thêm địa chỉ mới</span>
                  </button>
                </div>
              </div>

              {/* Ghi chú đơn hàng */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ghi chú</h3>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Ghi chú cho người bán..."></textarea>
              </div>
            </div>
          </div>

          {/* Tóm tắt đơn hàng */}
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-4 mb-6">
              {order.subOrders.flatMap(sub => sub.orderItems).map(item => (
                <div key={item.id} className="flex items-center space-x-3">
                  <Image src={item.productVariant.image} alt={item.productVariant.productName} width={48} height={48} className="w-12 h-12 object-cover rounded" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.productVariant.productName}</h4>
                    <p className="text-xs text-gray-600">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-purple-600">
                    {item.price.toLocaleString('vi-VN')} ₫
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Tổng phụ</span>
                <span>{order.totalAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between">
                <span>Vận chuyển</span>
                <span>{order.shippingFee.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between">
                <span>Thuế</span>
                <span>{order.taxAmount.toLocaleString('vi-VN')} ₫</span>
              </div>
              <div className="flex justify-between font-semibold text-lg pt-2 border-t">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')} ₫</span>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm text-green-800">Thông tin thanh toán của bạn được bảo mật và mã hóa</span>
              </div>
            </div>

            <button onClick={handleStartOrder} disabled={isProcessing || !selectedAddress} className="w-full mt-6 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors block text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Đang xử lý...
                </div>
              ) : (
                `Đặt hàng ${total.toLocaleString('vi-VN')} ₫`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
