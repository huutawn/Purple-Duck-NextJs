"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, Filter, UserPlus, Mail, Phone, MapPin, Calendar, Star, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { getCustomersBySeller, CustomerResponse } from '@/app/Service/Customer';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch customers from API
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getCustomersBySeller({
        page,
        size,
        search: searchTerm.trim() || undefined,
      });
      
      if (response.code === 1000) {
        setCustomers(response.result.data || []);
        setTotalElements(response.result.totalElements || 0);
        setTotalPages(response.result.totalPages || 0);
      } else {
        setError(response.message || 'Lỗi khi tải danh sách khách hàng');
      }
    } catch (err: any) {
      console.error('Error fetching customers:', err);
      setError(err.message || 'Không thể tải danh sách khách hàng');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, searchTerm]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(0); // Reset to first page when searching
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Calculate statistics from current customers
  const customerStats = useMemo(() => {
    const vip = customers.filter(c => c.customerTier.toLowerCase() === 'vip').length;
    const regular = customers.filter(c => c.customerTier.toLowerCase() === 'regular').length;
    const newCustomers = customers.filter(c => c.customerTier.toLowerCase() === 'new').length;
    const atRisk = customers.filter(c => !c.isActive).length;
    
    return { vip, regular, new: newCustomers, atRisk };
  }, [customers]);

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

  // Filter customers by segment (search is handled by API)
  const filteredCustomers = customers.filter(customer => {
    const matchesSegment = segmentFilter === 'all' || customer.customerTier.toLowerCase() === segmentFilter;
    return matchesSegment;
  });

  // Generate customer avatar initials
  const getCustomerInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return 'N/A';
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

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
              <p className="text-2xl font-bold text-white">{customerStats.vip}</p>
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
              <p className="text-2xl font-bold text-white">{customerStats.regular}</p>
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
              <p className="text-2xl font-bold text-white">{customerStats.new}</p>
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
              <p className="text-2xl font-bold text-white">{customerStats.atRisk}</p>
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

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p>Đang tải danh sách khách hàng...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchCustomers}
            className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Customers Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCustomers.length > 0 ? filteredCustomers.map((customer, index) => (
            <div key={customer.id} className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {getCustomerInitials(customer.firstName, customer.lastName)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p className="text-gray-400 text-sm">{customer.id}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getSegmentColor(customer.customerTier.toLowerCase())}`}>
                    {customer.customerTier}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(customer.isActive ? 'active' : 'inactive')}`}>
                    {customer.isActive ? 'Active' : 'Inactive'}
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
                  <span className="text-gray-300">{customer.phone || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{customer.city || customer.address || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">Khách từ {formatDate(customer.firstOrderDate)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-purple-500/20">
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Đơn hàng</p>
                  <p className="text-white font-semibold">{customer.totalOrders}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Tổng chi tiêu</p>
                  <p className="text-white font-semibold">{customer.totalSpent.toLocaleString('vi-VN')} ₫</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-xs">Đơn trung bình</p>
                  <p className="text-white font-semibold">{customer.averageOrderValue.toLocaleString('vi-VN')} ₫</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-purple-500/20">
                <p className="text-gray-400 text-sm">
                  Đơn cuối: {formatDate(customer.lastOrderDate)}
                </p>
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
          )) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-gray-400 text-lg">Không tìm thấy khách hàng nào</p>
              <p className="text-gray-500 text-sm mt-2">Thử thay đổi bộ lọc tìm kiếm</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-white text-sm">
            Hiển thị {filteredCustomers.length} / {totalElements} khách hàng
          </div>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white px-4">
              Trang {page + 1} / {totalPages}
            </span>
            <button 
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;