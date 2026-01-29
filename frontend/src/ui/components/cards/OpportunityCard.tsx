import { motion } from 'framer-motion';
import { MapPin, Clock, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OpportunityCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  urgency: string;
  budget?: number | null;
  createdAt: string;
  clientName: string;
}

export function OpportunityCard({
  id,
  title,
  description,
  category,
  zone,
  urgency,
  budget,
  createdAt,
  clientName
}: OpportunityCardProps) {

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1h';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  const isUrgent = urgency === 'urgent';

  return (
    <Link to={`/leads/${id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`group relative bg-gray-900/50 backdrop-blur-sm rounded-2xl p-4 border transition-all duration-300 ${isUrgent ? 'border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]' : 'border-gray-800'}`}
      >
        {isUrgent && (
          <div className="absolute top-0 right-0 px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-bl-xl rounded-tr-xl flex items-center gap-1 shadow-md">
            <Zap className="w-3 h-3 fill-white" />
            URGENTE
          </div>
        )}

        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
              category === 'Plomería' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              category === 'Electricidad' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
              'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {category}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimeAgo(createdAt)}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors line-clamp-1">
          {title}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">
          {description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-700 dark:text-gray-200">
                {clientName[0]}
              </div>
              <span className="truncate max-w-[100px]">{clientName}</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="truncate max-w-[120px]">{zone}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {budget ? (
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                ${budget.toLocaleString()}
              </span>
            ) : (
              <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                A convenir
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
