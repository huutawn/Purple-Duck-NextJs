"use client";

import React, { useState, useEffect } from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';
import { getSellerProfile, getUnreadNotificationCount, SellerProfileResponse } from '@/app/Service/Seller';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [sellerProfile, setSellerProfile] = useState<SellerProfileResponse | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch seller profile and notification count
  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        setLoading(true);
        
        // Fetch seller profile and unread count in parallel
        const [profileResponse, countResponse] = await Promise.all([
          getSellerProfile(),
          getUnreadNotificationCount()
        ]);
        
        setSellerProfile(profileResponse.result);
        setUnreadCount(countResponse.result);
      } catch (error) {
        console.error('Error fetching header data:', error);
        // Use fallback data in case of error
        setSellerProfile(null);
        setUnreadCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchHeaderData();
  }, []);

  // Generate user initials for avatar
  const getUserInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'N/A';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Get display name
  const getDisplayName = () => {
    if (!sellerProfile) return loading ? 'Đang tải...' : 'Người bán';
    return `${sellerProfile.firstName || ''} ${sellerProfile.lastName || ''}`.trim() || 'Người bán';
  };

  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-purple-500/20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-300 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm, đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white/10 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
              {sellerProfile?.picture ? (
                <img 
                  src={sellerProfile.picture} 
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white font-semibold text-sm">
                  {getUserInitials(sellerProfile?.firstName, sellerProfile?.lastName)}
                </span>
              )}
            </div>
            <div className="hidden sm:block">
              <span className="text-white font-medium block">
                {getDisplayName()}
              </span>
              {sellerProfile?.storeName && (
                <span className="text-gray-400 text-xs">
                  {sellerProfile.storeName}
                </span>
              )}
            </div>
            {sellerProfile?.isVerified && (
              <div className="w-2 h-2 bg-green-500 rounded-full" title="Đã xác minh" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;