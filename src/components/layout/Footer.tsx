import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-2 rounded-lg">
                <div className="w-8 h-8 text-white flex items-center justify-center font-bold text-xl">
                  🦆
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                PurpleDuck
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Your premium destination for quality products and exceptional shopping experience.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/category/electronics" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Customer Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-purple-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">123 Commerce St, City, State 12345</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-purple-400" />
                <span className="text-gray-400">support@purpleduck.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2024 PurpleDuck. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}