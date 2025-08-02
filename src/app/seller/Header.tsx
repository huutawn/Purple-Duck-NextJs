"use client";

import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-black/40 backdrop-blur-xl border-b border-purple-500/20">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-300 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="pl-10 pr-4 py-2 bg-white/10 border border-purple-500/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-300 hover:text-white transition-colors">
            <Bell className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">3</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-medium hidden sm:block">John Smith</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;