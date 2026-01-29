import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  MessageSquare,
  Star,
  Zap,
  MapPin
} from 'lucide-react';
import type { ReactNode } from 'react';

import { BOOKING_STATUS, type BookingStatus } from '../../../app/constants/domain';

interface BookingCardProps {
  id: string;
  title: string;
  description: string;
  status: BookingStatus;
  date: string;
  image?: string;
  price?: number | null;
  counterParty: {
    name: string;
    avatar?: string | null;
    role: 'Provider' | 'Client';
    rating?: number;
  };
  onChat?: () => void;
  actions?: ReactNode;
  onClick?: () => void;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: any }> = {
  [BOOKING_STATUS.PENDING]: { label: 'Pendiente', color: 'bg-yellow-500/10 text-yellow-400', icon: Clock },
  [BOOKING_STATUS.ACCEPTED]: { label: 'Aceptado', color: 'bg-blue-500/10 text-blue-400', icon: CheckCircle },
  [BOOKING_STATUS.IN_PROGRESS]: { label: 'En Progreso', color: 'bg-orange-500/10 text-orange-400', icon: Zap },
  [BOOKING_STATUS.COMPLETED]: { label: 'Completado', color: 'bg-green-500/10 text-green-400', icon: CheckCircle },
  [BOOKING_STATUS.CANCELLED]: { label: 'Cancelado', color: 'bg-red-500/10 text-red-400', icon: X },
  [BOOKING_STATUS.REJECTED]: { label: 'Rechazado', color: 'bg-red-500/10 text-red-400', icon: X },
};

export function BookingCard({
  title,
  description,
  status,
  date,
  image,
  price,
  counterParty,
  onChat,
  onMapClick, // New prop
  actions,
  onClick
}: BookingCardProps & { onMapClick?: () => void }) {
  const statusInfo = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      layout
      onClick={onClick}
      className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl p-0 border border-gray-800/50 overflow-hidden hover:bg-gray-800/40 transition-all ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex flex-col sm:flex-row">
        {/* Left Status Strip */}
        <div className={`hidden sm:block w-2 self-stretch ${
          status === BOOKING_STATUS.COMPLETED ? 'bg-green-500' :
          status === BOOKING_STATUS.IN_PROGRESS ? 'bg-orange-500' :
          status === BOOKING_STATUS.ACCEPTED ? 'bg-blue-500' :
          status === BOOKING_STATUS.PENDING ? 'bg-yellow-500' :
          'bg-gray-600'
        }`} />

        <div className="flex-1 p-5 lg:p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gray-700 overflow-hidden flex-shrink-0">
                {image ? (
                  <img src={image} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-500/20 to-primary-600/20">
                    <Calendar className="w-6 h-6 text-primary-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white line-clamp-1">{title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {statusInfo.label}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {date}
                  </span>
                </div>
              </div>
            </div>
            
            {price && (
              <div className="text-right hidden sm:block">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-white">${price.toLocaleString()}</p>
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-6 sm:pl-[4.5rem]">
            {description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:pl-[4.5rem] pt-4 border-t border-gray-700/50">
            {/* Counterparty Info */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-bold text-gray-200 ring-2 ring-gray-800">
                {counterParty.avatar ? (
                  <img src={counterParty.avatar} alt={counterParty.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  counterParty.name[0]
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  {counterParty.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{counterParty.role === 'Provider' ? 'Profesional' : 'Cliente'}</span>
                  {counterParty.rating && counterParty.rating > 0 && (
                    <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {counterParty.rating.toFixed(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {onChat && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onChat(); }}
                  className="p-2.5 text-gray-500 hover:bg-gray-700 rounded-xl transition-colors relative group"
                  title="Enviar mensaje"
                >
                  <MessageSquare className="w-5 h-5 group-hover:text-primary-400 transition-colors" />
                </button>
              )}
              {onMapClick && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onMapClick(); }}
                  className="p-2.5 text-gray-500 hover:bg-gray-700 rounded-xl transition-colors relative group"
                  title="Ver ubicación"
                >
                  <MapPin className="w-5 h-5 group-hover:text-green-400 transition-colors" />
                </button>
              )}
              {actions}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
