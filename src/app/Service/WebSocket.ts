import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

export interface OrderStatusUpdate {
    orderId: number;
    qrCode: string;
    status: string;
    message: string;
    timestamp: string;
    userId: string;
}

class WebSocketService {
    private stompClient: Client | null = null;
    private isConnected = false;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                // Create SockJS connection
                const socket = new SockJS(`${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080' || 'http://165.22.246.17'}/ws`);
                
                this.stompClient = new Client({
                    webSocketFactory: () => socket,
                    connectHeaders: {},
                    debug: (str) => {
                        console.log('STOMP Debug:', str);
                    },
                    onConnect: (frame) => {
                        console.log('WebSocket connected:', frame);
                        this.isConnected = true;
                        this.reconnectAttempts = 0;
                        resolve();
                    },
                    onStompError: (frame) => {
                        console.error('WebSocket STOMP error:', frame);
                        this.isConnected = false;
                        reject(new Error('WebSocket connection failed'));
                    },
                    onWebSocketError: (event) => {
                        console.error('WebSocket error:', event);
                        this.isConnected = false;
                    },
                    onDisconnect: () => {
                        console.log('WebSocket disconnected');
                        this.isConnected = false;
                        this.attemptReconnect();
                    },
                });

                this.stompClient.activate();
                
            } catch (error) {
                console.error('Error creating WebSocket connection:', error);
                reject(error);
            }
        });
    }

    private attemptReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect().catch((error) => {
                    console.error('Reconnection failed:', error);
                });
            }, 2000 * this.reconnectAttempts); // Exponential backoff
        } else {
            console.error('Max reconnection attempts reached');
        }
    }

    subscribeToOrderStatus(userId: string, callback: (update: OrderStatusUpdate) => void) {
        if (!this.stompClient || !this.isConnected) {
            throw new Error('WebSocket not connected');
        }

        console.log(`Subscribing to order status updates for user: ${userId}`);

        return this.stompClient.subscribe(`/topic/order-status/${userId}`, (message) => {
            try {
                const update: OrderStatusUpdate = JSON.parse(message.body);
                console.log('Received order status update:', update);
                callback(update);
            } catch (error) {
                console.error('Error parsing order status update:', error);
            }
        });
    }

    subscribeToGeneralOrderStatus(callback: (update: OrderStatusUpdate) => void) {
        if (!this.stompClient || !this.isConnected) {
            throw new Error('WebSocket not connected');
        }

        return this.stompClient.subscribe('/topic/order-status', (message) => {
            try {
                const update: OrderStatusUpdate = JSON.parse(message.body);
                console.log('Received general order status update:', update);
                callback(update);
            } catch (error) {
                console.error('Error parsing general order status update:', error);
            }
        });
    }

    disconnect() {
        if (this.stompClient) {
            console.log('Disconnecting WebSocket...');
            this.stompClient.deactivate();
            this.isConnected = false;
        }
    }

    isWebSocketConnected() {
        return this.isConnected;
    }
}

// Export singleton instance
export const websocketService = new WebSocketService();
