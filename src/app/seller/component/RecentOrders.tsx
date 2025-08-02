'use client';

import React from 'react';
import { Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const RecentOrders: React.FC = () => {
  const orders = [
    {
      id: '#3471',
      customer: 'Sarah Johnson',
      product: 'Wireless Headphones',
      amount: '$199.99',
      status: 'delivered',
      time: '2 min ago'
    },
    {
      id: '#3470',
      customer: 'Mike Chen',
      product: 'Smart Watch',
      amount: '$299.99',
      status: 'processing',
      time: '15 min ago'
    },
    {
      id: '#3469',
      customer: 'Emma Davis',
      product: 'Laptop Stand',
      amount: '$89.99',
      status: 'shipped',
      time: '1 hour ago'
    },
    {
      id: '#3468',
      customer: 'James Wilson',
      product: 'Phone Case',
      amount: '$24.99',
      status: 'pending',
      time: '2 hours ago'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'shipped':
        return <Package className="w-4 h-4 text-blue-400" />;
      case 'processing':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-orange-400" />;
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
      default:
        return 'text-orange-400 bg-orange-400/20';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Recent Orders</h3>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {order.customer.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{order.customer}</p>
                <p className="text-gray-300 text-sm">{order.product} • {order.id}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-white font-semibold">{order.amount}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
                <span className="text-gray-400 text-xs">{order.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentOrders;