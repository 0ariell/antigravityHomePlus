import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Droplet, Zap, PaintBucket, Hammer, Wrench, Key, Flower, Shield } from 'lucide-react';
import { httpClient } from '../../infra/http';
import { SkeletonCard } from '../../ui';
import { ServiceCard } from '../../ui/components/cards/ServiceCard';

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
    isVerified?: boolean;
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

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
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
      </div>

      {/* Search & Categories */}
      <div className="space-y-6">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur-xl group-hover:bg-primary-500/10 transition-colors" />
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-primary-500 transition-colors" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué servicio estás buscando?"
              className="w-full pl-14 pr-4 py-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all shadow-sm text-lg"
            />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 relative group overflow-hidden px-6 py-3 rounded-2xl transition-all ${
                  isActive
                    ? 'shadow-lg shadow-primary-500/25'
                    : 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700/50 hover:border-gray-200'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-r ${cat.color}`} />
                )}
                
                <div className="relative flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-500'}`} />
                  <span className={`font-medium whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                    {cat.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredServices.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700"
        >
          <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No encontramos resultados
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Intenta buscando con otros términos o selecciona "Todos" para ver los servicios disponibles.
          </p>
          <button 
            onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
            className="mt-6 px-6 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            Limpiar filtros
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <ServiceCard 
                id={service.id}
                title={service.title}
                description={service.description}
                category={service.category}
                priceBase={service.priceBase}
                priceUnit={service.priceUnit}
                images={service.images}
                rating={service.avgRating}
                reviews={service.totalReviews}
                provider={{
                  firstName: service.provider.firstName,
                  lastName: service.provider.lastName,
                  avatarUrl: service.provider.avatarUrl,
                  isOnline: service.provider.isOnline,
                  isVerified: service.provider.isVerified
                }}
                zone={service.zone}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
