import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been confirmed and is being processed.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-purple-600" />
              <span className="font-medium">Order #ORD-2024-001</span>
            </div>
            <p className="text-gray-600 text-sm">
              You will receive an email confirmation shortly with your order details and tracking information.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/account"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Order Details</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/products"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}