"use client";

import React, { useState } from 'react';
import { Bell, Check, Trash2, Filter, Search, AlertCircle, Package, Star, TrendingUp, User, CreditCard } from 'lucide-react';

const NotificationsPage: React.FC = () => {
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = [
    {
      id: 'NOT-001',
      type: 'order',
      title: 'New Order Received',
      message: 'Order #3471 from Sarah Johnson for $199.99',
      time: '2 minutes ago',
      read: false,
      priority: 'high',
      icon: Package,
      color: 'text-green-400'
    },
    {
      id: 'NOT-002',
      type: 'review',
      title: 'New Product Review',
      message: '5-star review received for Wireless Headphones',
      time: '15 minutes ago',
      read: false,
      priority: 'medium',
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      id: 'NOT-003',
      type: 'inventory',
      title: 'Low Stock Alert',
      message: 'Smart Watch inventory is running low (5 units left)',
      time: '1 hour ago',
      read: true,
      priority: 'high',
      icon: AlertCircle,
      color: 'text-orange-400'
    },
    {
      id: 'NOT-004',
      type: 'sales',
      title: 'Sales Milestone',
      message: 'Congratulations! You\'ve reached $50k in monthly sales',
      time: '2 hours ago',
      read: false,
      priority: 'medium',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      id: 'NOT-005',
      type: 'customer',
      title: 'New Customer Registration',
      message: 'Mike Chen has created a new account',
      time: '3 hours ago',
      read: true,
      priority: 'low',
      icon: User,
      color: 'text-blue-400'
    },
    {
      id: 'NOT-006',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of $299.99 received for Order #3470',
      time: '4 hours ago',
      read: true,
      priority: 'medium',
      icon: CreditCard,
      color: 'text-green-400'
    },
    {
      id: 'NOT-007',
      type: 'inventory',
      title: 'Stock Replenished',
      message: 'Bluetooth Speaker inventory has been restocked (100 units)',
      time: '6 hours ago',
      read: true,
      priority: 'low',
      icon: Package,
      color: 'text-blue-400'
    },
    {
      id: 'NOT-008',
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #3469 has been shipped to Emma Davis',
      time: '8 hours ago',
      read: true,
      priority: 'medium',
      icon: Package,
      color: 'text-blue-400'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-red-500';
      case 'medium':
        return 'border-l-yellow-500';
      case 'low':
        return 'border-l-green-500';
      default:
        return 'border-l-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    // Trong ứng dụng thực tế, bạn sẽ cập nhật trạng thái thông báo
    console.log('Đánh dấu đã đọc:', id);
  };

  const deleteNotification = (id: string) => {
    // Trong ứng dụng thực tế, bạn sẽ xóa thông báo
    console.log('Xóa thông báo:', id);
  };

  const markAllAsRead = () => {
    // Trong ứng dụng thực tế, bạn sẽ đánh dấu tất cả thông báo là đã đọc
    console.log('Đánh dấu tất cả là đã đọc');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Thông Báo</h1>
          <p className="text-gray-300 mt-1">Cập nhật thông tin hoạt động kinh doanh của bạn</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={markAllAsRead}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl transition-colors border border-purple-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Đánh Dấu Tất Cả Đã Đọc</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
            <Filter className="w-4 h-4" />
            <span>Lọc</span>
          </button>
        </div>
      </div>

      {/* Thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Tổng Thông Báo</p>
              <p className="text-2xl font-bold text-white">{notifications.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Chưa Đọc</p>
              <p className="text-2xl font-bold text-white">{unreadCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Ưu Tiên Cao</p>
              <p className="text-2xl font-bold text-white">{notifications.filter(n => n.priority === 'high').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <Check className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Đã Đọc Hôm Nay</p>
              <p className="text-2xl font-bold text-white">{notifications.filter(n => n.read).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm thông báo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">Tất Cả Loại</option>
            <option value="order">Đơn Hàng</option>
            <option value="review">Đánh Giá</option>
            <option value="inventory">Hàng Tồn</option>
            <option value="sales">Doanh Số</option>
            <option value="customer">Khách Hàng</option>
            <option value="payment">Thanh Toán</option>
          </select>
        </div>
      </div>

      {/* Danh sách thông báo */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="space-y-0">
          {filteredNotifications.map((notification, index) => (
            <div
              key={index}
              className={`
                flex items-start space-x-4 p-6 border-l-4 ${getPriorityColor(notification.priority)}
                ${!notification.read ? 'bg-white/5' : 'bg-transparent'}
                ${index !== filteredNotifications.length - 1 ? 'border-b border-purple-500/10' : ''}
                hover:bg-white/5 transition-all duration-200
              `}
            >
              <div className={`w-10 h-10 ${notification.color} bg-current/20 rounded-full flex items-center justify-center flex-shrink-0`}>
                <notification.icon className={`w-5 h-5 ${notification.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${!notification.read ? 'text-white' : 'text-gray-300'}`}>
                      {notification.title}
                      {!notification.read && (
                        <span className="ml-2 w-2 h-2 bg-purple-500 rounded-full inline-block" />
                      )}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{notification.message}</p>
                    <p className="text-gray-500 text-xs mt-2">{notification.time}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/20 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Delete notification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Không tìm thấy thông báo</h3>
            <p className="text-gray-400">Hãy thử điều chỉnh tiêu chí tìm kiếm hoặc lọc</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;