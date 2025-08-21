'use client';

import React, { useState, useEffect } from 'react';
import { Users, Package, DollarSign, TrendingUp, Shield, Settings, AlertTriangle, CheckCircle, Edit, Trash2, Eye, UserCheck, UserX, LogOut } from 'lucide-react';
import { getUsers, deleteUser } from '@/app/Service/User';
import { logout } from '@/app/Service/Auth';
import { User, ApiResponse } from '@/app/types/user';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const stats = [
    { title: 'Tổng Người Dùng', value: users.length.toString(), icon: Users, color: 'bg-blue-500' },
    { title: 'Tổng Sản Phẩm', value: '1,234', icon: Package, color: 'bg-green-500' },
    { title: 'Tổng Doanh Thu', value: '3,125,430,000 ₫', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Tỷ Lệ Tăng Trưởng', value: '+15.3%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Tổng Quan', icon: TrendingUp },
    { id: 'users', label: 'Người Dùng', icon: Users },
    { id: 'products', label: 'Sản Phẩm', icon: Package },
    { id: 'orders', label: 'Đơn Hàng', icon: CheckCircle },
    { id: 'reports', label: 'Báo Cáo', icon: AlertTriangle },
    { id: 'settings', label: 'Cài Đặt', icon: Settings },
  ];

  // Function to fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getUsers();
      if (response.data.code === 1000) {
        setUsers(response.data.result || []);
      } else {
        setError(response.data.message || 'Không thể tải danh sách người dùng');
      }
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError('Lỗi kết nối đến server. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert('Xóa người dùng thành công!');
      } catch (err: any) {
        console.error('Error deleting user:', err);
        alert('Không thể xóa người dùng. Vui lòng thử lại.');
      }
    }
  };

  // Fetch users when users tab is active or component mounts (for statistics)
  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else if (activeTab === 'overview' && users.length === 0) {
      // Fetch users for statistics on overview tab
      fetchUsers();
    }
  }, [activeTab]);
  
  // Initial data fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to handle logout
  const handleLogout = async () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      try {
        const token = Cookies.get('authToken');
        if (token) {
          await logout(token);
        }
        // Clear all cookies
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        
        // Redirect to login page
        router.push('/login');
        
      } catch (err: any) {
        console.error('Error during logout:', err);
        // Even if API call fails, clear cookies and redirect
        Cookies.remove('authToken');
        Cookies.remove('refreshToken');
        router.push('/login');
      }
    }
  };

  // Get user role display name
  const getUserRoles = (user: User) => {
    if (!user.roles || user.roles.length === 0) return 'Người dùng';
    return user.roles.map(role => {
      switch (role.name) {
        case 'ADMIN': return 'Quản trị viên';
        case 'SELLER': return 'Người bán';
        case 'USER': return 'Người dùng';
        default: return role.name;
      }
    }).join(', ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-purple-600" />
              <h1 className="text-3xl font-bold text-gray-900">Bảng Điều Khiển Quản Trị</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Đăng Xuất</span>
            </button>
          </div>
          <p className="text-gray-600">Giám sát và quản lý toàn bộ hệ thống</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hoạt Động Gần Đây */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Người Dùng Gần Đây</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {users.slice(0, 5).map((user, i) => (
                      <div key={user.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          {user.picture ? (
                            <img src={user.picture} alt={user.firstName} className="w-10 h-10 rounded-full" />
                          ) : (
                            <Users className="w-5 h-5 text-purple-600" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && (
                      <p className="text-sm text-gray-500">Chưa có người dùng nào</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Đơn Hàng Gần Đây</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Đơn hàng #DH-{1000 + i}</p>
                            <p className="text-xs text-gray-500">{i} phút trước</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">{(299000 * i).toLocaleString()} ₫</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Người Dùng Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Quản Lý Người Dùng</h3>
              <button 
                onClick={fetchUsers}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Làm Mới
              </button>
            </div>
            
            {loading ? (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải danh sách người dùng...</p>
              </div>
            ) : error ? (
              <div className="p-6 text-center">
                <div className="text-red-600 mb-4">
                  <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
                  <p className="font-medium">Lỗi tải dữ liệu</p>
                  <p className="text-sm">{error}</p>
                </div>
                <button 
                  onClick={fetchUsers}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Thử Lại
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Người Dùng
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vai Trò
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng Thái
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ngày Sinh
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao Tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.length > 0 ? users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              {user.picture ? (
                                <img src={user.picture} alt={user.firstName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-purple-100 flex items-center justify-center">
                                  <Users className="w-5 h-5 text-purple-600" />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-gray-500">ID: {user.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {getUserRoles(user)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.isVerified 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {user.isVerified ? (
                              <>
                                <UserCheck className="w-3 h-3 mr-1" />
                                Đã Xác Thực
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 mr-1" />
                                Chưa Xác Thực
                              </>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.dob ? new Date(user.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-3"
                            title="Xem chi tiết"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-purple-600 hover:text-purple-900 mr-3"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Xóa người dùng"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center">
                          <div className="text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p className="text-lg font-medium">Không có người dùng nào</p>
                            <p className="text-sm">Danh sách người dùng sẽ hiển thị ở đây khi có dữ liệu</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Các tab khác - Đang phát triển */}
        {activeTab !== 'overview' && activeTab !== 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {tabs.find(tab => tab.id === activeTab)?.icon && (
                  React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                    className: "w-8 h-8 text-gray-400"
                  })
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} - Sắp Ra Mắt
              </h3>
              <p className="text-gray-600">Tính năng này đang được phát triển và sẽ có sẵn sớm.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}