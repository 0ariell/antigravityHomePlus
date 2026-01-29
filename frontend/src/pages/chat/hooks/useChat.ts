import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { httpClient } from '../../../infra/http';
import { socketService } from '../../../infra/realtime/socketService';
import { useAuthStore } from '../../../app/stores/authStore';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments: string[];
  createdAt: string;
  readAt: string | null;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

export interface Conversation {
  id: string;
  bookingId: string;
  booking: {
    id: string;
    service: {
      title: string;
    };
    client: {
      id: string;
      firstName: string;
      lastName: string;
    };
    provider: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
  messages?: Message[];
  lastMessage?: Message | null;
  updatedAt: string;
}

export function useChat() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Initial Load
  useEffect(() => {
    socketService.connectChat();
    loadConversations().then((loadedConvs) => {
      const stateBookingId = (location.state as any)?.bookingId;
      if (stateBookingId && loadedConvs.length > 0) {
        const targetConv = loadedConvs.find(c => c.bookingId === stateBookingId);
        if (targetConv) {
          selectConversation(targetConv);
        }
      }
    });

    return () => {
      // socketService.disconnect(); // Don't disconnect global socket on unmount, maybe? Or yes to save resources.
    };
  }, []);

  // Socket Events
  useEffect(() => {
    const unsubscribeMessage = socketService.on('newMessage', (message: Message) => {
      // If message belongs to active conversation
      if (selectedConversation?.id === message.conversationId) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
        // Mark as read immediately if window is focused (simplified: just mark it)
        if (message.senderId !== user?.id) {
           socketService.markAsRead(message.conversationId);
        }
      }

      // Update conversation list logic
      setConversations((prev) => 
        prev.map((conv) => 
          conv.id === message.conversationId 
            ? { 
                ...conv, 
                messages: [...(conv.messages || []), message], 
                lastMessage: message,
                updatedAt: message.createdAt 
              }
            : conv
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    });

    const unsubscribeTyping = socketService.on('userTyping', (data: { userId: string; isTyping: boolean; conversationId: string }) => {
      // Only care about typing in current conversation
      if (selectedConversation?.id === data.conversationId && data.userId !== user?.id) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (data.isTyping) next.add(data.userId);
          else next.delete(data.userId);
          return next;
        });
      }
    });

    const unsubscribeRead = socketService.on('messagesRead', (data: { conversationId: string; readBy: string; readAt: string }) => {
       if (data.readBy === user?.id) return; // Ignore own reads confirmation

       if (selectedConversation?.id === data.conversationId) {
          setMessages(prev => prev.map(m => m.readAt ? m : { ...m, readAt: data.readAt }));
       }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
      unsubscribeRead();
    };
  }, [selectedConversation?.id, user?.id]);

  const loadConversations = async (): Promise<Conversation[]> => {
    try {
      const response = await httpClient.get('/chat/conversations');
      const data = response.data || [];
      setConversations(data);
      return data;
    } catch (error) {
      console.error('Error loading conversations:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const selectConversation = async (conv: Conversation) => {
    if (selectedConversation?.id === conv.id) return;
    
    // Leave previous
    if (selectedConversation) {
        socketService.leaveConversation(selectedConversation.id);
    }

    setSelectedConversation(conv);
    setIsLoadingMessages(true);
    setTypingUsers(new Set()); // Reset typing

    try {
      // Join & Load
      await socketService.joinConversation(conv.id);
      const response = await httpClient.get(`/chat/conversations/${conv.id}`);
      const msgs = response.data.messages || [];
      setMessages(msgs);
      
      // Mark as read immediately on open
      socketService.markAsRead(conv.id);
      
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!content.trim() || !selectedConversation || isSending) return;
    setIsSending(true);
    try {
      await socketService.sendMessage(selectedConversation.id, content.trim());
      // Message is optimistically added? No, we wait for socket event usually, or duplicate logic.
      // Socket event 'newMessage' handles addition.
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const sendTyping = (isTyping: boolean) => {
    if (!selectedConversation) return;
    
    socketService.sendTyping(selectedConversation.id, isTyping);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        socketService.sendTyping(selectedConversation.id, false);
      }, 2000);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return {
    user,
    conversations,
    selectedConversation,
    messages,
    isLoading,
    isLoadingMessages,
    isSending,
    typingUsers,
    messagesEndRef,
    selectConversation,
    sendMessage,
    sendTyping
  };
}
