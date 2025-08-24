import { Client, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { NewOrderMessage } from '@/types';
import Cookies from 'js-cookie';

class WebSocketService {
  private client: Client | null = null;
  private subscriptions: Map<string, StompSubscription> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // Start with 1 second

  constructor() {
    this.initializeClient();
  }

  private getConnectHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    
    // Safely get token from cookies (only on client side)
    if (typeof window !== 'undefined') {
      const token = Cookies.get('authToken');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return headers;
  }

  private initializeClient() {
    // Use the backend WebSocket endpoint
    const WEBSOCKET_URL = 'https://purpleduck.io.vn/ws';
    
    this.client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      connectHeaders: this.getConnectHeaders(),
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
      onConnect: () => {
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        
        // Send subscription message to confirm connection
        this.client?.publish({
          destination: '/app/orders/seller/subscribe',
          body: 'subscribe'
        });
      },
      onDisconnect: () => {
        console.log('WebSocket Disconnected');
        this.handleDisconnection();
      },
      onStompError: (frame) => {
        console.error('STOMP Error:', frame.headers['message'], frame.body);
      },
      onWebSocketError: (error) => {
        console.error('WebSocket Error:', error);
        this.handleDisconnection();
      },
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      reconnectDelay: this.reconnectDelay,
    });
  }

  private handleDisconnection() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.reconnectDelay *= 2; // Exponential backoff
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        if (this.client && !this.client.connected) {
          this.client.activate();
        }
      }, this.reconnectDelay);
    } else {
      console.error('Max reconnection attempts reached. WebSocket connection failed.');
    }
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.client?.connected) {
        resolve();
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('WebSocket connection timeout'));
      }, 10000); // 10 seconds timeout

      this.client!.onConnect = () => {
        clearTimeout(timeout);
        console.log('WebSocket Connected');
        this.reconnectAttempts = 0;
        resolve();
        
        // Send subscription message
        this.client?.publish({
          destination: '/app/orders/seller/subscribe',
          body: 'subscribe'
        });
      };

      this.client!.onStompError = (frame) => {
        clearTimeout(timeout);
        console.error('STOMP Error:', frame);
        reject(new Error(`STOMP Error: ${frame.headers['message']}`));
      };

      this.client?.activate();
    });
  }

  disconnect() {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    
    if (this.client?.connected) {
      this.client.deactivate();
    }
  }

  // Subscribe to new orders for the current seller
  subscribeToSellerOrders(
    sellerId: string, 
    callback: (order: NewOrderMessage) => void
  ): string {
    const subscriptionId = `seller-orders-${sellerId}`;
    const destination = `/topic/orders/seller/${sellerId}`;

    if (this.subscriptions.has(subscriptionId)) {
      this.subscriptions.get(subscriptionId)?.unsubscribe();
    }

    if (!this.client?.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to seller orders.');
      return subscriptionId;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const orderData: NewOrderMessage = JSON.parse(message.body);
        console.log('New order received via WebSocket:', orderData);
        callback(orderData);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`Subscribed to ${destination}`);
    return subscriptionId;
  }

  // Subscribe to order status updates
  subscribeToOrderUpdates(
    sellerId: string, 
    callback: (order: any) => void
  ): string {
    const subscriptionId = `seller-order-updates-${sellerId}`;
    const destination = `/topic/orders/updates/seller/${sellerId}`;

    if (this.subscriptions.has(subscriptionId)) {
      this.subscriptions.get(subscriptionId)?.unsubscribe();
    }

    if (!this.client?.connected) {
      console.warn('WebSocket not connected. Cannot subscribe to order updates.');
      return subscriptionId;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      try {
        const orderData = JSON.parse(message.body);
        console.log('Order update received via WebSocket:', orderData);
        callback(orderData);
      } catch (error) {
        console.error('Error parsing WebSocket update message:', error);
      }
    });

    this.subscriptions.set(subscriptionId, subscription);
    console.log(`Subscribed to ${destination}`);
    return subscriptionId;
  }

  // Unsubscribe from a specific topic
  unsubscribe(subscriptionId: string) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`Unsubscribed from ${subscriptionId}`);
    }
  }

  // Send acknowledgment for an order
  acknowledgeOrder(subOrderId: number) {
    if (!this.client?.connected) {
      console.warn('WebSocket not connected. Cannot acknowledge order.');
      return;
    }

    this.client.publish({
      destination: '/app/orders/acknowledge',
      body: JSON.stringify(subOrderId)
    });
  }

  // Test WebSocket connection
  testConnection() {
    if (!this.client?.connected) {
      console.warn('WebSocket not connected. Cannot send test message.');
      return;
    }

    this.client.publish({
      destination: '/app/orders/test',
      body: JSON.stringify({ message: 'Test connection', timestamp: new Date().toISOString() })
    });
  }

  // Check if WebSocket is connected
  isConnected(): boolean {
    return this.client?.connected || false;
  }

  // Get connection state
  getConnectionState(): string {
    if (!this.client) return 'NOT_INITIALIZED';
    return this.client.connected ? 'CONNECTED' : 'DISCONNECTED';
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();

export default webSocketService;
