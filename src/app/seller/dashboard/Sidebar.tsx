"use client";

import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  Users, 
  Settings, 
  LogOut,
  X,
  BarChart3,
  Bell
} from 'lucide-react';
import { PageType } from '@/app/seller/dashboard/layout'; // Import PageType từ layout
import Link from 'next/link';
import Cookies from 'js-cookie'; // Import để xóa cookies

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: PageType;
  onPageChange: (page: PageType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, currentPage, onPageChange }) => {
  const menuItems = [
    { id: '' as PageType, icon: Home, label: 'Bảng Điều Khiển' },
    { id: 'orders' as PageType, icon: ShoppingBag, label: 'Đơn Hàng', badge: '12' },
    { id: 'products' as PageType, icon: Package, label: 'Sản Phẩm' },
    { id: 'analytics' as PageType, icon: BarChart3, label: 'Phân Tích' },
    { id: 'revenue' as PageType, icon: TrendingUp, label: 'Doanh Thu' },
    { id: 'customers' as PageType, icon: Users, label: 'Khách Hàng' },
    { id: 'notifications' as PageType, icon: Bell, label: 'Thông Báo', badge: '3' },
    { id: 'settings' as PageType, icon: Settings, label: 'Cài Đặt' },
  ];

  const handlePageChange = (pageId: PageType) => {
    onPageChange(pageId);
    onClose(); // Đóng sidebar trên mobile sau khi điều hướng
  };

  const handleSignOut = () => {
    // Xóa các cookie khi nhấn Sign Out
    Cookies.remove('authToken');
    Cookies.remove('refreshToken');
    Cookies.remove('roles');
    // Tùy chọn: Điều hướng về trang login
    window.location.href = '/'; // Hoặc dùng router.push nếu trong client component khác
  };

  return (
    <>
      {/* Overlay cho mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-purple-500/20
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SellerHub</span>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/seller/dashboard/${item.id}`} // Điều hướng tới sub-route trong dashboard
                  onClick={() => handlePageChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${currentPage === item.id
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/25' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto bg-purple-500 text-white text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Phần Người Dùng */}
        <div className="p-4 border-t border-purple-500/20">
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">JS</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">John Smith</p>
              <p className="text-gray-400 text-xs">Người Bán Cao Cấp</p>
            </div>
          </div>
          <button 
            onClick={handleSignOut} // Thêm chức năng đăng xuất
            className="w-full mt-3 flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-red-500/20 rounded-xl transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Đăng Xuất</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;