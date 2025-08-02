"use client";

import React, { useState } from 'react';
import { DollarSign, TrendingUp, CreditCard, Calendar, Download, Filter } from 'lucide-react';

const RevenuePage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30d');

  const revenueData = [
    { month: 'Jan', revenue: 45000, growth: 12 },
    { month: 'Feb', revenue: 52000, growth: 15.5 },
    { month: 'Mar', revenue: 48000, growth: -7.7 },
    { month: 'Apr', revenue: 61000, growth: 27.1 },
    { month: 'May', revenue: 58000, growth: -4.9 },
    { month: 'Jun', revenue: 67000, growth: 15.5 }
  ];

  const paymentMethods = [
    { method: 'Credit Card', amount: 156780, percentage: 65, transactions: 1247 },
    { method: 'PayPal', amount: 48234, percentage: 20, transactions: 389 },
    { method: 'Bank Transfer', amount: 24117, percentage: 10, transactions: 156 },
    { method: 'Digital Wallet', amount: 12058, percentage: 5, transactions: 98 }
  ];

  const recentTransactions = [
    {
      id: 'TXN-001',
      customer: 'Sarah Johnson',
      amount: 199.99,
      method: 'Credit Card',
      status: 'completed',
      date: '2024-01-15',
      time: '14:30'
    },
    {
      id: 'TXN-002',
      customer: 'Mike Chen',
      amount: 299.99,
      method: 'PayPal',
      status: 'completed',
      date: '2024-01-15',
      time: '13:45'
    },
    {
      id: 'TXN-003',
      customer: 'Emma Davis',
      amount: 89.99,
      method: 'Credit Card',
      status: 'pending',
      date: '2024-01-15',
      time: '12:20'
    },
    {
      id: 'TXN-004',
      customer: 'James Wilson',
      amount: 149.99,
      method: 'Bank Transfer',
      status: 'completed',
      date: '2024-01-14',
      time: '16:15'
    }
  ];

  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'failed':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Revenue</h1>
          <p className="text-gray-300 mt-1">Track your financial performance and earnings</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl transition-colors border border-purple-500/20">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+12.5%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Total Revenue</h3>
          <p className="text-2xl font-bold text-white mt-1">$241,189</p>
          <p className="text-gray-400 text-xs mt-1">vs last period</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+8.2%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Monthly Revenue</h3>
          <p className="text-2xl font-bold text-white mt-1">$67,000</p>
          <p className="text-gray-400 text-xs mt-1">vs last month</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+15.3%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Avg. Order Value</h3>
          <p className="text-2xl font-bold text-white mt-1">$193.42</p>
          <p className="text-gray-400 text-xs mt-1">vs last period</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-400" />
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+5.7%</span>
            </div>
          </div>
          <h3 className="text-gray-300 text-sm font-medium">Total Transactions</h3>
          <p className="text-2xl font-bold text-white mt-1">1,890</p>
          <p className="text-gray-400 text-xs mt-1">vs last period</p>
        </div>
      </div>

      {/* Revenue Chart & Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-white">Revenue Trend</h3>
              <p className="text-gray-300 text-sm mt-1">Monthly revenue performance</p>
            </div>
            <div className="flex items-center space-x-2 text-green-400">
              <TrendingUp className="w-5 h-5" />
              <span className="font-semibold">+15.5%</span>
            </div>
          </div>

          <div className="relative h-64">
            <div className="flex items-end justify-between h-full space-x-2">
              {revenueData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-green-500 hover:to-green-300"
                      style={{ 
                        height: `${(item.revenue / maxRevenue) * 200}px`,
                        animationDelay: `${index * 100}ms`
                      }}
                    />
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-xs font-medium">
                      ${(item.revenue / 1000).toFixed(0)}k
                    </div>
                  </div>
                  <span className="text-gray-300 text-sm mt-2">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6">Payment Methods</h3>
          
          <div className="space-y-4">
            {paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{method.method}</h4>
                  <p className="text-gray-400 text-sm">{method.transactions} transactions</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">${method.amount.toLocaleString()}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="w-16 h-2 bg-gray-600 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full"
                        style={{ width: `${method.percentage}%` }}
                      />
                    </div>
                    <span className="text-gray-400 text-xs">{method.percentage}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-purple-500/20">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Total Processed</span>
              <span className="text-white font-semibold">$241,189</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-purple-500/20">
              <tr>
                <th className="text-left p-3 text-gray-300 font-medium">Transaction ID</th>
                <th className="text-left p-3 text-gray-300 font-medium">Customer</th>
                <th className="text-left p-3 text-gray-300 font-medium">Amount</th>
                <th className="text-left p-3 text-gray-300 font-medium">Method</th>
                <th className="text-left p-3 text-gray-300 font-medium">Status</th>
                <th className="text-left p-3 text-gray-300 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <tr key={index} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                  <td className="p-3">
                    <p className="text-white font-medium">{transaction.id}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {transaction.customer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="text-white">{transaction.customer}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="text-white font-semibold">${transaction.amount}</p>
                  </td>
                  <td className="p-3">
                    <p className="text-gray-300">{transaction.method}</p>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div>
                      <p className="text-white">{transaction.date}</p>
                      <p className="text-gray-400 text-sm">{transaction.time}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenuePage;
