import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, Settings, LogOut, Edit3, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockUser } from '../data/mockData';

export default function Account() {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: '+1 (555) 123-4567',
    address: '123 Main St, City, State 12345',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    // Here you would typically save to backend
    setIsEditing(false);
  };

  const orders = [
    {
      id: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 299.99,
      items: 2,
      image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'ORD-2024-002',
      date: '2024-01-10',
      status: 'Shipped',
      total: 159.99,
      items: 1,
      image: 'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 'ORD-2024-003',
      date: '2024-01-05',
      status: 'Processing',
      total: 459.99,
      items: 3,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
  ];

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-8">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-purple-600" />
              </div>
              <div className="text-white">
                <h1 className="text-2xl font-bold">{mockUser.name}</h1>
                <p className="text-purple-200">{mockUser.email}</p>
                <p className="text-purple-200 text-sm">Member since January 2024</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="md:w-64 bg-gray-50 border-r">
              <nav className="p-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? 'bg-purple-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span>{tab.label}</span>
                        </button>
                      </li>
                    );
                  })}
                  <li className="border-t pt-2">
                    <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors">
                      <LogOut className="w-5 h-5" />
                      <span>Sign Out</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {activeTab === 'profile' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                    <button
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>{isEditing ? 'Save Changes' : 'Edit Profile'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={order.image}
                              alt="Order item"
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div>
                              <h3 className="font-semibold text-lg">Order {order.id}</h3>
                              <p className="text-gray-600">{order.date}</p>
                              <p className="text-sm text-gray-500">{order.items} items</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <p className="font-semibold text-lg">${order.total}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <Link
                            to={`/order/${order.id}`}
                            className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </Link>
                          <div className="flex space-x-2">
                            <button className="text-purple-600 hover:text-purple-700 font-medium">
                              Reorder
                            </button>
                            <button className="text-gray-600 hover:text-gray-700 font-medium">
                              Track Package
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Wishlist</h2>
                  <div className="text-center py-12">
                    <Heart className="mx-auto w-16 h-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600">Save items you love for later</p>
                  </div>
                </div>
              )}

              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Privacy Settings</h3>
                      <div className="space-y-4">
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="text-purple-600 focus:ring-purple-500" />
                          <span>Send me promotional emails</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="text-purple-600 focus:ring-purple-500" />
                          <span>SMS notifications for orders</span>
                        </label>
                        <label className="flex items-center space-x-3">
                          <input type="checkbox" className="text-purple-600 focus:ring-purple-500" />
                          <span>Share data with partners</span>
                        </label>
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="font-semibold text-lg mb-4">Security</h3>
                      <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}