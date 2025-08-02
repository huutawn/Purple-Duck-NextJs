"use client";

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Calendar, Download } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const salesData = [
    { day: 'Thứ 2', sales: 1200, orders: 45 },
    { day: 'Thứ 3', sales: 1800, orders: 62 },
    { day: 'Thứ 4', sales: 1500, orders: 58 },
    { day: 'Thứ 5', sales: 2200, orders: 78 },
    { day: 'Thứ 6', sales: 2800, orders: 95 },
    { day: 'Thứ 7', sales: 3200, orders: 112 },
    { day: 'Chủ Nhật', sales: 2600, orders: 89 }
  ];

  const topProducts = [
    { name: 'Tai Nghe Không Dây', sales: 1247, revenue: 24940, percentage: 35 },
    { name: 'Đồng Hồ Thông Minh', sales: 892, revenue: 17840, percentage: 25 },
    { name: 'Loa Bluetooth', sales: 634, revenue: 12680, percentage: 18 },
    { name: 'Ốp Điện Thoại', sales: 423, revenue: 8460, percentage: 12 },
    { name: 'Đế Đỡ Máy Tính', sales: 312, revenue: 6240, percentage: 10 }
  ];

  const trafficSources = [
    { source: 'Tìm Kiếm Hữu Cơ', visitors: 12450, percentage: 45, color: 'bg-blue-500' },
    { source: 'Trực Tiếp', visitors: 8320, percentage: 30, color: 'bg-green-500' },
    { source: 'Mạng Xã Hội', visitors: 4160, percentage: 15, color: 'bg-purple-500' },
    { source: 'Email', visitors: 2080, percentage: 7.5, color: 'bg-yellow-500' },
    { source: 'Tham Chiếu', visitors: 690, percentage: 2.5, color: 'bg-red-500' }
  ];

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Phân Tích</h1>
          <p className="text-gray-300 mt-1">Theo dõi hiệu suất và thông tin kinh doanh của bạn</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">7 Ngày Gần Nhất</option>
            <option value="30d">30 Ngày Gần Nhất</option>
            <option value="90d">90 Ngày Gần Nhất</option>
            <option value="1y">Năm Gần Nhất</option>
          </select>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            <span>Xuất Dữ Liệu</span>
          </button>
        </div>
      </div>

      {/* Chỉ số chính */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12,5%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Doanh Thu Tổng</h3>
          <p className="text-2xl font-bold text-white mt-1">47.842.000 VNĐ</p>
          <p className="text-gray-400 text-xs mt-1">so với kỳ trước</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+8,2%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Tổng Đơn Hàng</h3>
          <p className="text-2xl font-bold text-white mt-1">1.247</p>
          <p className="text-gray-400 text-xs mt-1">so với kỳ trước</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <PieChart className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-1 text-red-400 text-sm">
              <TrendingDown className="w-4 h-4" />
              <span>-2,1%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Tỷ Lệ Chuyển Đổi</h3>
          <p className="text-2xl font-bold text-white mt-1">3,24%</p>
          <p className="text-gray-400 text-xs mt-1">so với kỳ trước</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+15,3%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Giá Trị Đơn Hàng Trung Bình</h3>
          <p className="text-2xl font-bold text-white mt-1">38.42 USD</p>
          <p className="text-gray-400 text-xs mt-1">so với kỳ trước</p>
        </div>
      </div>

      {/* Phần Biểu Đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ Doanh thu */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Tổng Quan Doanh Thu</h3>
              <p className="text-gray-300 text-sm mt-1">Hiệu suất doanh thu hàng ngày</p>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">+12,5%</span>
            </div>
          </div>

          <div className="relative h-64">
            <div className="flex items-end justify-between h-full space-x-2">
              {salesData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-purple-500 hover:to-purple-300"
                      style={{ 
                        height: `${(item.sales / maxSales) * 200}px`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium">
                      ${(item.sales / 1000).toFixed(1)}k
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm mt-2">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sản phẩm nổi bật */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Sản Phẩm Nổi Bật</h3>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Xem Tất Cả
            </button>
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{product.name}</h4>
                  <p className="text-gray-400 text-sm">{product.sales} đã bán</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${product.revenue.toLocaleString()}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        style={{ width: `${product.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs">{product.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Nguồn truy cập & Thông tin khách hàng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Nguồn truy cập */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Nguồn Truy Cập</h3>
          
          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${source.color}`} />
                  <span className="text-white font-medium">{source.source}</span>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{source.visitors.toLocaleString()}</p>
                  <p className="text-gray-400 text-sm">{source.percentage}%</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Tổng số lượt truy cập</span>
              <span className="text-white font-semibold">27.700</span>
            </div>
          </div>
        </div>

        {/* Thông tin khách hàng */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Thông Tin Khách Hàng</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Khách Hàng Mới</span>
                <span className="text-white font-semibold">68%</span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '68%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Khách Hàng Trở Lại</span>
                <span className="text-white font-semibold">32%</span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300">Độ Hài Lòng Khách Hàng</span>
                <span className="text-white font-semibold">94%</span>
              </div>
              <div className="w-full h-2 bg-gray-600 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full" style={{ width: '94%' }} />
              </div>
            </div>

            <div className="pt-4 border-t border-purple-500/20">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">Thời gian trung bình</p>
                  <p className="text-white font-semibold">4m 32s</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Tỷ lệ thoát trang</p>
                  <p className="text-white font-semibold">24,5%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;