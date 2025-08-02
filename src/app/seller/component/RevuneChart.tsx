'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';

const RevenueChart: React.FC = () => {
  const data = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 75 },
    { month: 'Mar', value: 85 },
    { month: 'Apr', value: 70 },
    { month: 'May', value: 90 },
    { month: 'Jun', value: 95 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Revenue Overview</h3>
          <p className="text-gray-300 text-sm mt-1">Monthly revenue trends</p>
        </div>
        <div className="flex items-center space-x-2 text-green-400">
          <TrendingUp className="w-5 h-5" />
          <span className="font-semibold">+12.5%</span>
        </div>
      </div>

      <div className="relative h-64">
        <div className="flex items-end justify-between h-full space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full relative">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg transition-all duration-1000 ease-out hover:from-purple-500 hover:to-purple-300"
                  style={{ 
                    height: `${(item.value / maxValue) * 200}px`,
                    animationDelay: `${index * 100}ms`
                  }}
                />
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-white text-sm font-medium">
                  ${item.value}k
                </div>
              </div>
              <span className="text-gray-300 text-sm mt-2">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart;