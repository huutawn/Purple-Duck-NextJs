'use client';

import React, { useState } from 'react';
import { Users, Package, DollarSign, TrendingUp, Shield, Settings, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { title: 'Total Users', value: '2,543', icon: Users, color: 'bg-blue-500' },
    { title: 'Total Products', value: '1,234', icon: Package, color: 'bg-green-500' },
    { title: 'Total Revenue', value: '$125,430', icon: DollarSign, color: 'bg-purple-500' },
    { title: 'Growth Rate', value: '+15.3%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: CheckCircle },
    { id: 'reports', label: 'Reports', icon: AlertTriangle },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-2 mb-2">
            <Shield className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Monitor and manage the entire platform</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-purple-500 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.title} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center">
                      <div className={`${stat.color} p-3 rounded-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Users</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">New user registered</p>
                          <p className="text-xs text-gray-500">user{i}@example.com</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order #ORD-{1000 + i}</p>
                            <p className="text-xs text-gray-500">2 minutes ago</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-green-600">$299.99</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">User Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-purple-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">User {i}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        user{i}@example.com
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {i % 3 === 0 ? 'Seller' : 'Buyer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-purple-600 hover:text-purple-900 mr-4">Edit</button>
                        <button className="text-red-600 hover:text-red-900">Block</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && activeTab !== 'users' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {tabs.find(tab => tab.id === activeTab)?.icon && (
                  React.createElement(tabs.find(tab => tab.id === activeTab)!.icon, {
                    className: "w-8 h-8 text-gray-400"
                  })
                )}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {tabs.find(tab => tab.id === activeTab)?.label} Coming Soon
              </h3>
              <p className="text-gray-600">This feature is under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}