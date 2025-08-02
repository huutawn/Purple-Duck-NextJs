'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();

  // Mock order data
  const order = {
    id: id || 'ORD-2024-001',
    date: '2024-01-20',
    status: 'shipped',
    total: 459.97,
    subtotal: 399.97,
    shipping: 0,
    tax: 32.00,
    estimatedDelivery: '2024-01-25',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        name: 'Premium Wireless Headphones',
        price: 299.99,
        quantity: 1,
        image: 'https://images.pexels.com/photos/3587478/pexels-photo-3587478.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Electronics Store'
      },
      {
        id: '2',
        name: 'Smart Fitness Tracker',
        price: 99.98,
        quantity: 1,
        image: 'https://images.pexels.com/photos/1476321/pexels-photo-1476321.jpeg?auto=compress&cs=tinysrgb&w=400',
        seller: 'Tech Gadgets Co'
      }
    ],
    shippingAddress: {
      name: 'John Doe',
      street: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      phone: '+1 (555) 123-4567'
    },
    paymentMethod: {
      type: 'Credit Card',
      last4: '4242',
      brand: 'Visa'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '2024-01-20',
        time: '2:30 PM',
        completed: true,
        icon: CheckCircle
      },
      {
        status: 'Payment Confirmed',
        date: '2024-01-20',
        time: '2:35 PM',
        completed: true,
        icon: CheckCircle
      },
      {
        status: 'Processing',
        date: '2024-01-21',
        time: '9:00 AM',
        completed: true,
        icon: Package
      },
      {
        status: 'Shipped',
        date: '2024-01-22',
        time: '11:30 AM',
        completed: true,
        icon: Truck
      },
      {
        status: 'Out for Delivery',
        date: '2024-01-25',
        time: 'Expected',
        completed: false,
        icon: Truck
      },
      {
        status: 'Delivered',
        date: '2024-01-25',
        time: 'Expected',
        completed: false,
        icon: CheckCircle
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
      case 'out for delivery':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/account"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
              <p className="text-gray-600 mt-1">Placed on {order.date}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Status</h2>
              <div className="space-y-4">
                {order.timeline.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={index} className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-medium ${
                          step.completed ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {step.status}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {step.date} {step.time !== 'Expected' && `at ${step.time}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {order.trackingNumber && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    <span className="font-medium text-purple-900">Tracking Number:</span>
                    <span className="text-purple-700">{order.trackingNumber}</span>
                  </div>
                  <Link
                    href={`/shipping?track=${order.trackingNumber}`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium mt-2 inline-block"
                  >
                    Track Package →
                  </Link>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Sold by {item.seller}</p>
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping === 0 ? 'Free' : `$${order.shipping}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${order.tax}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${order.total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Shipping Address</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{order.shippingAddress.name}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
                    <p className="text-sm text-gray-600">
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{order.shippingAddress.phone}</span>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">
                    {order.paymentMethod.brand?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{order.paymentMethod.brand} ending in {order.paymentMethod.last4}</p>
                  <p className="text-sm text-gray-600">{order.paymentMethod.type}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors">
                Reorder Items
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Download Invoice
              </button>
              <Link
                href="/messages"
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors block text-center"
              >
                Contact Seller
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}