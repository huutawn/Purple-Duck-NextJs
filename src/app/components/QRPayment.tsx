'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { CheckCircle, Clock, QrCode, RefreshCw, X } from 'lucide-react';
import { websocketService, OrderStatusUpdate } from '@/app/Service/WebSocket';
import { generateQRCode } from '@/app/Service/Order';

interface QRPaymentProps {
    orderId: number;
    userId: string;
    qrCode: string;
    totalAmount: number;
    onCancel: () => void;
}

export const QRPayment: React.FC<QRPaymentProps> = ({ 
    orderId, 
    userId, 
    qrCode, 
    totalAmount, 
    onCancel 
}) => {
    const [paymentStatus, setPaymentStatus] = useState<string>('paying');
    const [statusMessage, setStatusMessage] = useState<string>('Vui lòng quét mã QR để hoàn thành thanh toán');
    const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);
    const [isLoadingQR, setIsLoadingQR] = useState(true);
    const [qrError, setQrError] = useState<string | null>(null);
    const [isConnecting, setIsConnecting] = useState(true);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const router = useRouter();

    // Generate QR code image
    useEffect(() => {
        const fetchQRImage = async () => {
            setIsLoadingQR(true);
            setQrError(null);
            try {
                console.log('Generating QR code for:', qrCode);
                const response = await generateQRCode(qrCode);
                if (response.result) {
                    setQrImageUrl(response.result);
                    console.log('QR code generated successfully:', response.result);
                } else {
                    throw new Error('Không thể tạo mã QR');
                }
            } catch (error: any) {
                console.error('Failed to generate QR code:', error);
                setQrError(error.message || 'Lỗi khi tạo mã QR');
            } finally {
                setIsLoadingQR(false);
            }
        };

        if (qrCode) {
            fetchQRImage();
        }
    }, [qrCode]);

    // WebSocket connection and subscription
    useEffect(() => {
        let subscription: any = null;

        const connectAndSubscribe = async () => {
            setIsConnecting(true);
            setConnectionError(null);
            
            try {
                console.log('Connecting to WebSocket...');
                await websocketService.connect();
                console.log('WebSocket connected, subscribing to updates...');
                
                subscription = websocketService.subscribeToOrderStatus(userId, (update: OrderStatusUpdate) => {
                    console.log('Received order status update:', update);
                    
                    if (update.orderId === orderId) {
                        handleOrderStatusUpdate(update);
                    }
                });
                
                setIsConnecting(false);
                console.log('Successfully subscribed to order updates');
                
            } catch (error: any) {
                console.error('Failed to connect to WebSocket:', error);
                setConnectionError('Không thể kết nối để nhận cập nhật real-time');
                setIsConnecting(false);
            }
        };

        connectAndSubscribe();

        // Cleanup function
        return () => {
            if (subscription) {
                console.log('Unsubscribing from order updates');
                subscription.unsubscribe();
            }
        };
    }, [orderId, userId]);

    const handleOrderStatusUpdate = (update: OrderStatusUpdate) => {
        const { status, message } = update;
        
        console.log(`Order ${orderId} status updated: ${status} - ${message}`);
        
        setPaymentStatus(status);
        setStatusMessage(message);
        
        // If payment is successful, redirect to success page after a delay
        if (status === 'pending' || status === 'paid') {
            setTimeout(() => {
                router.push(`/payment-success?orderId=${orderId}&qrCode=${qrCode}`);
            }, 2000);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'paying':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'pending':
                return 'bg-blue-50 border-blue-200 text-blue-800';
            case 'paid':
                return 'bg-green-50 border-green-200 text-green-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paying':
                return <Clock className="w-5 h-5" />;
            case 'pending':
                return <RefreshCw className="w-5 h-5" />;
            case 'paid':
                return <CheckCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    };

    const handleRetryQR = async () => {
        setIsLoadingQR(true);
        setQrError(null);
        try {
            const response = await generateQRCode(qrCode);
            if (response.result) {
                setQrImageUrl(response.result);
            }
        } catch (error: any) {
            setQrError(error.message || 'Lỗi khi tạo mã QR');
        } finally {
            setIsLoadingQR(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Thanh toán QR</h1>
                        <button
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Status Display */}
                    <div className={`p-4 rounded-lg border-2 ${getStatusColor(paymentStatus)} mb-6`}>
                        <div className="flex items-center space-x-3">
                            {getStatusIcon(paymentStatus)}
                            <div>
                                <h3 className="font-semibold">
                                    Trạng thái: {paymentStatus === 'paying' ? 'Đang chờ thanh toán' : 
                                               paymentStatus === 'pending' ? 'Đã nhận thanh toán' : 
                                               paymentStatus === 'paid' ? 'Thanh toán thành công' : paymentStatus}
                                </h3>
                                <p className="text-sm">{statusMessage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Connection Status */}
                    {isConnecting && (
                        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                                <span className="text-blue-800 text-sm">Đang kết nối để nhận cập nhật...</span>
                            </div>
                        </div>
                    )}

                    {connectionError && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-orange-800 text-sm">{connectionError}</p>
                        </div>
                    )}

                    {/* QR Code Display */}
                    {paymentStatus === 'paying' && (
                        <div className="text-center mb-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">
                                    Quét mã QR để thanh toán
                                </h3>
                                <p className="text-gray-600 text-sm mb-4">
                                    Sử dụng ứng dụng ngân hàng để quét mã QR bên dưới
                                </p>
                                <div className="bg-purple-50 text-purple-800 px-4 py-2 rounded-lg inline-block">
                                    <span className="font-semibold">
                                        Số tiền: {totalAmount.toLocaleString('vi-VN')} ₫
                                    </span>
                                </div>
                            </div>

                            {isLoadingQR ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <RefreshCw className="w-8 h-8 text-purple-600 animate-spin mb-4" />
                                    <p className="text-gray-600">Đang tạo mã QR...</p>
                                </div>
                            ) : qrError ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <QrCode className="w-12 h-12 text-red-400 mb-4" />
                                    <p className="text-red-600 mb-4">{qrError}</p>
                                    <button
                                        onClick={handleRetryQR}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Thử lại
                                    </button>
                                </div>
                            ) : qrImageUrl ? (
                                <div className="inline-block">
                                    <Image
                                        src={qrImageUrl}
                                        alt="QR Code for Payment"
                                        width={300}
                                        height={300}
                                        className="border border-gray-300 rounded-lg"
                                    />
                                    <p className="text-gray-500 text-sm mt-3">
                                        Mã QR sẽ hết hạn sau 15 phút
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <QrCode className="w-12 h-12 text-gray-400 mb-4" />
                                    <p className="text-gray-600">Không thể hiển thị mã QR</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Success Display */}
                    {(paymentStatus === 'pending' || paymentStatus === 'paid') && (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-12 h-12 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-green-700 mb-2">
                                Thanh toán thành công!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Đang chuyển hướng đến trang xác nhận...
                            </p>
                            <div className="flex items-center justify-center space-x-2">
                                <RefreshCw className="w-4 h-4 text-purple-600 animate-spin" />
                                <span className="text-purple-600">Đang chuyển hướng...</span>
                            </div>
                        </div>
                    )}

                    {/* Order Info */}
                    <div className="bg-gray-50 rounded-lg p-4 mt-6">
                        <h4 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                            <div className="flex justify-between">
                                <span>Mã đơn hàng:</span>
                                <span className="font-medium">#{orderId}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Mã QR:</span>
                                <span className="font-mono text-xs">{qrCode}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tổng tiền:</span>
                                <span className="font-semibold text-purple-600">
                                    {totalAmount.toLocaleString('vi-VN')} ₫
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Button */}
                    {paymentStatus === 'paying' && (
                        <div className="mt-6 text-center">
                            <button
                                onClick={onCancel}
                                className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                            >
                                Hủy thanh toán và quay lại
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
