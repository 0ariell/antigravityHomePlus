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

  // Mock images for cover background
  const getCoverImage = (index: number) => {
    const images = [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop', // Electrician / Dark
      'https://images.unsplash.com/photo-1581094794329-cd132c4a9191?q=80&w=2600&auto=format&fit=crop', // Worker / Industrial
      'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2531&auto=format&fit=crop', // Architecture / Concrete
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2670&auto=format&fit=crop', // Wood / Warm
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=2669&auto=format&fit=crop', // Tools
      'https://images.unsplash.com/photo-1534237710431-e2fc698436d0?q=80&w=2532&auto=format&fit=crop'  // Clean / Bright
    ];
    return images[index % images.length];
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

      {/* Search Bar */}
      <div className="relative w-full max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar profesional por nombre o especialidad..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-4 pl-12 pr-4 rounded-2xl bg-gray-800/50 border border-gray-700 text-white focus:ring-primary-500 focus:border-primary-500 focus:outline-none transition-all"
          />
      </div>

       {/* Categories */}
      <div className="flex flex-wrap gap-3">
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
              ? 'bg-primary-500 text-white shadow-lg'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
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
          {providers.map((provider, index) => (
            <motion.div 
              layout
              key={provider.id}
              onClick={() => navigate(`/profile/${provider.id}`)}
              className="group relative bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-300 transform hover:-translate-y-1"
            >
                {/* Cover Image with Gradient Overlay */}
                <div className="absolute top-0 inset-x-0 h-32">
                   <img 
                      src={getCoverImage(index)} 
                      alt="Cover" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-b from-gray-900/10 via-gray-900/60 to-gray-900" />
                </div>
                
                <div className="relative p-6 pt-20">
                    {/* Header: Avatar & Rating */}
                    <div className="flex justify-between items-start mb-4">
                        <div className="relative">
                            <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-gray-700 shadow-xl overflow-hidden group-hover:border-primary-500/50 transition-colors">
                                {provider.avatarUrl ? (
                                    <img src={provider.avatarUrl} alt={provider.firstName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400 bg-gray-800">
                                      {provider.firstName[0]}
                                    </div>
                                )}
                            </div>
                            {provider.isOnline && (
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-gray-900"></span>
                                </span>
                            )}
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                           <div className="flex items-center gap-1 bg-gray-800 px-2.5 py-1 rounded-full border border-gray-700">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                              <span className="text-xs font-bold text-gray-200">{provider.avgRating.toFixed(1)}</span>
                           </div>
                           <span className="text-[10px] text-gray-500 uppercase tracking-wider font-medium">{provider.totalReviews} reseñas</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors font-display">
                                {provider.firstName} {provider.lastName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                                <MapPin className="w-3 h-3" />
                                {provider.zone || 'Zona AMBA'}
                            </div>
                        </div>

                        {/* Trades */}
                        <div className="flex flex-wrap gap-1.5">
                            {provider.trades.slice(0, 3).map((trade, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-300 font-medium">
                                    {trade}
                                </span>
                            ))}
                            {provider.trades.length > 3 && (
                                <span className="px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-xs text-gray-500">
                                    +{provider.trades.length - 3}
                                </span>
                            )}
                        </div>

                        {/* Bio / Experience */}
                        <div className="pt-3 border-t border-gray-800">
                            <p className="text-sm text-gray-500 line-clamp-2 mb-3 min-h-[40px]">
                                {provider.bio || 'Profesional verificado de HomePlus. Experiencia comprobable y excelentes calificaciones.'}
                            </p>
                            
                            <div className="flex items-center justify-between">
                                {provider.yearsExperience ? (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-primary-400 bg-primary-500/5 px-2 py-1 rounded-lg">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {provider.yearsExperience} Años de Exp.
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-lg">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        Verificado
                                    </div>
                                )}
                                
                                <span className="text-xs font-bold text-white group-hover:translate-x-1 transition-transform flex items-center gap-1">
                                    Ver Perfil <ArrowRight className="w-3 h-3" />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
