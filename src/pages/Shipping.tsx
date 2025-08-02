import React, { useState } from 'react';
import { Package, Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Shipping() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);

  const handleTrackOrder = () => {
    if (trackingNumber.trim()) {
      // Mock tracking result
      setTrackingResult({
        orderNumber: trackingNumber,
        status: 'In Transit',
        estimatedDelivery: '2024-01-25',
        currentLocation: 'Distribution Center - Chicago, IL',
        events: [
          {
            date: '2024-01-22',
            time: '10:30 AM',
            location: 'Distribution Center - Chicago, IL',
            status: 'Package arrived at facility',
            icon: Package
          },
          {
            date: '2024-01-21',
            time: '3:45 PM',
            location: 'Processing Center - Detroit, MI',
            status: 'Package departed facility',
            icon: Truck
          },
          {
            date: '2024-01-21',
            time: '9:15 AM',
            location: 'Processing Center - Detroit, MI',
            status: 'Package arrived at facility',
            icon: Package
          },
          {
            date: '2024-01-20',
            time: '5:20 PM',
            location: 'Seller Location',
            status: 'Package picked up',
            icon: CheckCircle
          }
        ]
      });
    }
  };

  const shippingInfo = [
    {
      title: 'Free Standard Shipping',
      description: 'Free shipping on orders over $50',
      time: '5-7 business days',
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'Express Shipping',
      description: 'Fast delivery for urgent orders',
      time: '2-3 business days',
      icon: Truck,
      color: 'text-blue-600'
    },
    {
      title: 'Same Day Delivery',
      description: 'Available in select cities',
      time: 'Same day',
      icon: Clock,
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shipping & Tracking</h1>
          <p className="text-lg text-gray-600">Track your orders and learn about our shipping options</p>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Tracking Number
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your tracking number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={handleTrackOrder}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Track Order
              </button>
            </div>
          </div>

          {trackingResult && (
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Order Number</h3>
                  <p className="text-sm text-gray-600">{trackingResult.orderNumber}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Truck className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Status</h3>
                  <p className="text-sm text-gray-600">{trackingResult.status}</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Estimated Delivery</h3>
                  <p className="text-sm text-gray-600">{trackingResult.estimatedDelivery}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Current Location:</span>
                  <span className="text-gray-600">{trackingResult.currentLocation}</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Tracking History</h3>
                <div className="space-y-4">
                  {trackingResult.events.map((event: any, index: number) => {
                    const Icon = event.icon;
                    return (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <Icon className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{event.status}</p>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-xs text-gray-500">{event.date} at {event.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Options */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Options</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingInfo.map((option, index) => {
              const Icon = option.icon;
              return (
                <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-3 mb-4">
                    <Icon className={`w-8 h-8 ${option.color}`} />
                    <h3 className="font-medium text-gray-900">{option.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-3">{option.description}</p>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-500">{option.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping Policy */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Policy</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Processing Time</h3>
              <p className="text-gray-600">
                Orders are typically processed within 1-2 business days. You'll receive a confirmation email with tracking information once your order ships.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Shipping Locations</h3>
              <p className="text-gray-600">
                We ship to all 50 states in the US, as well as Canada and major international destinations. Shipping rates and delivery times vary by location.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Special Handling</h3>
              <p className="text-gray-600">
                Some items may require special handling or have longer processing times. These will be clearly marked on the product page.
              </p>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Important Note</span>
              </div>
              <p className="text-yellow-700 mt-2">
                Delivery times are estimates and may vary due to weather conditions, carrier delays, or other unforeseen circumstances.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}