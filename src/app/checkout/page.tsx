'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {  CheckCircle, QrCode, ClipboardList, MapPin, Plus } from 'lucide-react';
import { getInit, startOrder, CreateOrderRequest, startOrderReq } from '@/app/Service/Order';
import { getAddress, createAddress, CreateAddressReq } from '@/app/Service/address';
import { useProfileStore } from '@/app/zustand/store';
import { OrderResponse, AddressResponse } from '@/types/index';
import { QRPayment } from '@/app/components/QRPayment';

// Component Modal tạo địa chỉ mới
const CreateAddressModal = ({ isOpen, onClose, onCreateSuccess }: { isOpen: boolean; onClose: () => void; onCreateSuccess: () => void; }) => {
    // State cho form, sử dụng type CreateAddressReq
    const [formData, setFormData] = useState<CreateAddressReq>({
        city: '', 
        district: '', 
        commune: '', 
        address: '', 
        phoneNumber: '', 
        Name: '', 
        isDefault: false
    });
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);

   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // Kiểm tra loại input một cách an toàn
        const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        setError(null);
        try {
            const res = await createAddress(formData);
            console.log("tao dia chi")
            if (res.code === 1000) {
                onCreateSuccess(); // Gọi hàm cha để cập nhật danh sách địa chỉ
                onClose();
            } else {
                setError(res.message || "Lỗi khi tạo địa chỉ.");
            }
        } catch (err: any) {
            setError(err.message || "Lỗi mạng.");
        } finally {
            setIsCreating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                <h3 className="text-xl font-bold mb-4">Thêm địa chỉ mới</h3>
                
                    {/* Các input form cho địa chỉ */}
                     <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Các trường nhập liệu */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tên người nhận</label>
                        <input type="text" name="Name" value={formData.Name} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                        <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
                        <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                        <input type="text" name="district" value={formData.district} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
                        <input type="text" name="commune" value={formData.commune} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Địa chỉ cụ thể</label>
                        <textarea name="address" value={formData.address} onChange={handleInputChange} required className="w-full p-2 border rounded-md" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="w-4 h-4 text-purple-600 focus:ring-purple-500" />
                        <label className="text-sm text-gray-700">Đặt làm địa chỉ mặc định</label>
                    </div>

                    <button type="submit" disabled={isCreating} className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors">
                        {isCreating ? "Đang tạo..." : "Tạo địa chỉ"}
                    </button>
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                </form>                   
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
                <button onClick={onClose} className="mt-4 text-gray-500 hover:text-gray-700">Đóng</button>
            </div>
        </div>
    );
};

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { User: user, fetchProfile } = useProfileStore();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);

  const [selectedAddress, setSelectedAddress] = useState<AddressResponse | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [note, setNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCreateAddressModal, setShowCreateAddressModal] = useState(false);
  const [showQRPayment, setShowQRPayment] = useState(false);
  const [qrPaymentData, setQrPaymentData] = useState<{orderId: number, qrCode: string} | null>(null);

  useEffect(() => {
    const fetchInitData = async () => {
      setLoading(true);
      setError(null);
      try {
       

        const addressesRes = await getAddress();
        
        if (addressesRes.code === 1000 && addressesRes.result) {
            setAddresses(addressesRes.result);
            // Sửa lỗi: Thêm Optional Chaining để đảm bảo mảng tồn tại
            const defaultAddress = addressesRes.result.find((addr: AddressResponse) => addr.isDefault) || addressesRes.result[0];
            if (defaultAddress) {
                setSelectedAddress(defaultAddress);
            }
        }

        const res = await getInit();

        if (res.code === 1000 && res.result) {
          setOrder(res.result);
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

    const isQR = paymentMethod === 'qr';

    const startOrderData: startOrderReq = {
      orderId: order.orderId,
      addressId: selectedAddress.id,
      isQR: isQR,
      note: note,
    };

    try {
      const res = await startOrder(startOrderData);
      if (res.code === 1000) {
        if (isQR && res.result.qrcode) {
          // For QR payment, show QR payment component
          setQrPaymentData({
            orderId: res.result.orderId,
            qrCode: res.result.qrcode
          });
          setShowQRPayment(true);
        } else {
          // For COD payment, redirect to success page
          router.push(`/payment-success?orderId=${res.result.QRCode}`);
        }
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

  const handleCancelQRPayment = () => {
    setShowQRPayment(false);
    setQrPaymentData(null);
  };

  const handleAddressCreated = () => {
      getAddress().then((res: { code: number; result: AddressResponse[]; }) => {
          if (res.code === 1000 && res.result) {
              setAddresses(res.result);
          }
      });
  };

  if (loading || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {loading ? 'Đang tải thông tin đơn hàng...' : error}
      </div>
    );
  }

  const total = order.totalAmount + order.taxAmount + order.shippingFee - order.discountAmount;

  // Show QR Payment component if QR payment is active
  if (showQRPayment && qrPaymentData && user) {
    return (
      <QRPayment
        orderId={qrPaymentData.orderId}
        userId={user.id.toString()}
        qrCode={qrPaymentData.qrCode}
        totalAmount={total}
        onCancel={handleCancelQRPayment}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
          <p className="text-gray-600 mt-2">Hoàn tất đơn hàng của bạn một cách an toàn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Phương thức thanh toán & Địa chỉ</h3>
            <form onSubmit={handleStartOrder} className="space-y-6">
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

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</h3>
                <div className="space-y-2">
                  {addresses.map(address => (
                    <label key={address.id} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="address" value={address.id} checked={selectedAddress?.id === address.id} onChange={() => setSelectedAddress(address)} className="text-purple-600 focus:ring-purple-500" />
                      <div className="flex-1">
                        <p className="font-medium">{address.name} - {address.phoneNumber}</p>
                        <p className="text-sm text-gray-600">{address.address}, {address.commune}, {address.district}, {address.city}</p>
                      </div>
                    </label>
                  ))}
                  <button type="button" onClick={() => setShowCreateAddressModal(true)} className="w-full text-purple-600 text-sm font-medium flex items-center justify-center space-x-2 p-3 border-dashed border-gray-300 rounded-lg hover:bg-gray-50">
                    <Plus className="w-4 h-4" /> <span>Thêm địa chỉ mới</span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ghi chú</h3>
                <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Ghi chú cho người bán..."></textarea>
              </div>

              <button type="submit" disabled={isProcessing || !selectedAddress} className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors block text-center font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  `Đặt hàng ${total.toLocaleString('vi-VN')} ₫`
                )}
              </button>
            </form>
          </div>

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
          </div>
        </div>
      </div>
      <CreateAddressModal
          isOpen={showCreateAddressModal}
          onClose={() => setShowCreateAddressModal(false)}
          onCreateSuccess={handleAddressCreated}
      />
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
