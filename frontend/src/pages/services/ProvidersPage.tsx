import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Droplet, Zap, PaintBucket, Hammer, Wrench, Shield, MapPin, Star, ChevronRight, User } from 'lucide-react';
import { httpClient } from '../../infra/http';
import { ProviderProfileModal } from '../../components/ProviderProfileModal';
import { useNavigate } from 'react-router-dom';

interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  zone: string | null;
  trades: string[];
  avgRating: number;
  totalReviews: number;
  isOnline: boolean;
  bio: string | null;
}

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', icon: Sparkles, color: 'from-gray-500 to-gray-600' },
  { id: 'Plomería', label: 'Plomería', icon: Droplet, color: 'from-blue-500 to-blue-600' },
  { id: 'Electricidad', label: 'Electricidad', icon: Zap, color: 'from-yellow-500 to-amber-500' },
  { id: 'Pintura', label: 'Pintura', icon: PaintBucket, color: 'from-pink-500 to-rose-500' },
  { id: 'Construcción', label: 'Construcción', icon: Hammer, color: 'from-amber-600 to-orange-600' },
  { id: 'Servicio Técnico', label: 'Técnico', icon: Wrench, color: 'from-stone-500 to-stone-600' },
];

export function ProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  
  // Profile Modal State
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadProviders();
  }, [selectedCategory, searchQuery]); // Reload when filters change (debounce could be added)

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'Todos') {
        params.append('category', selectedCategory);
      }
      if (searchQuery) {
        params.append('q', searchQuery);
      }
      
      const response = await httpClient.get(`/auth/providers/search?${params}`);
      setProviders(response.data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProviderClick = (providerId: string) => {
    setSelectedProviderId(providerId);
    setShowProfileModal(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      {/* Header & CTA */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-sm font-medium mb-1">
            <Shield className="w-4 h-4" />
            Comunidad verificada
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Trabajadores Disponibles
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Explora perfiles, lee reseñas y contacta directamente con los mejores profesionales de tu zona.
          </p>
        </div>

        {/* General Request CTA */}
        <div className="flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-2xl border border-gray-700/50 shadow-xl">
           <div className="bg-gray-900/90 rounded-[12px] p-5 max-w-xs backdrop-blur-sm">
             <h3 className="font-bold text-white mb-1">¿No encuentras lo que buscas?</h3>
             <p className="text-gray-400 text-sm mb-4">Publica una solicitud general y deja que los profesionales te contacten a ti.</p>
             <button 
               onClick={() => navigate('/request-wizard')}
               className="w-full btn-primary py-2.5 text-sm font-bold shadow-lg shadow-primary-500/20"
             >
               Publicar Solicitud General
             </button>
           </div>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-6">
        <div className="relative group">
          <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur-xl group-hover:bg-primary-500/10 transition-colors" />
          <div className="relative">
             <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-hover:text-primary-400 transition-colors" />
             <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Buscar por nombre, barrio o especialidad..."
               className="w-full pl-14 pr-4 py-4 bg-gray-900/80 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
             />
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border ${
                  isActive
                    ? 'bg-primary-500/10 border-primary-500/50 text-white'
                    : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-gray-500'}`} />
                <span className="font-medium text-sm">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700">
           <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">No se encontraron trabajadores</h3>
           <p className="text-gray-500">Prueba ajustando los filtros o tu búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((provider) => (
            <motion.div
              layout
              key={provider.id}
              onClick={() => handleProviderClick(provider.id)}
              className="group bg-gray-800 rounded-3xl p-5 border border-gray-700/50 hover:border-primary-500/30 transition-all cursor-pointer relative overflow-hidden"
            >
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 via-primary-500/0 to-primary-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gray-700 overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                      {provider.avatarUrl ? (
                        <img src={provider.avatarUrl} alt={provider.firstName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-500">{provider.firstName[0]}</div>
                      )}
                    </div>
                    {provider.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-gray-800 rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg group-hover:text-primary-400 transition-colors">
                      {provider.firstName} {provider.lastName}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{provider.avgRating.toFixed(1)}</span>
                      <span className="text-gray-500 font-normal">({provider.totalReviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trades */}
              <div className="flex flex-wrap gap-2 mb-4 relative z-10">
                {provider.trades.map((trade, i) => (
                  <span key={i} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-gray-700/50 text-gray-300 border border-gray-700">
                    {trade}
                  </span>
                ))}
              </div>

              {/* Zone / Bio snippet */}
              <div className="space-y-2 mb-4 relative z-10">
                 {provider.zone && (
                   <div className="flex items-center gap-2 text-sm text-gray-400">
                     <MapPin className="w-4 h-4" />
                     <span className="truncate">{provider.zone}</span>
                   </div>
                 )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 relative z-10">
                 <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Ver Perfil</span>
                 <div className="w-8 h-8 rounded-full bg-gray-700 group-hover:bg-primary-500 group-hover:text-white flex items-center justify-center transition-colors">
                   <ChevronRight className="w-4 h-4" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedProviderId && (
        <ProviderProfileModal 
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          providerId={selectedProviderId}
        />
      )}
    </motion.div>
  );
}
