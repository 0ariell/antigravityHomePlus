import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Star, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { useState } from 'react';

interface ServiceCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  priceBase?: number | null;
  priceUnit?: string | null;
  images: string[];
  rating: number;
  reviews: number;
  provider: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    isOnline?: boolean;
    isVerified?: boolean;
  };
  zone?: string;
}

export function ServiceCard({
  id,
  title,
  description,
  category,
  priceBase,
  priceUnit,
  images,
  rating,
  reviews,
  provider,
  zone
}: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={`/services/${id}`}>
      <motion.div
        className="group relative bg-gray-800/50 rounded-3xl overflow-hidden border border-gray-700/50 hover:bg-gray-800/70 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
      >
        {/* Image Area */}
        <div className="relative h-48 overflow-hidden">
          {images[0] ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
              <Sparkles className="w-12 h-12 text-gray-600" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-xs font-semibold text-white shadow-sm border border-white/10">
              {category}
            </span>
          </div>

          {/* Online Badge */}
          {provider.isOnline && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1.5 bg-green-500/90 backdrop-blur-md rounded-full text-xs font-medium text-white shadow-sm border border-white/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              Online
            </div>
          )}

          {/* Quick Actions Overlay (on Hover) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center gap-2"
          >
            <button className="p-3 bg-white text-gray-900 rounded-full hover:scale-110 transition-transform shadow-lg">
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-bold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
                {title}
              </h3>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-sm font-semibold text-white">{rating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({reviews})</span>
              </div>
            </div>
            
            {/* Price Tag */}
            {priceBase && (
              <div className="text-right">
                <div className="text-lg font-bold text-white">
                  ${priceBase.toLocaleString()}
                </div>
                {priceUnit && (
                  <div className="text-xs text-gray-500 font-medium">
                    /{priceUnit}
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400 line-clamp-2 mb-4 h-10">
            {description}
          </p>

          {/* Footer: Provider & Zone */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-800">
                  {provider.firstName[0]}
                  {provider.lastName[0]}
                </div>
                {provider.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center ring-1 ring-gray-800">
                    <Zap className="w-2.5 h-2.5 text-white fill-white" />
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white leading-none mb-1">
                  {provider.firstName} {provider.lastName}
                </span>
                {zone && (
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    {zone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
