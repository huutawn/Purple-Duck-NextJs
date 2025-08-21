'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, Package, Heart, Settings, LogOut, Edit3, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { myInfo } from '@/app/Service/User';
import { getAllOrder } from '@/app/Service/Order';
import { UserResponse, OrderResponse } from '@/types';

export default function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- THÊM STATE PHÂN TRANG ---
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5); // Mặc định 5 đơn hàng mỗi trang
  const [totalElements, setTotalElements] = useState(0); // Tổng số đơn hàng
  const [keyword, setKeyword] = useState(''); // Thêm state keyword cho hàm getAllOrder
  // --- KẾT THÚC THÊM STATE ---

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [userRes, ordersRes] = await Promise.all([
        myInfo(),
        getAllOrder({ page, size, keyword }) // TRUYỀN THAM SỐ PHÂN TRANG VÀ TÌM KIẾM
      ]);
      
      // Gán dữ liệu người dùng
      if (userRes.data.code === 1000 && userRes.data.result) {
        setUser(userRes.data.result);
        setFormData({
          firstName: userRes.data.result.firstName || '',
          lastName: userRes.data.result.lastName || '',
          email: userRes.data.result.email || '',
          phone: userRes.data.result.address?.phoneNumber || '',
          address: userRes.data.result.address ? `${userRes.data.result.address.address}, ${userRes.data.result.address.commune}, ${userRes.data.result.address.district}, ${userRes.data.result.address.city}` : '',
        });
      }

      // Gán dữ liệu đơn hàng
      if (ordersRes.code === 1000 && ordersRes.result?.data) {
        setOrders(ordersRes.result.data); // SỬA: Lấy từ .data
        setTotalElements(ordersRes.result.totalElements); // Cập nhật tổng số đơn hàng
      } else if (ordersRes.code === 1000 && Array.isArray(ordersRes.result)) {
        setOrders(ordersRes.result);
        setTotalElements(ordersRes.result.length); // Giả định
      } else {
        console.warn("API getAllOrder didn't return expected data.");
      }
    } catch (err: any) {
      console.error('Lỗi khi lấy dữ liệu tài khoản:', err);
      setError(err.message || 'Không thể tải dữ liệu tài khoản.');
    } finally {
      setLoading(false);
    }
  }, [page, size, keyword]); // useEffect chạy lại khi page/size/keyword thay đổi

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= Math.ceil(totalElements / size)) {
      setPage(newPage);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'orders', label: 'Lịch sử đơn hàng', icon: Package },
    { id: 'wishlist', label: 'Danh sách yêu thích', icon: Heart },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
      case 'pending': // Thêm case cho pending
      case 'init': // Thêm case cho init
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (error || !user) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Lỗi: {error}</div>;
  }
  
  const totalPages = Math.ceil(totalElements / size);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src={user?.picture || "/placeholder.png"}
                  alt="Avatar"
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
                <p className="text-purple-200">{user?.email}</p>
                <p className="text-purple-200 text-sm">Thành viên từ {new Date(user?.timeCreateToken).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-gray-50 border-r">
              <nav className="p-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </button>
                      </li>
                    );
                  })}
                  <li className="border-t pt-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-5 h-5" />
                      <span>Đăng xuất</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isEditing ? 'Lưu thay đổi' : 'Chỉnh sửa'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên đệm</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tên</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Lịch sử đơn hàng</h2>
                  <div className="space-y-4">
                    {orders.length > 0 ? (
                      orders.map((order) => (
                        <div key={order.orderId} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-4">
                              <Image
                                src={order.subOrders[0]?.orderItems[0]?.productVariant?.image || '/placeholder.png'}
                                alt="Order item"
                                width={64}
                                height={64}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                              <div>
                                <h3 className="font-semibold text-lg">Đơn hàng #{order.orderId}</h3>
                                <p className="text-gray-600">Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                                <p className="text-sm text-gray-500">{order.subOrders.flatMap(sub => sub.orderItems).length} sản phẩm</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                              <p className="font-semibold text-lg">{order.totalAmount.toLocaleString('vi-VN')} ₫</p>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <Link
                              href={`/order/${order.orderId}`}
                              className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                            >
                              <Eye className="w-4 h-4" />
                              <span>Xem chi tiết</span>
                            </Link>
                            <div className="flex space-x-2">
                              <button className="text-purple-600 hover:text-purple-700 font-medium">
                                Đặt lại
                              </button>
                              <button className="text-gray-600 hover:text-gray-700 font-medium">
                                Theo dõi
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500">Bạn chưa có đơn hàng nào.</div>
                    )}
                  </div>
                  {/* Phân trang */}
                  <div className="flex items-center justify-between mt-8">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-2 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-gray-700">
                        Trang {page} / {Math.ceil(totalElements / size) || 1}
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === Math.ceil(totalElements / size)}
                        className="px-3 py-2 text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Danh sách yêu thích</h2>
                  <div className="text-center py-12">
                    <Heart className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Danh sách yêu thích của bạn đang trống</h3>
                    <p className="text-gray-600">Lưu lại những sản phẩm bạn yêu thích để xem sau</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Cài đặt riêng tư</h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="text-purple-600 focus:ring-purple-500" />
                          <span>Gửi email khuyến mãi</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="text-purple-600 focus:ring-purple-500" />
                          <span>Thông báo SMS cho đơn hàng</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="text-purple-600 focus:ring-purple-500" />
                          <span>Chia sẻ dữ liệu với đối tác</span>
                        </label>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Bảo mật</h3>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Đổi mật khẩu
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}