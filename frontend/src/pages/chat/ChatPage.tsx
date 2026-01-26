// ChatPage component
import { useEffect, useState, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Loader2,
  ArrowLeft,
  Image as ImageIcon
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { socketService } from '../../infra/realtime';

interface Message {
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

interface Conversation {
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
  messages: Message[];
  updatedAt: string;
}

export function ChatPage() {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  // Real-time message subscription
  useEffect(() => {
    const unsubscribeMessage = socketService.on('newMessage', (message: Message) => {
      if (message.conversationId === selectedConversation?.id) {
        setMessages((prev) => [...prev, message]);
        scrollToBottom();
      }
      // Update conversation list
      setConversations((prev) => 
        prev.map((conv) => 
          conv.id === message.conversationId 
            ? { ...conv, messages: [...conv.messages, message], updatedAt: message.createdAt }
            : conv
        ).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      );
    });

    const unsubscribeTyping = socketService.on('userTyping', (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          if (data.isTyping) {
            next.add(data.userId);
          } else {
            next.delete(data.userId);
          }
          return next;
        });
      }
    });

    return () => {
      unsubscribeMessage();
      unsubscribeTyping();
    };
  }, [selectedConversation?.id, user?.id]);

  // Join/leave conversation room
  useEffect(() => {
    if (selectedConversation) {
      socketService.joinConversation(selectedConversation.id);
      loadMessages(selectedConversation.id);
    }

    return () => {
      if (selectedConversation) {
        socketService.leaveConversation(selectedConversation.id);
      }
    };
  }, [selectedConversation?.id]);

  const loadConversations = async () => {
    try {
      const response = await httpClient.get('/chat/conversations');
      setConversations(response.data || []);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    setIsLoadingMessages(true);
    try {
      const response = await httpClient.get(`/chat/conversations/${conversationId}`);
      setMessages(response.data.messages || []);
      scrollToBottom();
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!conversation?.booking) return { firstName: 'Usuario', lastName: 'Desconocido' };
    const isProvider = user?.role === 'PROVIDER';
    // If provider, return client. If client, return provider.
    const participant = isProvider ? conversation.booking.client : conversation.booking.provider;
    return participant || { firstName: 'Usuario', lastName: 'Desconocido' };
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    
    if (isToday) return 'Hoy';
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
    
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    try {
      await socketService.sendMessage(selectedConversation.id, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleTyping = () => {
    if (!selectedConversation) return;

    socketService.sendTyping(selectedConversation.id, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socketService.sendTyping(selectedConversation.id, false);
    }, 2000);
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    const fullName = `${other.firstName} ${other.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) ||
           conv.booking.service.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in h-[calc(100vh-180px)] min-h-[500px]">
      <div className="flex h-full gap-4 lg:gap-6">
        {/* Conversations List - Hidden on mobile when conversation is selected */}
        <div className={`w-full lg:w-80 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden ${
          selectedConversation ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Mensajes</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conversación..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No hay conversaciones</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const other = getOtherParticipant(conv);
                const isSelected = selectedConversation?.id === conv.id;
                const lastMessage = conv.messages[conv.messages.length - 1];

                return (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full p-4 flex items-start gap-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${
                      isSelected ? 'bg-orange-50 border-l-2 border-l-orange-500' : ''
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                      {other.firstName?.[0] || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 truncate">
                          {other.firstName} {other.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {lastMessage ? formatDate(lastMessage.createdAt) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mb-1">{conv.booking.service.title}</p>
                      <p className="text-sm text-gray-500 truncate">
                        {lastMessage?.content || 'Sin mensajes'}
                      </p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden ${
          selectedConversation ? 'flex' : 'hidden lg:flex'
        }`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setSelectedConversation(null)}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-medium">
                    {getOtherParticipant(selectedConversation).firstName?.[0] || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {getOtherParticipant(selectedConversation).firstName}{' '}
                      {getOtherParticipant(selectedConversation).lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedConversation.booking.service.title}
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Phone className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Video className="w-5 h-5 text-gray-500" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageSquare className="w-12 h-12 text-gray-300 mb-3" />
                    <p className="text-sm">Comienza la conversación</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              isOwn
                                ? 'bg-orange-500 text-white rounded-br-sm'
                                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
                            }`}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className={`text-xs mt-1 ${isOwn ? 'text-orange-100' : 'text-gray-400'}`}>
                              {formatTime(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    {typingUsers.size > 0 && (
                      <div className="flex justify-start">
                        <div className="bg-gray-200 rounded-2xl px-4 py-2">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                            <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <button type="button" className="p-2 hover:bg-gray-100 rounded-lg transition-colors hidden sm:block">
                    <ImageIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      handleTyping();
                    }}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="p-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white rounded-xl transition-colors"
                  >
                    {isSending ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Tus mensajes</h3>
              <p className="text-sm">Selecciona una conversación para comenzar</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
