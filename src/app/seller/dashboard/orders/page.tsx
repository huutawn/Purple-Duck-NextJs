"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Search, Filter, Download, Eye, Package, Truck, CheckCircle, Clock,
  AlertCircle, MoreHorizontal, ChevronLeft, ChevronRight
} from 'lucide-react';
import { getAllOrderBySeller } from '@/app/Service/Order';
import { SubOrderResponse } from '@/types';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<SubOrderResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllOrderBySeller({});
      if (res.code === 1000 && Array.isArray(res.result)) {
        setOrders(res.result);
      } else if (res.code === 1000 && res.result?.data) {
        setOrders(res.result.data);
      } else {
        setError(res.message || 'Lỗi khi tải đơn hàng.');
      }
    } catch (err: any) {
      console.error('Lỗi khi lấy đơn hàng:', err);
      setError(err.message || 'Không thể tải đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-blue-400" />;
      case 'processing':
        return <Package className="w-4 h-4 text-yellow-400" />;
      case 'pending':
      case 'init':
        return <Clock className="w-4 h-4 text-orange-400" />;
      case 'cancelled':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-green-400 bg-green-400/20';
      case 'shipped':
        return 'text-blue-400 bg-blue-400/20';
      case 'processing':
      case 'pending':
      case 'init':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  // Lọc đơn hàng ở FE
  const filteredOrders = useMemo(() => {
    let temp = [...orders];
    if (statusFilter !== 'all') {
      temp = temp.filter(o => o.status?.toLowerCase() === statusFilter.toLowerCase());
    }
    if (searchTerm) {
      temp = temp.filter(o =>
        o.subOrderId.toString().includes(searchTerm) ||
        o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.address?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.orderItems.some(item =>
          item.productVariant.productName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    return temp;
  }, [orders, searchTerm, statusFilter]);

  // Cắt dữ liệu phân trang ở FE
  const paginatedOrders = useMemo(() => {
    const startIndex = (page - 1) * size;
    return filteredOrders.slice(startIndex, startIndex + size);
  }, [filteredOrders, page, size]);

  const totalElements = filteredOrders.length;
  const totalPages = Math.ceil(totalElements / size) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(1);
  };

  if (loading) {
    return <div className="p-6 text-center text-white">Đang tải đơn hàng...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Đơn hàng</h1>
          <p className="text-gray-300 mt-1">Quản lý và theo dõi tất cả đơn hàng</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl border border-purple-500/20">
            <Download className="w-4 h-4" />
            <span>Xuất báo cáo</span>
          </button>
          <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl">
            <Filter className="w-4 h-4" />
            <span>Bộ lọc</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <StatCard icon={<Package className="w-5 h-5 text-blue-400" />} color="bg-blue-500/20" label="Tổng số đơn" value={totalElements} />
        <StatCard icon={<Clock className="w-5 h-5 text-yellow-400" />} color="bg-yellow-500/20" label="Đang chờ" value={orders.filter(o => o.status === 'pending' || o.status === 'init').length} />
        <StatCard icon={<Truck className="w-5 h-5 text-blue-400" />} color="bg-blue-500/20" label="Đang giao" value={orders.filter(o => o.status === 'shipped').length} />
        <StatCard icon={<CheckCircle className="w-5 h-5 text-green-400" />} color="bg-green-500/20" label="Đã giao" value={orders.filter(o => o.status === 'delivered').length} />
        <StatCard icon={<AlertCircle className="w-5 h-5 text-red-400" />} color="bg-red-500/20" label="Đã hủy" value={orders.filter(o => o.status === 'cancelled').length} />
      </div>

      {/* Filters */}
      <div className="bg-white/10 border border-purple-500/20 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-purple-500/20 rounded-xl text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-3"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Đang chờ</option>
            <option value="processing">Đang xử lý</option>
            <option value="shipped">Đang giao</option>
            <option value="delivered">Đã giao</option>
            <option value="cancelled">Đã hủy</option>
            <option value="init">Khởi tạo</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/10 border border-purple-500/20 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-purple-500/20">
              <tr>
                <th className="p-4 text-gray-300">Mã đơn</th>
                <th className="p-4 text-gray-300">Khách hàng</th>
                <th className="p-4 text-gray-300">Sản phẩm</th>
                <th className="p-4 text-gray-300">Tổng tiền</th>
                <th className="p-4 text-gray-300">Trạng thái</th>
                <th className="p-4 text-gray-300">Ngày đặt</th>
                <th className="p-4 text-gray-300">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
                <tr key={order.subOrderId} className="border-b border-purple-500/10 hover:bg-white/5">
                  <td className="p-4 text-white">#{order.subOrderId}</td>
                  <td className="p-4 text-white">{order.userName || order.address?.name || 'N/A'}</td>
                  <td className="p-4 text-white">{order.orderItems[0]?.productVariant?.productName || 'N/A'}</td>
                  <td className="p-4 text-white">{(order.orderItems && order.orderItems.length > 0
    ? order.orderItems.reduce((total, item) => total + (item.subTotal || 0), 0)
    : 0
  ).toLocaleString("vi-VN")} ₫</td>
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-white">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="p-4">
                    <button className="p-2 text-gray-400 hover:text-white"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-gray-400">Không có đơn hàng</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalElements > size && (
        <div className="flex items-center justify-between mt-6">
          <select
            value={size}
            onChange={(e) => handleSizeChange(Number(e.target.value))}
            className="bg-white/10 border border-purple-500/20 rounded-xl text-white px-4 py-2"
          >
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
          </select>
          <div className="flex items-center space-x-2">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-3 py-2 text-gray-400 disabled:opacity-50">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-white">
              Trang {page} / {totalPages}
            </span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-3 py-2 text-gray-400 disabled:opacity-50">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, color, label, value }: { icon: JSX.Element, color: string, label: string, value: number }) => (
  <div className="bg-white/10 border border-purple-500/20 rounded-2xl p-6">
    <div className="flex items-center space-x-3">
      <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-300 text-sm">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  </div>
);

export default OrdersPage;
