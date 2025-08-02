'use client';

import React from 'react';
import { TrendingUp, TrendingDown, ShoppingCart, DollarSign, Package, Users } from 'lucide-react';

const MetricsGrid: React.FC = () => {
  const metrics = [
    {
      title: 'Total Revenue',
      value: '$12,847',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Orders',
      value: '1,247',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Products Sold',
      value: '3,421',
      change: '-2.1%',
      trend: 'down',
      icon: Package,
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'New Customers',
      value: '892',
      change: '+15.3%',
      trend: 'up',
      icon: Users,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <div
          key={index}
          className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:border-purple-400/30"
        >
          <div className="flex items-center justify-between">
            <div className={`w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl flex items-center justify-center`}>
              <metric.icon className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 ${
              metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {metric.trend === 'up' ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{metric.change}</span>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-gray-300 text-sm font-medium">{metric.title}</h3>
            <p className="text-2xl font-bold text-white mt-1">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;