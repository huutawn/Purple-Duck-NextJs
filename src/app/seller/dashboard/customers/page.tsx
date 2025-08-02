"use client";

import React, { useState } from 'react';
import { Search, Filter, UserPlus, Mail, Phone, MapPin, Calendar, Star, TrendingUp } from 'lucide-react';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');

  const customers = [
    {
      id: 'CUST-001',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      joinDate: '2023-08-15',
      totalOrders: 12,
      totalSpent: 2847.50,
      avgOrderValue: 237.29,
      lastOrder: '2024-01-10',
      segment: 'vip',
      status: 'active',
      avatar: 'SJ'
    },
    {
      id: 'CUST-002',
      name: 'Mike Chen',
      email: 'mike.chen@email.com',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      joinDate: '2023-11-22',
      totalOrders: 8,
      totalSpent: 1456.80,
      avgOrderValue: 182.10,
      lastOrder: '2024-01-12',
      segment: 'regular',
      status: 'active',
      avatar: 'MC'
    },
    {
      id: 'CUST-003',
      name: 'Emma Davis',
      email: 'emma.d@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      joinDate: '2023-06-10',
      totalOrders: 25,
      totalSpent: 4892.30,
      avgOrderValue: 195.69,
      lastOrder: '2024-01-14',
      segment: 'vip',
      status: 'active',
      avatar: 'ED'
    },
    {
      id: 'CUST-004',
      name: 'James Wilson',
      email: 'james.w@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Houston, TX',
      joinDate: '2024-01-05',
      totalOrders: 2,
      totalSpent: 324.98,
      avgOrderValue: 162.49,
      lastOrder: '2024-01-08',
      segment: 'new',
      status: 'active',
      avatar: 'JW'
    },
    {
      id: 'CUST-005',
      name: 'Lisa Anderson',
      email: 'lisa.a@email.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      joinDate: '2023-03-18',
      totalOrders: 6,
      totalSpent: 789.45,
      avgOrderValue: 131.58,
      lastOrder: '2023-12-20',
      segment: 'at_risk',
      status: 'inactive',
      avatar: 'LA'
    }
  ];

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'vip':
        return 'text-purple-400 bg-purple-400/20';
      case 'regular':
        return 'text-blue-400 bg-blue-400/20';
      case 'new':
        return 'text-green-400 bg-green-400/20';
      case 'at_risk':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/20';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = segmentFilter === 'all' || customer.segment === segmentFilter;
    return matchesSearch && matchesSegment;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Customers</h1>
          <p className="text-gray-300 mt-1">Manage your customer relationships and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl transition-colors border border-purple-500/20">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
            <UserPlus className="w-4 h-4" />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">VIP Customers</p>
              <p className="text-2xl font-bold text-white">47</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Regular Customers</p>
              <p className="text-2xl font-bold text-white">234</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">New Customers</p>
              <p className="text-2xl font-bold text-white">89</p>
            </div>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">At Risk</p>
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
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={segmentFilter}
            onChange={(e) => setSegmentFilter(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Segments</option>
            <option value="vip">VIP Customers</option>
            <option value="regular">Regular Customers</option>
            <option value="new">New Customers</option>
            <option value="at_risk">At Risk</option>
          </select>
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCustomers.map((customer, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">{customer.avatar}</span>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{customer.name}</h3>
                  <p className="text-gray-400 text-sm">{customer.id}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSegmentColor(customer.segment)}`}>
                  {customer.segment.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(customer.status)}`}>
                  {customer.status}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">{customer.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Tham gia {customer.joinDate}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-purple-500/20">
              <div className="text-center">
                <p className="text-gray-400 text-xs">Đơn hàng</p>
                <p className="text-white font-semibold">{customer.totalOrders}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Tổng chi tiêu</p>
                <p className="text-white font-semibold">${customer.totalSpent.toLocaleString()}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-400 text-xs">Đơn trung bình</p>
                <p className="text-white font-semibold">${customer.avgOrderValue.toFixed(0)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-500/20">
              <p className="text-gray-400 text-sm">Đơn hàng cuối: {customer.lastOrder}</p>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                  <Phone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomersPage;