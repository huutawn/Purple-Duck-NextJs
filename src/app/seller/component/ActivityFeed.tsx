'use client';

import React from 'react';
import { ShoppingCart, Package, Star, TrendingUp, User, Bell } from 'lucide-react';

const ActivityFeed: React.FC = () => {
  const activities = [
    {
      type: 'order',
      message: 'New order received from Sarah Johnson',
      time: '5 min ago',
      icon: ShoppingCart,
      color: 'text-green-400'
    },
    {
      type: 'review',
      message: 'New 5-star review on Wireless Headphones',
      time: '12 min ago',
      icon: Star,
      color: 'text-yellow-400'
    },
    {
      type: 'inventory',
      message: 'Smart Watch inventory running low (5 left)',
      time: '23 min ago',
      icon: Package,
      color: 'text-orange-400'
    },
    {
      type: 'sales',
      message: 'Daily sales target achieved!',
      time: '1 hour ago',
      icon: TrendingUp,
      color: 'text-purple-400'
    },
    {
      type: 'customer',
      message: 'New customer registered: Mike Chen',
      time: '2 hours ago',
      icon: User,
      color: 'text-blue-400'
    },
    {
      type: 'notification',
      message: 'Weekly report is ready for download',
      time: '3 hours ago',
      icon: Bell,
      color: 'text-gray-400'
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Activity Feed</h3>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          Mark All Read
        </button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
          >
            <div className={`w-8 h-8 ${activity.color} bg-current/20 rounded-full flex items-center justify-center flex-shrink-0`}>
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
            </div>
            <div className="flex-1">
              <p className="text-white text-sm">{activity.message}</p>
              <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;