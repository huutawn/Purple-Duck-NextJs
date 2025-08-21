'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowRight, QrCode } from 'lucide-react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [orderInfo, setOrderInfo] = useState<{orderId?: string, qrCode?: string}>({});

  useEffect(() => {
    if (searchParams) {
      const orderId = searchParams.get('orderId');
      const qrCode = searchParams.get('qrCode');
      
      setOrderInfo({
        orderId: orderId || undefined,
        qrCode: qrCode || undefined
      });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thanh toán thành công!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được xác nhận và đang được xử lý.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Package className="w-5 h-5 text-purple-600" />
              <span className="font-medium">
                Đơn hàng #{orderInfo.orderId || 'N/A'}
              </span>
            </div>
            
            {orderInfo.qrCode && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <QrCode className="w-4 h-4 text-green-600" />
                  <span className="text-green-800 font-medium text-sm">
                    Thanh toán QR thành công
                  </span>
                </div>
                <p className="text-green-700 text-xs">
                  Mã QR: {orderInfo.qrCode}
                </p>
              </div>
            )}
            
            <p className="text-gray-600 text-sm">
              Bạn sẽ nhận được email xác nhận sớm với thông tin chi tiết đơn hàng và thông tin theo dõi.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/account"
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <span>Xem chi tiết đơn hàng</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/products"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
