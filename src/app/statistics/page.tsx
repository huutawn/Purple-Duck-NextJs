'use client';

import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Package, Calendar, Eye, ShoppingCart } from 'lucide-react';

export default function Statistics() {
  const [dateRange, setDateRange] = useState('30d');
  const [viewType, setViewType] = useState('overview');

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,280',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Active Users',
      value: '8,547',
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Products Sold',
      value: '2,847',
      change: '+6.8%',
      icon: Package,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const salesData = [
    { month: 'Jan', sales: 12000, orders: 145 },
    { month: 'Feb', sales: 15000, orders: 178 },
    { month: 'Mar', sales: 18000, orders: 203 },
    { month: 'Apr', sales: 22000, orders: 234 },
    { month: 'May', sales: 25000, orders: 267 },
    { month: 'Jun', sales: 28000, orders: 298 },
  ];

  const topProducts = [
    { name: 'Premium Wireless Headphones', sales: 145, revenue: '$43,350' },
    { name: 'Smart Fitness Tracker', sales: 98, revenue: '$19,602' },
    { name: 'Designer Handbag', sales: 76, revenue: '$34,924' },
    { name: 'Luxury Watch Collection', sales: 54, revenue: '$48,600' },
    { name: 'Organic Skincare Set', sales: 67, revenue: '$8,708' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Statistics & Analytics</h1>
          <p className="text-gray-600">Track your business performance and growth</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
                <select
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">View Type</label>
                <select
                  value={viewType}
                  onChange={(e) => setViewType(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="overview">Overview</option>
                  <option value="sales">Sales</option>
                  <option value="products">Products</option>
                  <option value="users">Users</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Export Data
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Sales Overview</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {salesData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm text-gray-600">{data.month}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">${data.sales.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">{data.orders} orders</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${(data.sales / 30000) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
              <Package className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 text-sm">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.sales} units sold</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{product.revenue}</p>
                    <div className="flex items-center space-x-1">
                      <div className="w-8 h-1 bg-gray-200 rounded-full">
                        <div 
                          className="h-1 bg-purple-600 rounded-full"
                          style={{ width: `${(product.sales / 150) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Traffic Sources</h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Direct</span>
                <span className="font-medium">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Search</span>
                <span className="font-medium">32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Social</span>
                <span className="font-medium">23%</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Conversion Rate</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600 mb-2">3.2%</p>
              <p className="text-sm text-gray-600">+0.5% from last month</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">Average Order Value</h3>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600 mb-2">$127</p>
              <p className="text-sm text-gray-600">+$12 from last month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}