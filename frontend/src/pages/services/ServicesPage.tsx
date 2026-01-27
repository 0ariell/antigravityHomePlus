import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Briefcase, Grid, List, Sparkles, ChevronRight, Zap, Droplet, PaintBucket, Wrench, Hammer, Key, Flower, Shield } from 'lucide-react';
import { httpClient } from '../../infra/http';
import { SkeletonCard } from '../../ui';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  priceBase: number | null;
  priceUnit: string | null;
  images: string[];
  avgRating: number;
  totalReviews: number;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating: number;
    isOnline?: boolean;
  };
}

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', icon: Sparkles, color: 'from-gray-500 to-gray-600' },
  { id: 'Plomería', label: 'Plomería', icon: Droplet, color: 'from-blue-500 to-blue-600' },
  { id: 'Electricidad', label: 'Electricidad', icon: Zap, color: 'from-yellow-500 to-amber-500' },
  { id: 'Pintura', label: 'Pintura', icon: PaintBucket, color: 'from-pink-500 to-rose-500' },
  { id: 'Carpintería', label: 'Carpintería', icon: Hammer, color: 'from-amber-600 to-orange-600' },
  { id: 'Albañilería', label: 'Albañilería', icon: Wrench, color: 'from-stone-500 to-stone-600' },
  { id: 'Cerrajería', label: 'Cerrajería', icon: Key, color: 'from-slate-500 to-slate-600' },
  { id: 'Jardinería', label: 'Jardinería', icon: Flower, color: 'from-green-500 to-emerald-500' },
];

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadServices();
  }, [selectedCategory]);

  const loadServices = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Todos') {
        params.append('category', selectedCategory);
      }
      const response = await httpClient.get(`/services?${params}`);
      setServices(response.data.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredServices = services.filter(
    (service) =>
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-500 text-sm font-medium mb-1">
            <Shield className="w-4 h-4" />
            Profesionales verificados
          </div>
          <h1 className="heading-2 text-gray-900 dark:text-white">
            Encontrá al experto ideal
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {filteredServices.length} profesionales disponibles
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por servicio, profesional o zona..."
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all shadow-sm"
          />
        </div>

        {/* Category Cards */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  isActive
                    ? 'bg-gradient-to-r ' + cat.color + ' text-white border-transparent shadow-lg'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  isActive ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                }`}>
                  <cat.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                </div>
                <span className={`font-medium text-sm whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                  {cat.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 card"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No encontramos resultados
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Probá con otros términos de búsqueda o seleccioná otra categoría.
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                to={`/services/${service.id}`}
                className={`card group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''}`}
              >
                {/* Image */}
                <div
                  className={`relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 ${
                    viewMode === 'list' ? 'w-48 h-36' : 'h-44'
                  }`}
                >
                  {service.images[0] ? (
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Briefcase className="w-12 h-12 text-gray-300 dark:text-gray-600" />
                    </div>
                  )}
                  
                  {/* Category Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r ${selectedCat?.color || 'from-primary-500 to-primary-600'} shadow-lg`}>
                    {service.category}
                  </div>

                  {/* Online indicator */}
                  {service.provider.isOnline && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                      Online
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {service.avgRating.toFixed(1)}
                      </span>
                    </div>
                    <span className="text-sm text-gray-400">
                      ({service.totalReviews} reseñas)
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
                    {service.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{service.zone}</span>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                        {service.provider.firstName?.[0] || 'P'}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">
                          {service.provider.firstName} {service.provider.lastName?.[0]}.
                        </span>
                      </div>
                    </div>
                    {service.priceBase ? (
                      <div className="text-right">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ${service.priceBase}
                        </span>
                        {service.priceUnit && (
                          <span className="text-xs text-gray-400 block">/{service.priceUnit}</span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400 flex items-center gap-1">
                        Ver más <ChevronRight className="w-4 h-4" />
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
