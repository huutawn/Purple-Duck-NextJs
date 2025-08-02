'use client';

import React from 'react';
import { Star, TrendingUp } from 'lucide-react';

const TopProducts: React.FC = () => {
  const products = [
    {
      name: 'Wireless Headphones',
      sales: 1247,
      revenue: '$24,940',
      rating: 4.8,
      trend: '+12%'
    },
    {
      name: 'Smart Watch',
      sales: 892,
      revenue: '$17,840',
      rating: 4.6,
      trend: '+8%'
    },
    {
      name: 'Laptop Stand',
      sales: 634,
      revenue: '$9,510',
      rating: 4.9,
      trend: '+15%'
    },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Top Products</h3>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <div className="flex-1">
              <h4 className="text-white font-medium">{product.name}</h4>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-gray-300 text-sm">{product.sales} sold</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-gray-300 text-sm">{product.rating}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-semibold">{product.revenue}</p>
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <TrendingUp className="w-3 h-3" />
                <span>{product.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;