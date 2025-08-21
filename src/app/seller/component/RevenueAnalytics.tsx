'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  CreditCard, 
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  Download,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import RevenueAnalyticsService, { 
  DashboardMetrics, 
  DailyRevenue, 
  MonthlyRevenue 
} from '../../Service/RevenueAnalytics';
import Notification from './Notification';

interface RevenueMetric {
  value: number;
  growth: number;
  label: string;
  icon: React.ReactNode;
  period: string;
}

interface RevenueAnalyticsProps {
  sellerId: number;
}

const RevenueAnalytics: React.FC<RevenueAnalyticsProps> = ({ sellerId }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Notification state
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning';
    title: string;
    message: string;
    isVisible: boolean;
  }>({
    type: 'info',
    title: '',
    message: '',
    isVisible: false
  });

  const showNotification = (type: 'success' | 'error' | 'info' | 'warning', title: string, message: string) => {
    setNotification({
      type,
      title,
      message,
      isVisible: true
    });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // Fetch metrics from API
  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`Đang tải dữ liệu dashboard cho seller ID: ${sellerId}`);
      const dashboardData = await RevenueAnalyticsService.getDashboardMetrics(sellerId);
      
      setMetrics(dashboardData);
      console.log('Dữ liệu dashboard đã được tải thành công:', dashboardData);
      
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu doanh thu';
      setError(errorMessage);
      
      // Show error notification instead of fallback data
      showNotification('error', 'Lỗi tải dữ liệu', 
        'Không thể kết nối đến server. Vui lòng kiểm tra kết nối và thử lại.');
      
      // Only use fallback data in development mode for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Sử dụng dữ liệu mẫu do lỗi API (chỉ trong môi trường phát triển)');
        setMetrics({
        todayRevenue: 2450.75,
        monthRevenue: 67890.50,
        yearRevenue: 456789.25,
        totalRevenue: 1234567.89,
        todayGrowth: 12.5,
        monthGrowth: 8.3,
        yearGrowth: 25.7,
        todayTransactions: 15,
        monthTransactions: 342,
        yearTransactions: 2890,
        totalTransactions: 12450,
        averageOrderValue: 198.45,
        topSellingProductRevenue: 0,
        topSellingProductName: '',
        last30Days: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          revenue: Math.random() * 5000 + 1000,
          netRevenue: Math.random() * 4500 + 900,
          transactions: Math.floor(Math.random() * 50) + 10,
          averageOrderValue: Math.random() * 100 + 150,
          growthPercentage: (Math.random() - 0.5) * 40
        })).reverse(),
        last12Months: Array.from({ length: 12 }, (_, i) => {
          const date = new Date();
          date.setMonth(date.getMonth() - (11 - i));
          return {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            monthName: date.toLocaleString('default', { month: 'long' }),
            revenue: Math.random() * 80000 + 20000,
            netRevenue: Math.random() * 75000 + 18000,
            transactions: Math.floor(Math.random() * 500) + 200,
            averageOrderValue: Math.random() * 100 + 150,
            growthPercentage: (Math.random() - 0.5) * 60
          };
        })
      });
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh data manually
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('Đang làm mới dữ liệu...');
      
      // Update backend data first
      const today = new Date().toISOString().split('T')[0];
      await RevenueAnalyticsService.updateDailySalesRevenue(sellerId, today);
      
      // Then fetch updated metrics
      await fetchMetrics();
      
      showNotification('success', 'Thành công!', 'Dữ liệu doanh thu đã được cập nhật mới nhất');
      console.log('Dữ liệu đã được làm mới thành công');
    } catch (err) {
      console.error('Lỗi khi làm mới dữ liệu:', err);
      showNotification('error', 'Lỗi!', 'Không thể làm mới dữ liệu. Vui lòng thử lại.');
      setError('Không thể làm mới dữ liệu');
    } finally {
      setRefreshing(false);
    }
  };

  // Export data
  const handleExport = async () => {
    try {
      console.log('Đang xuất dữ liệu...');
      
      if (!metrics) {
        showNotification('warning', 'Cảnh báo!', 'Không có dữ liệu để xuất');
        return;
      }
      
      showNotification('info', 'Đang xử lý...', 'Đang chuẩn bị file xuất dữ liệu');
      
      // Create CSV data
      const csvData = [
        ['Chỉ số', 'Giá trị', 'Tăng trưởng %'],
        ['Doanh thu hôm nay', metrics.todayRevenue.toString(), metrics.todayGrowth.toString()],
        ['Doanh thu tháng', metrics.monthRevenue.toString(), metrics.monthGrowth.toString()],
        ['Doanh thu năm', metrics.yearRevenue.toString(), metrics.yearGrowth.toString()],
        ['Tổng doanh thu', metrics.totalRevenue.toString(), ''],
        ['Giá trị đơn hàng TB', metrics.averageOrderValue.toString(), ''],
        ['Giao dịch hôm nay', metrics.todayTransactions.toString(), ''],
        ['Giao dịch tháng', metrics.monthTransactions.toString(), ''],
        ['Tổng giao dịch', metrics.totalTransactions.toString(), ''],
      ];
      
      // Add daily data
      csvData.push([''], ['Dữ liệu 30 ngày gần nhất', '', '']);
      csvData.push(['Ngày', 'Doanh thu', 'Tăng trưởng %']);
      metrics.last30Days.forEach(day => {
        csvData.push([day.date, day.revenue.toString(), day.growthPercentage.toString()]);
      });
      
      const csvContent = csvData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `bao-cao-doanh-thu-${sellerId}-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      window.URL.revokeObjectURL(url);
      
      showNotification('success', 'Xuất thành công!', 'File báo cáo doanh thu đã được tải xuống');
      console.log('Dữ liệu đã được xuất thành công');
    } catch (err) {
      console.error('Lỗi khi xuất dữ liệu:', err);
      showNotification('error', 'Lỗi xuất!', 'Không thể xuất dữ liệu. Vui lòng thử lại.');
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [sellerId, selectedPeriod]);

  const revenueMetrics: RevenueMetric[] = metrics ? [
    {
      value: metrics.todayRevenue,
      growth: metrics.todayGrowth,
      label: 'Doanh thu hôm nay',
      icon: <DollarSign className="w-6 h-6" />,
      period: 'so với hôm qua'
    },
    {
      value: metrics.monthRevenue,
      growth: metrics.monthGrowth,
      label: 'Doanh thu tháng',
      icon: <Calendar className="w-6 h-6" />,
      period: 'so với tháng trước'
    },
    {
      value: metrics.yearRevenue,
      growth: metrics.yearGrowth,
      label: 'Doanh thu năm',
      icon: <BarChart3 className="w-6 h-6" />,
      period: 'so với năm trước'
    },
    {
      value: metrics.averageOrderValue,
      growth: 15.3,
      label: 'Giá trị đơn TB',
      icon: <CreditCard className="w-6 h-6" />,
      period: 'so với kỳ trước'
    }
  ] : [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpRight className="w-4 h-4 text-green-400" />
    ) : (
      <ArrowDownRight className="w-4 h-4 text-red-400" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-400' : 'text-red-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
        <span className="ml-2 text-white">Đang tải phân tích doanh thu...</span>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error || 'Không thể tải dữ liệu'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  const chartData = selectedPeriod === '30d' ? metrics.last30Days : 
                   selectedPeriod === '12m' ? metrics.last12Months : metrics.last30Days;
  
  const maxValue = Math.max(...chartData.map(d => 'revenue' in d ? d.revenue : 0));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Phân Tích Doanh Thu</h2>
          <p className="text-gray-300 mt-1">Theo dõi hiệu suất bán hàng và tăng trưởng</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">7 ngày qua</option>
            <option value="30d">30 ngày qua</option>
            <option value="12m">12 tháng qua</option>
            <option value="1y">Năm nay</option>
          </select>
          
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl transition-colors border border-purple-500/20 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Đang tải...' : 'Làm mới'}</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất dữ liệu</span>
          </button>
        </div>
      </div>

      {/* Revenue Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((metric, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                {metric.icon}
              </div>
              <div className={`flex items-center space-x-1 text-sm ${getGrowthColor(metric.growth)}`}>
                {getGrowthIcon(metric.growth)}
                <span>
                  {metric.growth > 0 ? '+' : ''}{metric.growth.toFixed(1)}%
                </span>
              </div>
            </div>
            <h3 className="text-gray-300 text-sm font-medium">{metric.label}</h3>
            <p className="text-2xl font-bold text-white mt-1">
              {formatCurrency(metric.value)}
            </p>
            <p className="text-gray-400 text-xs mt-1">{metric.period}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-white">Xu Hướng Doanh Thu</h3>
            <p className="text-gray-300 text-sm mt-1">
              Hiệu suất doanh thu {selectedPeriod === '30d' ? 'hàng ngày' : 'hàng tháng'}
            </p>
          </div>
          <div className="flex items-center space-x-2 text-green-400">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">
              {selectedPeriod === '30d' ? '+15.5%' : '+23.2%'}
            </span>
          </div>
        </div>

        <div className="relative h-64">
          <div className="flex items-end justify-between h-full space-x-1">
            {chartData.slice(0, selectedPeriod === '30d' ? 30 : 12).map((item, index) => {
              const revenue = 'revenue' in item ? item.revenue : 0;
              const height = (revenue / maxValue) * 200;
              const isPositiveGrowth = 'growthPercentage' in item ? item.growthPercentage >= 0 : true;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="w-full relative">
                    <div 
                      className={`w-full rounded-t-lg transition-all duration-1000 ease-out cursor-pointer ${
                        isPositiveGrowth 
                          ? 'bg-gradient-to-t from-green-600 to-green-400 hover:from-green-500 hover:to-green-300' 
                          : 'bg-gradient-to-t from-red-600 to-red-400 hover:from-red-500 hover:to-red-300'
                      }`}
                      style={{ 
                        height: `${height}px`,
                        animationDelay: `${index * 50}ms`
                      }}
                      title={`${formatCurrency(revenue)} on ${'date' in item ? item.date : item.monthName}`}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {formatCurrency(revenue)}
                    </div>
                  </div>
                  <span className="text-gray-300 text-xs mt-2 transform rotate-45 origin-left">
                    {'date' in item ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : item.monthName.slice(0, 3)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Summary */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Tổng Quan Giao Dịch</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Giao dịch hôm nay</span>
              <span className="text-white font-semibold">{metrics?.todayTransactions ?? 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Tháng này</span>
              <span className="text-white font-semibold">{(metrics?.monthTransactions ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Năm này</span>
              <span className="text-white font-semibold">{(metrics?.yearTransactions ?? 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-purple-500/20">
              <span className="text-gray-300">Tổng giao dịch</span>
              <span className="text-purple-400 font-bold">{(metrics?.totalTransactions ?? 0).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Chi Tiết Doanh Thu</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Doanh thu gốc</span>
              <span className="text-white font-semibold">{formatCurrency(metrics?.totalRevenue ?? 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Doanh thu ròng</span>
              <span className="text-white font-semibold">{formatCurrency((metrics?.totalRevenue ?? 0) * 0.92)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Hoàn tiền</span>
              <span className="text-red-400 font-semibold">-{formatCurrency((metrics?.totalRevenue ?? 0) * 0.03)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Phí & Chi phí</span>
              <span className="text-red-400 font-semibold">-{formatCurrency((metrics?.totalRevenue ?? 0) * 0.05)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Notification */}
      <Notification
        type={notification.type}
        title={notification.title}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default RevenueAnalytics;
