'use client';

import React, { useState, useEffect } from 'react'; // Add useEffect for loading user
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Heart,
  Bell,
  MessageCircle,
  LogOut
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useApp } from '@/context/AppContext';
import Cookies from 'js-cookie'; // Import js-cookie để remove token khi logout
import { useProfileStore } from "@/app/zustand/store"; // Import useProfileStore để fetch profile nếu cần

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getCartItemCount } = useCart();
  const { state: appState, dispatch } = useApp(); // Rename state to appState to avoid conflict
  const router = useRouter();
  const { fetchProfile } = useProfileStore(); // Lấy fetchProfile từ store

  // Load user nếu có token nhưng appState.user null (fix Sign In vẫn hiển thị sau login)
  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token && !appState.user) {
      fetchProfile().then(() => { // Không lấy parameter vì fetchProfile trả Promise<void>
        const userData = useProfileStore.getState().User; // Lấy User từ store
        if (userData) {
          const mappedUser = {
            id: String(userData.id),
            name: userData.fullName, // Map fullName to name
            email: userData.email,
            role: (userData.roles[0]?.name || '').toLowerCase(), // Map to string
            // Add other fields if needed in AppContext's User type, e.g., createdAt if required
          };
          dispatch({ type: 'SET_USER', payload: mappedUser });
        }
      }).catch((err) => {
        console.error('Failed to fetch profile:', err);
        Cookies.remove('authToken');
        router.push('/login');
      });
    }
  }, [appState.user, dispatch, fetchProfile, router]);

  // Subscribe to Zustand store to detect changes immediately after login (fix need reload)
  useEffect(() => {
    const unsubscribe = useProfileStore.subscribe((storeState) => {
      if (storeState.User && !appState.user) {
        const userData = storeState.User;
        const mappedUser = {
          id: String(userData.id),
          name: userData.fullName,
          email: userData.email,
          role: (userData.roles[0]?.name || '').toLowerCase(),
        };
        dispatch({ type: 'SET_USER', payload: mappedUser });
      }
    });
    return unsubscribe;
  }, [appState.user, dispatch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null }); // Hoặc dùng 'LOGOUT' nếu đã có action riêng
    Cookies.remove('authToken'); // Remove token
    setIsUserMenuOpen(false);
    router.push('/login');
  };

  const handleSellerClick = () => {
    if (appState.user) {
      router.push('/seller/register');
    } else {
      router.push('/login');
    }
  };

  const cartItemCount = getCartItemCount();

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-2 rounded-lg">
              <div className="w-8 h-8 text-white flex items-center justify-center font-bold text-xl">
                🦆
              </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
              PurpleDuck
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </form>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={handleSellerClick}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm border border-purple-600 px-3 py-1 rounded-lg hover:bg-purple-50 transition-colors"
              >
                Want to be a Seller?
              </button>
              <Link href="/messages" className="text-gray-600 hover:text-purple-600 transition-colors">
                <MessageCircle className="w-6 h-6" />
              </Link>
              <Link href="/wishlist" className="text-gray-600 hover:text-purple-600 transition-colors">
                <Heart className="w-6 h-6" />
              </Link>
              <Link href="/notifications" className="text-gray-600 hover:text-purple-600 transition-colors">
                <Bell className="w-6 h-6" />
              </Link>
              <Link href="/cart" className="relative text-gray-600 hover:text-purple-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              {appState.user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <User className="w-6 h-6" />
                  </button>
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">{appState.user.name}</p>
                        <p className="text-xs text-gray-500">{appState.user.email}</p>
                      </div>
                      <Link
                        href="/account"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-600 hover:text-purple-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link
              href="/messages"
              className="block px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Messages
            </Link>
            <Link
              href="/wishlist"
              className="block px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link
              href="/cart"
              className="block px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md flex items-center justify-between"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            {appState.user ? (
              <>
                <Link
                  href="/account"
                  className="block px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-gray-50 rounded-md flex items-center"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="block px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}