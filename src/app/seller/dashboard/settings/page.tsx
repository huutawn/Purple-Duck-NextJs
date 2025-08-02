"use client";

import React, { useState } from 'react';
import { User, Store, Shield, CreditCard, Bell, Globe, Palette, Save } from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Palette }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Profile Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            defaultValue="John"
            className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            defaultValue="Smith"
            className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Email Address</label>
        <input
          type="email"
          defaultValue="john.smith@email.com"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
        <input
          type="tel"
          defaultValue="+1 (555) 123-4567"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
        <textarea
          rows={4}
          defaultValue="Experienced e-commerce seller with a passion for quality products and customer satisfaction."
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );

  const renderStoreSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Store Configuration</h3>
      
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Store Name</label>
        <input
          type="text"
          defaultValue="SellerHub Store"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Store Description</label>
        <textarea
          rows={3}
          defaultValue="Premium quality products with fast shipping and excellent customer service."
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Currency</label>
          <select className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="CAD">CAD - Canadian Dollar</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Time Zone</label>
          <select className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="EST">Eastern Time (EST)</option>
            <option value="PST">Pacific Time (PST)</option>
            <option value="CST">Central Time (CST)</option>
            <option value="MST">Mountain Time (MST)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Store Address</label>
        <textarea
          rows={3}
          defaultValue="123 Business Street, Suite 100, New York, NY 10001, United States"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Security Settings</h3>
      
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Current Password</label>
        <input
          type="password"
          placeholder="Enter current password"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">New Password</label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">Confirm New Password</label>
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-300">Add an extra layer of security to your account</p>
            <p className="text-gray-400 text-sm mt-1">Status: Disabled</p>
          </div>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
            Enable 2FA
          </button>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Login Sessions</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Current Session - Chrome on Windows</p>
              <p className="text-gray-400 text-sm">New York, NY • Active now</p>
            </div>
            <span className="text-green-400 text-sm">Current</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Mobile App - iPhone</p>
              <p className="text-gray-400 text-sm">New York, NY • 2 hours ago</p>
            </div>
            <button className="text-red-400 hover:text-red-300 text-sm">Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Billing & Subscription</h3>
      
      <div className="bg-white/5 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-white font-semibold">Current Plan</h4>
            <p className="text-gray-400">Premium Seller Plan</p>
          </div>
          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-gray-400 text-sm">Monthly Fee</p>
            <p className="text-white font-semibold">$49.99</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Next Billing</p>
            <p className="text-white font-semibold">Feb 15, 2024</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Transaction Fee</p>
            <p className="text-white font-semibold">2.9%</p>
          </div>
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
          Upgrade Plan
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Payment Methods</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-white">•••• •••• •••• 4242</p>
                <p className="text-gray-400 text-sm">Expires 12/25</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">Primary</span>
              <button className="text-gray-400 hover:text-white text-sm">Edit</button>
            </div>
          </div>
        </div>
        <button className="mt-4 bg-white/10 hover:bg-white/15 text-white px-4 py-2 rounded-xl transition-colors border border-purple-500/20">
          Add Payment Method
        </button>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Billing History</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Premium Plan - January 2024</p>
              <p className="text-gray-400 text-sm">Jan 15, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-white">$49.99</p>
              <button className="text-purple-400 hover:text-purple-300 text-sm">Download</button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Premium Plan - December 2023</p>
              <p className="text-gray-400 text-sm">Dec 15, 2023</p>
            </div>
            <div className="text-right">
              <p className="text-white">$49.99</p>
              <button className="text-purple-400 hover:text-purple-300 text-sm">Download</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Notification Preferences</h3>
      
      <div className="space-y-4">
        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">Email Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">New Orders</p>
                <p className="text-gray-400 text-sm">Get notified when you receive new orders</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Low Stock Alerts</p>
                <p className="text-gray-400 text-sm">Get notified when products are running low</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Customer Reviews</p>
                <p className="text-gray-400 text-sm">Get notified about new product reviews</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white/5 rounded-xl p-6">
          <h4 className="text-white font-semibold mb-4">Push Notifications</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Sales Milestones</p>
                <p className="text-gray-400 text-sm">Celebrate when you reach sales goals</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Payment Updates</p>
                <p className="text-gray-400 text-sm">Get notified about payment confirmations</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-white">Preferences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
          <select className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-300 text-sm font-medium mb-2">Date Format</label>
          <select className="w-full bg-white/10 border border-purple-500/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500">
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
      </div>

      <div className="bg-white/5 rounded-xl p-6">
        <h4 className="text-white font-semibold mb-4">Dashboard Preferences</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Dark Mode</p>
              <p className="text-gray-400 text-sm">Use dark theme for the dashboard</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Compact View</p>
              <p className="text-gray-400 text-sm">Show more data in less space</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'store':
        return renderStoreSettings();
      case 'security':
        return renderSecuritySettings();
      case 'billing':
        return renderBillingSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'preferences':
        return renderPreferences();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Tiêu đề */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Cài Đặt</h1>
          <p className="text-gray-300 mt-1">Quản lý tài khoản và tùy chọn cửa hàng của bạn</p>
        </div>
        <button className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition-colors">
          <Save className="w-4 h-4" />
          <span>Lưu Thay Đổi</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Thanh điều hướng */}
        <div className="lg:col-span-1">
          <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left
                    ${activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/25' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Nội dung */}
        <div className="lg:col-span-3">
          <div className="bg-white/10 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;