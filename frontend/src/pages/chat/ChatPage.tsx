import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  Search, 
  Loader2,
  ArrowLeft,
  Smile,
  Check,
  CheckCheck,
  Zap
} from 'lucide-react';

import { useState } from 'react';
import { useChat, type Conversation } from './hooks/useChat';

export function ChatPage() {
  const {
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
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const getOtherParticipant = (conversation: Conversation) => {
    if (!conversation?.booking) return { firstName: 'Usuario', lastName: 'Desconocido' };
    const isProvider = user?.role === 'PROVIDER';
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

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(newMessage);
    setNewMessage('');
  };

  const handleTypingInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    sendTyping(true);
  };

  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    const fullName = `${other.firstName} ${other.lastName}`.toLowerCase();
    const serviceTitle = conv.booking?.service?.title?.toLowerCase() || '';
    return fullName.includes(searchQuery.toLowerCase()) ||
           serviceTitle.includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Cargando conversaciones...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-[calc(100vh-140px)] min-h-[500px]"
    >
      <div className="flex h-full gap-0 lg:gap-6">
        {/* Conversations Sidebar */}
        <motion.div 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className={`w-full lg:w-96 flex flex-col bg-gray-900/50 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-lg ${
            selectedConversation ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white">
                Mensajes
              </h2>
              <span className="px-2.5 py-1 bg-primary-500/20 text-primary-400 text-xs font-semibold rounded-full">
                {conversations.length}
              </span>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar conversación..."
                className="w-full pl-11 pr-4 py-3 bg-gray-900/40 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="font-medium text-white mb-1">Sin conversaciones</h3>
                <p className="text-sm text-gray-400">
                  Las conversaciones con profesionales aparecerán aquí
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-700/50">
                {filteredConversations.map((conv) => {
                  const other = getOtherParticipant(conv);
                  const isSelected = selectedConversation?.id === conv.id;
                  const lastMessage = conv.lastMessage || (conv.messages?.length ? conv.messages[conv.messages.length - 1] : null);

                  return (
                    <motion.button
                      key={conv.id}
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
                      onClick={() => selectConversation(conv)}
                      className={`w-full p-4 flex items-start gap-4 text-left transition-all ${
                        isSelected 
                          ? 'bg-primary-500/10 border-l-4 border-l-primary-500' 
                          : 'hover:bg-gray-700/30'
                      }`}
                    >
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                          {other.firstName?.[0] || 'U'}
                        </div>
                        {/* Static Online Status for now - could be real realtime later */}
                        {/* <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800" /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-white truncate">
                            {other.firstName} {other.lastName}
                          </span>
                          <span className="text-xs text-gray-400 flex-shrink-0">
                            {lastMessage ? formatDate(lastMessage.createdAt) : ''}
                          </span>
                        </div>
                        <p className="text-xs text-primary-400 font-medium mb-1 truncate">
                          {conv.booking?.service?.title || 'Servicio'}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          {lastMessage?.content || 'Sin mensajes aún'}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col bg-gray-900/40 backdrop-blur-md rounded-2xl border border-gray-800 overflow-hidden shadow-xl ${
          selectedConversation ? 'flex' : 'hidden lg:flex'
        }`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 bg-gray-900/60 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => selectConversation(null)} 
                      className="lg:hidden p-2 hover:bg-gray-700 rounded-xl transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-300" />
                    </button>
                    <div className="relative">
                      <div className="w-11 h-11 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                        {getOtherParticipant(selectedConversation).firstName?.[0] || 'U'}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {getOtherParticipant(selectedConversation).firstName}{' '}
                        {getOtherParticipant(selectedConversation).lastName}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-primary-400 font-medium">
                          {selectedConversation.booking?.service?.title || 'Servicio'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Removed Calls/Video buttons for robustness */}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-gradient-to-b from-gray-900/50 to-gray-800">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 bg-primary-500/20 rounded-full flex items-center justify-center mb-4">
                      <Zap className="w-10 h-10 text-primary-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      ¡Iniciá la conversación!
                    </h3>
                    <p className="text-sm text-gray-400 max-w-xs">
                      Coordiná los detalles del trabajo directamente.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Message Status Legend */}
                    <div className="flex justify-center mb-6">
                      <div className="bg-gray-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-gray-800 flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-gray-500" />
                          <span>Enviado</span>
                        </div>
                        <div className="w-[1px] h-3 bg-gray-800" />
                        <div className="flex items-center gap-1.5">
                          <CheckCheck className="w-3 h-3 text-primary-500" />
                          <span>Leído</span>
                        </div>
                      </div>
                    </div>

                    {messages.map((message, index) => {
                      const isOwn = message.senderId === user?.id;
                      const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.senderId !== message.senderId);
                      const showDateHeader = index === 0 || formatDate(message.createdAt) !== formatDate(messages[index - 1].createdAt);

                      return (
                        <div key={message.id}>
                           {showDateHeader && (
                             <div className="flex justify-center my-4">
                               <span className="bg-gray-700/50 px-3 py-1 rounded-full text-xs text-gray-400">
                                 {formatDate(message.createdAt)}
                               </span>
                             </div>
                           )}

                           <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            {!isOwn && (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0 ${
                                showAvatar 
                                  ? 'bg-gradient-to-br from-gray-400 to-gray-500' 
                                  : 'invisible'
                              }`}>
                                {message.sender.firstName?.[0] || 'U'}
                              </div>
                            )}
                            <div className={`max-w-[70%] ${isOwn ? 'order-1' : ''}`}>
                              <div className={`rounded-2xl px-4 py-3 ${
                                isOwn 
                                  ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-br-md shadow-lg shadow-primary-500/20' 
                                  : 'bg-gray-700 border border-gray-600 text-white rounded-bl-md shadow-sm'
                              }`}>
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                              </div>
                              <div className={`flex items-center gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start pl-1'}`}>
                                <span className={`text-[10px] ${isOwn ? 'text-gray-400' : 'text-gray-400'}`}>
                                  {formatTime(message.createdAt)}
                                </span>
                                {isOwn && (
                                  <div className="relative group cursor-help">
                                    {message.readAt ? (
                                      <CheckCheck className="w-3 h-3 text-primary-500" />
                                    ) : (
                                      <Check className="w-3 h-3 text-gray-400" />
                                    )}
                                    
                                    {/* Premium Styled Tooltip */}
                                    <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                                      <div className="bg-gray-900/90 backdrop-blur-md border border-gray-800 px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                          {message.readAt ? 'Leído' : 'Enviado'}
                                        </span>
                                      </div>
                                      {/* Tooltip Arrow */}
                                      <div className="w-2 h-2 bg-gray-900/90 border-r border-b border-gray-800 rotate-45 absolute -bottom-1 right-1" />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                    
                    {/* Typing Indicator */}
                    <AnimatePresence>
                      {typingUsers.size > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="flex items-end gap-2 pt-2"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-500 rounded-full flex items-center justify-center text-white text-xs">
                            {getOtherParticipant(selectedConversation).firstName?.[0] || 'U'}
                          </div>
                          <div className="bg-gray-700 rounded-2xl px-4 py-3 rounded-bl-md">
                            <div className="flex gap-1">
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-700/50 bg-gray-800">
                <div className="flex items-center gap-3">
                  {/* Removed Attachments button */}
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleTypingInput}
                      placeholder="Escribe un mensaje..."
                      className="w-full px-5 py-3.5 bg-gray-900/40 border border-gray-800 text-white placeholder-gray-500 rounded-2xl pr-12 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
                    />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-600 rounded-lg transition-colors">
                      <Smile className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit" 
                    disabled={!newMessage.trim() || isSending} 
                    className="p-3.5 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 disabled:from-gray-600 disabled:to-gray-600 text-white rounded-xl shadow-lg shadow-primary-500/25 disabled:shadow-none transition-all"
                  >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </motion.button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-500/20 to-primary-500/10 rounded-full flex items-center justify-center mb-6">
                <MessageSquare className="w-12 h-12 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Tus mensajes
              </h3>
              <p className="text-gray-400 max-w-sm">
                Seleccioná una conversación para ver los mensajes.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
