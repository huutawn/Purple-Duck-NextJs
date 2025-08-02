"use client";

import React, { useState } from 'react';
import { Search, Filter, Download, Eye, Package, Truck, CheckCircle, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';

const OrdersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: '#3471',
      customer: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      products: ['Wireless Headphones', 'Phone Case'],
      total: '$224.98',
      status: 'delivered',
      date: '2024-01-15',
      time: '2 min ago',
      paymentMethod: 'Credit Card',
      shippingAddress: '123 Main St, New York, NY 10001'
    },
    {
      id: '#3470',
      customer: 'Mike Chen',
      email: 'mike.chen@email.com',
      products: ['Smart Watch'],
      total: '$299.99',
      status: 'processing',
      date: '2024-01-15',
      time: '15 min ago',
      paymentMethod: 'PayPal',
      shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
    },
    {
      id: '#3469',
      customer: 'Emma Davis',
      email: 'emma.d@email.com',
      products: ['Laptop Stand', 'Wireless Mouse'],
      total: '$129.98',
      status: 'shipped',
      date: '2024-01-14',
      time: '1 hour ago',
      paymentMethod: 'Credit Card',
      shippingAddress: '789 Pine St, Chicago, IL 60601'
    },
    {
      id: '#3468',
      customer: 'James Wilson',
      email: 'james.w@email.com',
      products: ['Bluetooth Speaker'],
      total: '$149.99',
      status: 'pending',
      date: '2024-01-14',
      time: '2 hours ago',
      paymentMethod: 'Bank Transfer',
      shippingAddress: '321 Elm St, Houston, TX 77001'
    },
    {
      id: '#3467',
      customer: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      products: ['Men\'s T-Shirt', 'Women\'s Jacket'],
      total: '$89.98',
      status: 'cancelled',
      date: '2024-01-13',
      time: '1 day ago',
      paymentMethod: 'Credit Card',
      shippingAddress: '654 Maple Dr, Phoenix, AZ 85001'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'processing':
        return <Package className="w-4 h-4 text-yellow-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-400 bg-green-400/20';
      case 'shipped':
        return 'text-blue-400 bg-blue-400/20';
      case 'processing':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'pending':
        return 'text-orange-400 bg-orange-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Orders</h1>
          <p className="text-gray-300 mt-1">Manage and track all customer orders</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl transition-colors border border-purple-500/20">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Total Orders</p>
              <p className="text-2xl font-bold text-white">1,247</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Pending</p>
              <p className="text-2xl font-bold text-white">23</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Shipped</p>
              <p className="text-2xl font-bold text-white">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Delivered</p>
              <p className="text-2xl font-bold text-white">1,068</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Cancelled</p>
              <p className="text-2xl font-bold text-white">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search orders, customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-purple-500/20">
              <tr>
                <th className="text-left p-4 text-gray-300 font-medium">Order</th>
                <th className="text-left p-4 text-gray-300 font-medium">Customer</th>
                <th className="text-left p-4 text-gray-300 font-medium">Products</th>
                <th className="text-left p-4 text-gray-300 font-medium">Total</th>
                <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => (
                <tr key={index} className="border-b border-purple-500/10 hover:bg-white/5 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="text-white font-medium">{order.id}</p>
                      <p className="text-gray-400 text-sm">{order.time}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {order.customer.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{order.customer}</p>
                        <p className="text-gray-400 text-sm">{order.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="text-white">{order.products[0]}</p>
                      {order.products.length > 1 && (
                        <p className="text-gray-400 text-sm">+{order.products.length - 1} more</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white font-semibold">{order.total}</p>
                    <p className="text-gray-400 text-sm">{order.paymentMethod}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-white">{order.date}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
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

export default OrdersPage;
