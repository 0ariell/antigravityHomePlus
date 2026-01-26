import { io, Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;
  private chatSocket: Socket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  // Main socket for notifications
  connect() {
    if (this.socket?.connected) return;

    const token = this.getToken();
    if (!token) return;

    this.socket = io(API_URL, {
      auth: { token },
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('notification', (data) => {
      this.emit('notification', data);
    });
  }

  // Chat namespace socket
  connectChat() {
    if (this.chatSocket?.connected) return;

    const token = this.getToken();
    if (!token) return;

    this.chatSocket = io(`${API_URL}/chat`, {
      auth: { token },
      transports: ['websocket'],
    });

    this.chatSocket.on('connect', () => {
      console.log('Chat socket connected:', this.chatSocket?.id);
    });

    this.chatSocket.on('disconnect', () => {
      console.log('Chat socket disconnected');
    });

    // Forward chat events
    this.chatSocket.on('newMessage', (data) => {
      this.emit('newMessage', data);
    });

    this.chatSocket.on('userTyping', (data) => {
      this.emit('userTyping', data);
    });
  }

  disconnect() {
    this.socket?.disconnect();
    this.chatSocket?.disconnect();
    this.socket = null;
    this.chatSocket = null;
  }

  // Chat-specific methods
  joinConversation(conversationId: string) {
    return new Promise((resolve, reject) => {
      if (!this.chatSocket) {
        reject(new Error('Chat socket not connected'));
        return;
      }

      this.chatSocket.emit('joinConversation', { conversationId }, (response: any) => {
        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response);
        }
      });
    });
  }

  leaveConversation(conversationId: string) {
    this.chatSocket?.emit('leaveConversation', { conversationId });
  }

  sendMessage(conversationId: string, content: string, attachments: string[] = []) {
    return new Promise((resolve, reject) => {
      if (!this.chatSocket) {
        reject(new Error('Chat socket not connected'));
        return;
      }

      this.chatSocket.emit(
        'sendMessage',
        { conversationId, content, attachments },
        (response: any) => {
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.message);
          }
        }
      );
    });
  }

  sendTyping(conversationId: string, isTyping: boolean) {
    this.chatSocket?.emit('typing', { conversationId, isTyping });
  }

  // Event subscription system
  on(event: string, callback: (data: any) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  private emit(event: string, data: any) {
    this.listeners.get(event)?.forEach((callback) => callback(data));
  }
}

export const socketService = new SocketService();
