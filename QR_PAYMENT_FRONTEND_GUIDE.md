# QR Payment System - Frontend Implementation Guide

## Overview
This guide documents the complete frontend implementation of the QR payment system with real-time WebSocket notifications for your Next.js e-commerce platform.

## Files Modified/Created

### 1. Dependencies Added
```bash
npm install sockjs-client @stomp/stompjs
```

### 2. New Files Created

#### `/src/app/Service/WebSocket.ts`
- WebSocket service for handling real-time connections
- Automatic reconnection with exponential backoff
- User-specific and general order status subscriptions

#### `/src/app/components/QRPayment.tsx`
- Complete QR payment interface component
- Real-time status updates via WebSocket
- QR code generation and display
- Automatic redirection on payment success

### 3. Modified Files

#### `/src/app/Service/Order.ts`
- Added `generateQRCode()` function for QR image generation
- API call to `/order/qr` endpoint

#### `/src/app/checkout/page.tsx`
- Integrated QR payment flow
- Added QR payment component rendering
- Enhanced order start handling for QR payments

#### `/src/app/payment-success/page.tsx`
- Dynamic order ID display from URL parameters
- QR payment confirmation display
- Enhanced success message for QR payments

#### `/.env.local`
- Updated API base URL configuration
- Added WebSocket URL configuration

## Payment Flow Implementation

### 1. User Selects QR Payment
```typescript
// In checkout page
const isQR = paymentMethod === 'qr';
const startOrderData: startOrderReq = {
  orderId: order.orderId,
  addressId: selectedAddress.id,
  isQR: isQR,
  note: note,
};
```

### 2. Backend Returns QR Code
```typescript
// Response handling
if (isQR && res.result.QRCode) {
  setQrPaymentData({
    orderId: res.result.orderId,
    qrCode: res.result.QRCode
  });
  setShowQRPayment(true);
}
```

### 3. QR Component Generates Image
```typescript
// QR code image generation
const response = await generateQRCode(qrCode);
if (response.result) {
  setQrImageUrl(response.result);
}
```

### 4. WebSocket Connection
```typescript
// Real-time status monitoring
await websocketService.connect();
subscription = websocketService.subscribeToOrderStatus(userId, (update) => {
  if (update.orderId === orderId) {
    handleOrderStatusUpdate(update);
  }
});
```

### 5. Payment Completion
```typescript
// Auto-redirect on payment success
if (status === 'pending' || status === 'paid') {
  setTimeout(() => {
    router.push(`/payment-success?orderId=${orderId}&qrCode=${qrCode}`);
  }, 2000);
}
```

## Component Structure

### QRPayment Component Props
```typescript
interface QRPaymentProps {
  orderId: number;
  userId: string;
  qrCode: string;
  totalAmount: number;
  onCancel: () => void;
}
```

### WebSocket Service Methods
```typescript
class WebSocketService {
  connect(): Promise<void>
  subscribeToOrderStatus(userId: string, callback: Function)
  subscribeToGeneralOrderStatus(callback: Function)
  disconnect(): void
  isWebSocketConnected(): boolean
}
```

## Key Features Implemented

### ✅ Real-time Payment Tracking
- WebSocket connection with automatic reconnection
- User-specific order status subscriptions
- Live status updates without page refresh

### ✅ QR Code Integration
- Dynamic QR code generation via backend API
- Cloudinary image URL handling
- Error handling and retry mechanisms

### ✅ User Experience
- Loading states for QR generation
- Connection status indicators
- Automatic redirection on success
- Cancel payment functionality

### ✅ Payment Status Flow
1. **"paying"** - QR code displayed, waiting for payment
2. **"pending"** - Payment received, processing order
3. **"paid"** - Payment completed successfully

## Error Handling

### WebSocket Connection Errors
```typescript
// Connection status display
{connectionError && (
  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
    <p className="text-orange-800 text-sm">{connectionError}</p>
  </div>
)}
```

### QR Generation Errors
```typescript
// QR generation retry
{qrError ? (
  <div className="flex flex-col items-center justify-center py-12">
    <QrCode className="w-12 h-12 text-red-400 mb-4" />
    <p className="text-red-600 mb-4">{qrError}</p>
    <button onClick={handleRetryQR}>Thử lại</button>
  </div>
) : (
  // QR code display
)}
```

## Testing the Implementation

### 1. Start Your Applications
```bash
# Backend
./mvnw spring-boot:run

# Frontend
npm run dev
```

### 2. Test QR Payment Flow
1. Add items to cart
2. Go to checkout page
3. Select "Thanh toán bằng QR" option
4. Fill in delivery address
5. Click "Đặt hàng" button
6. Verify QR code is displayed
7. Check WebSocket connection status
8. Simulate payment via backend webhook
9. Verify automatic redirection

### 3. Test WebSocket Connection
```bash
# Open browser developer tools
# Check console for WebSocket logs:
# "WebSocket connected"
# "Subscribing to order status updates for user: {userId}"
# "Received order status update: {update}"
```

## Environment Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws
```

### Production (.env.production)
```env
NEXT_PUBLIC_API_BASE_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=https://your-api-domain.com/ws
```

## Troubleshooting

### Common Issues

#### 1. WebSocket Connection Failed
- Check if backend is running on port 8080
- Verify CORS configuration in backend
- Check browser network tab for WebSocket connection

#### 2. QR Code Not Generated
- Verify `generateQRCode` API endpoint is working
- Check Cloudinary configuration in backend
- Look for API errors in browser network tab

#### 3. Status Updates Not Received
- Confirm WebSocket subscription is active
- Check userId is correctly passed to component
- Verify webhook is triggering notifications

#### 4. Component Not Rendering
- Check if `showQRPayment` state is true
- Verify `qrPaymentData` contains orderId and qrCode
- Ensure user object is available

### Debug Mode
Enable debug logging by adding to WebSocket service:
```typescript
debug: (str) => {
  console.log('STOMP Debug:', str);
}
```

## API Endpoints Used

### Order Management
- `POST /order` - Create order
- `PATCH /order/start` - Start order with payment method
- `GET /order/qr?qrCode={code}` - Generate QR image

### WebSocket
- `WS /ws` - WebSocket endpoint
- `/topic/order-status/{userId}` - User-specific updates
- `/topic/order-status` - General updates

## Security Considerations

### Frontend Security
- Environment variables properly configured
- No sensitive data in localStorage
- WebSocket connections use secure protocols in production

### Production Deployment
- Update CORS settings for production domain
- Use HTTPS for all API calls
- Configure proper WebSocket origins

## Performance Optimizations

### Component Optimization
- Cleanup WebSocket subscriptions on unmount
- Debounce QR generation retries
- Minimize re-renders with proper state management

### Network Optimization
- Connection pooling for WebSocket
- Automatic reconnection with exponential backoff
- Graceful degradation if WebSocket fails

## Conclusion

The QR payment system frontend implementation provides:
- ✅ Seamless QR payment experience
- ✅ Real-time payment status updates  
- ✅ Robust error handling and recovery
- ✅ Mobile-responsive design
- ✅ Production-ready architecture

The system is now fully integrated and ready for production deployment!
