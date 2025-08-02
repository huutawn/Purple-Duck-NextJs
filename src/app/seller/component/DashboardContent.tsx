"use client";

import React from 'react';
import MetricsGrid from './MetricsGrid';
import RevenueChart from './RevuneChart';
import RecentOrders from './RecentOrders';
import TopProducts from './TopProduct';
import ActivityFeed from './ActivityFeed';

const DashboardContent: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Phần chào mừng */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Chào mừng trở lại, John!</h1>
        <p className="text-gray-300">Đây là những gì đang xảy ra với cửa hàng của bạn hôm nay.</p>
      </div>

      {/* Lưới chỉ số */}
      <MetricsGrid />

      {/* Biểu đồ và dữ liệu */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <div className="space-y-6">
          <TopProducts />
        </div>
      </div>

      {/* Hoạt động gần đây */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders />
        <ActivityFeed />
      </div>
    </div>
  );
};

export default DashboardContent;