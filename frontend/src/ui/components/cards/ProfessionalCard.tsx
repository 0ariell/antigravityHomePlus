import { motion } from 'framer-motion';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfessionalCardProps {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  rating: number;
  reviews: number;
  zone: string;
  avatarUrl?: string | null;
  isOnline?: boolean;
}

export function ProfessionalCard({
  id,
  firstName,
  lastName,
  category,
  rating,
  reviews,
  zone,
  avatarUrl,
  isOnline
}: ProfessionalCardProps) {
  return (
    <Link to={`/profile/${id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="group relative bg-white dark:bg-gray-800 rounded-3xl p-5 border border-gray-100 dark:border-gray-700/50 shadow-sm hover:shadow-xl transition-all duration-300 text-center"
      >
        {/* Verification Badge */}
        <div className="absolute top-4 right-4 text-blue-500">
          <CheckCircle className="w-5 h-5 fill-blue-50/50" />
        </div>

        {/* Avatar */}
        <div className="relative inline-block mb-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 p-1 mx-auto">
            {avatarUrl ? (
              <img src={avatarUrl} alt={firstName} className="w-full h-full rounded-full object-cover border-2 border-white dark:border-gray-800" />
            ) : (
              <div className="w-full h-full rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-primary-600 border-2 border-white dark:border-gray-800">
                {firstName[0]}
                {lastName[0]}
              </div>
            )}
          </div>
          {isOnline && (
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full" />
          )}
        </div>

        {/* Info */}
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary-500 transition-colors">
          {firstName} {lastName}
        </h3>
        
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="px-2.5 py-0.5 bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 text-xs font-semibold rounded-full">
            {category}
          </span>
          <div className="flex items-center gap-1 text-xs font-medium text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-500" />
            {rating.toFixed(1)} ({reviews})
          </div>
        </div>

        <div className="flex items-center justify-center gap-1 text-xs text-gray-400 mb-4">
          <MapPin className="w-3.5 h-3.5" />
          {zone}
        </div>

        <button className="w-full py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700 text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:bg-primary-500 group-hover:text-white transition-all shadow-sm group-hover:shadow-primary-500/25">
          Ver Perfil
        </button>
      </motion.div>
    </Link>
  );
}
