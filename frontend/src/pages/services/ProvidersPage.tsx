import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, Droplet, Zap, PaintBucket, Hammer, Wrench, Shield, MapPin, Star, Briefcase, ArrowRight, User } from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useNavigate } from 'react-router-dom';

interface Service {
    id: string;
    title: string;
    description: string;
    category: string;
    priceBase?: number;
    priceUnit?: string;
}

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    author: {
        firstName: string;
        lastName: string;
        avatarUrl?: string | null;
    };
}

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
  yearsExperience?: number;
  isTeam?: boolean;
  teamSize?: number;
  vehicles?: string[];
  tools?: string[];
  // Extended Details
  services?: Service[];
  reviewsReceived?: Review[];
}

const CATEGORIES = [
  { id: 'Todos', label: 'Todos', icon: Sparkles },
  { id: 'Plomería', label: 'Plomería', icon: Droplet },
  { id: 'Electricidad', label: 'Electricidad', icon: Zap },
  { id: 'Pintura', label: 'Pintura', icon: PaintBucket },
  { id: 'Construcción', label: 'Construcción', icon: Hammer },
  { id: 'Servicio Técnico', label: 'Técnico', icon: Wrench },
];

export function ProvidersPage() {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  useEffect(() => {
    loadProviders();
  }, [selectedCategory, searchQuery]);

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

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary-400 text-sm font-medium mb-1">
            <Shield className="w-4 h-4" />
            Comunidad verificada
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Profesionales
          </h1>
          <p className="text-gray-400 max-w-xl text-lg">
            Encuentra expertos calificados y revisa su historial completo.
          </p>
        </div>

        {/* CTA */}
        <div className="flex-shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 p-1 rounded-2xl border border-gray-700/50 shadow-xl hidden md:block">
           <div className="bg-gray-900/90 rounded-[12px] p-5 max-w-xs backdrop-blur-sm">
             <h3 className="font-bold text-white mb-1">¿No encuentras lo que buscas?</h3>
             <p className="text-gray-400 text-sm mb-4">Publica una solicitud general y deja que los profesionales te contacten.</p>
             <button 
               onClick={() => navigate('/request-wizard')}
               className="w-full btn-primary py-2.5 text-sm font-bold shadow-lg shadow-primary-500/20"
             >
               Publicar Solicitud General
             </button>
           </div>
        </div>
      </div>

       {/* Search */}
        <div className="relative group w-full">
           <div className="absolute inset-0 bg-primary-500/5 rounded-2xl blur-xl group-hover:bg-primary-500/10 transition-colors" />
           <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
               <input
               type="text"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Buscar por nombre o especialidad..."
               className="w-full pl-12 pr-4 py-3 bg-gray-900/80 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 transition-all outline-none"
               />
           </div>
       </div>

       {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
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

      {/* Grid List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-gray-800 rounded-3xl animate-pulse border border-gray-700/50" />
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
          {providers.map(provider => (
            <motion.div 
              layout
              key={provider.id}
              onClick={() => navigate(`/profile/${provider.id}`)}
              className="bg-gray-800 rounded-3xl border border-gray-700/50 p-6 cursor-pointer hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10 transition-all group relative overflow-hidden"
            >
                {/* Hover Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/0 group-hover:from-primary-500/5 group-hover:to-transparent transition-all duration-500" />
                
                <div className="relative">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gray-700 overflow-hidden shadow-md">
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
                        <div className="flex items-center gap-1 bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700/50">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                            <span className="text-xs font-bold text-gray-200">{provider.avgRating.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Info */}
                    <h3 className="font-bold text-white text-lg mb-1 group-hover:text-primary-400 transition-colors">
                        {provider.firstName} {provider.lastName}
                    </h3>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                        {provider.trades.slice(0, 2).map((trade, i) => (
                            <span key={i} className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20">
                                {trade}
                            </span>
                        ))}
                        {provider.trades.length > 2 && (
                            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-700 text-gray-400">
                                +{provider.trades.length - 2}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
                        <MapPin className="w-3 h-3" />
                        {provider.zone || 'Buenos Aires'}
                    </div>

                    {/* Footer / CTA */}
                    <div className="flex items-center justify-between border-t border-gray-700/50 pt-4 mt-auto">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Briefcase className="w-3 h-3" />
                            {provider.yearsExperience ? `${provider.yearsExperience} años exp.` : 'Profesional'}
                        </span>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                    </div>
                </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
