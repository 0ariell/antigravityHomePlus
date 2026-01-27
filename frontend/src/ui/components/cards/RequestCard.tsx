import { motion } from 'framer-motion';
import { Clock, ChevronRight, FileText } from 'lucide-react';

interface RequestCardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  category: string;
  quotesCount: number;
  onClick?: () => void;
}

export function RequestCard({
  title,
  description,
  status,
  createdAt,
  category,
  quotesCount,
  onClick
}: RequestCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={`bg-gray-800/50 rounded-2xl p-5 border border-gray-700/50 shadow-sm hover:shadow-md transition-all cursor-pointer group`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-primary-500/10 text-primary-400 text-xs font-semibold rounded-lg">
            {category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(createdAt).toLocaleDateString()}
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
          status === 'OPEN' ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'
        }`}>
          {status === 'OPEN' ? 'Abierto' : status}
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-primary-500 transition-colors">
        {title}
      </h3>
      
      <p className="text-sm text-gray-400 line-clamp-2 mb-4">
        {description}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
          <FileText className="w-4 h-4 text-gray-400" />
          {quotesCount === 0 ? 'Sin presupuestos' : `${quotesCount} presupuestos`}
        </div>
        
        <button className="text-sm font-bold text-primary-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Ver detalles <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
