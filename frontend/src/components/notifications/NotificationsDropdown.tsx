import { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotificationStore } from '../../app/stores/notificationStore';
import type { Notification } from '../../app/stores/notificationStore';

const NOTIFICATION_ICONS: Record<string, string> = {
  BOOKING_CREATED: '📋',
  BOOKING_ACCEPTED: '✅',
  BOOKING_REJECTED: '❌',
  BOOKING_COMPLETED: '🎉',
  BOOKING_CANCELLED: '🚫',
  NEW_MESSAGE: '💬',
  NEW_REVIEW: '⭐',
  PAYMENT_RECEIVED: '💰',
};

export function NotificationsDropdown() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    notifications,
    unreadCount,
    isLoading,
    loadNotifications,
    loadUnreadCount,
    markAsRead,
    markAllAsRead,
    setupRealtime,
  } = useNotificationStore();

  useEffect(() => {
    loadUnreadCount();
    const unsubscribe = setupRealtime();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' });
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.readAt) {
      markAsRead(notification.id);
    }
    
    // Improved Navigation Logic
    const type = notification.type;
    const data = notification.data || {};

    if (type === 'NEW_MESSAGE') {
      navigate('/chat', { state: { bookingId: data.bookingId } });
    } else if (type.startsWith('BOOKING_')) {
      navigate('/my-jobs');
    } else if (type === 'NEW_REVIEW') {
      navigate('/profile');
    } else if (type === 'PAYMENT_RECEIVED') {
      navigate('/dashboard');
    } else {
      // Fallback
      navigate('/dashboard');
    }

    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-2xl transition-all ${
          isOpen ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary-500 rounded-full border-2 border-[#0a0a0f] shadow-[0_0_10px_rgba(255,107,0,0.5)]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-gray-900/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-gray-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h3 className="font-bold text-lg text-white font-display">Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-primary-400 hover:text-primary-300 font-bold flex items-center gap-1 transition-colors bg-primary-500/10 px-3 py-1.5 rounded-full"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Leído
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
            {isLoading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">Actualizando...</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-700">
                  <Bell className="w-8 h-8 text-gray-500" />
                </div>
                <p className="text-gray-200 font-bold">Todo al día</p>
                <p className="text-gray-500 text-sm mt-1">No tienes notificaciones pendientes.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-800/50">
                {notifications.slice(0, 20).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`w-full p-5 text-left hover:bg-white/5 transition-all flex gap-4 ${
                      !notification.readAt ? 'bg-primary-500/[0.03]' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center text-2xl shadow-inner">
                      {NOTIFICATION_ICONS[notification.type] || '🔔'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`font-bold text-sm truncate ${!notification.readAt ? 'text-white' : 'text-gray-300'}`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter whitespace-nowrap mt-0.5">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                      {!notification.readAt && (
                        <div className="mt-2 text-[10px] font-bold text-primary-400 flex items-center gap-1">
                           <div className="w-1 h-1 bg-primary-500 rounded-full animate-pulse" /> NUEVA
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-800">
            <button 
              onClick={() => {navigate('/notifications'); setIsOpen(false);}}
              className="w-full py-2.5 text-center text-xs text-gray-400 hover:text-white font-bold transition-colors bg-gray-800/50 rounded-xl hover:bg-gray-800"
            >
              Ver todo el historial
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
