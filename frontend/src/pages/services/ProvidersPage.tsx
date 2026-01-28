import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Droplet, Zap, PaintBucket, Hammer, Wrench, Shield, MapPin, Star, ChevronDown, Briefcase, Users, Truck, MessageSquare, ArrowRight, Loader2, User } from 'lucide-react';
import { httpClient } from '../../infra/http';
import { RequestModal } from '../../ui/components/bookings/RequestModal';
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  // Modal State
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

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

  const toggleExpand = async (providerId: string) => {
      if (expandedId === providerId) {
          setExpandedId(null);
          return;
      }
      
      setExpandedId(providerId);

      // Fetch details if not already present
      const provider = providers.find(p => p.id === providerId);
      if (provider && !provider.services) {
          try {
              const res = await httpClient.get(`/auth/users/${providerId}/public-profile`);
              const details = res.data;
              setProviders(prev => prev.map(p => 
                  p.id === providerId ? { ...p, ...details } : p
              ));
          } catch (err) {
              console.error('Error fetching provider details', err);
          }
      }
  };

  const handleRequestClick = (e: React.MouseEvent, providerId: string) => {
      e.stopPropagation();
      setSelectedProviderId(providerId);
      setShowRequestModal(true);
  };

  const renderStars = (rating: number) => {
    return (
        <div className="flex text-amber-500">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-current' : 'text-gray-600'}`} />
            ))}
        </div>
    );
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

      {/* Expandable List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-800 rounded-3xl animate-pulse border border-gray-700/50" />
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 rounded-3xl border border-dashed border-gray-700">
           <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
           <h3 className="text-xl font-bold text-white mb-2">No se encontraron trabajadores</h3>
           <p className="text-gray-500">Prueba ajustando los filtros o tu búsqueda.</p>
        </div>
      ) : (
      <div className="space-y-4">
          {providers.map(provider => {
              const isExpanded = expandedId === provider.id;
              
              return (
                  <motion.div 
                    layout
                    key={provider.id}
                    className={`bg-gray-800 rounded-3xl border overflow-hidden transition-all ${isExpanded ? 'border-primary-500/30 ring-1 ring-primary-500/20' : 'border-gray-700/50 hover:border-gray-600'}`}
                  >
                      {/* Collapsed Header (Clickable) */}
                      <div 
                        onClick={() => toggleExpand(provider.id)}
                        className="p-5 cursor-pointer flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                      >
                          <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-700 overflow-hidden shadow-lg">
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
                                    <h3 className="font-bold text-white text-lg">{provider.firstName} {provider.lastName}</h3>
                                    <div className="flex items-center gap-2 text-sm mt-0.5">
                                        <span className="text-primary-400 font-semibold">{provider.trades[0]}</span>
                                        <span className="text-gray-600">•</span>
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3.5 h-3.5 text-amber-500 fill-current" />
                                            <span className="text-gray-300">{provider.avgRating.toFixed(1)}</span>
                                            <span className="text-gray-500">({provider.totalReviews})</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                                        <MapPin className="w-3 h-3" />
                                        {provider.zone || 'Buenos Aires'}
                                    </div>
                                </div>
                          </div>

                          <div className="flex items-center gap-4 w-full md:w-auto mt-2 md:mt-0">
                                <button 
                                    onClick={(e) => handleRequestClick(e, provider.id)}
                                    className="flex-1 md:flex-none btn-primary py-2 px-6 text-sm font-bold shadow-lg shadow-primary-500/10"
                                >
                                    Solicitar
                                </button>
                                <div className={`p-2 rounded-full bg-gray-700 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                </div>
                          </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                          {isExpanded && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                              >
                                  <div className="p-6 pt-0 border-t border-gray-700/50 bg-gray-900/30">
                                      <div className="flex flex-col lg:flex-row gap-8 mt-6">
                                          {/* Left: Bio & Attributes */}
                                          <div className="flex-1 space-y-6">
                                              <div>
                                                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Sobre mí</h4>
                                                  <p className="text-gray-300 leading-relaxed">{provider.bio || 'Sin biografía disponible.'}</p>
                                              </div>
                                              
                                              <div className="flex flex-wrap gap-3">
                                                  {provider.yearsExperience && (
                                                       <span className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 flex items-center gap-2">
                                                           <Briefcase className="w-4 h-4 text-primary-400" />
                                                           {provider.yearsExperience} años exp.
                                                       </span>
                                                  )}
                                                  {provider.isTeam && (
                                                       <span className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 flex items-center gap-2">
                                                           <Users className="w-4 h-4 text-primary-400" />
                                                           Equipo ({provider.teamSize})
                                                       </span>
                                                  )}
                                                  {provider.vehicles && (
                                                       <span className="px-3 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300 border border-gray-700 flex items-center gap-2">
                                                           <Truck className="w-4 h-4 text-primary-400" />
                                                           Vehículo propio
                                                       </span>
                                                  )}
                                              </div>

                                              <div>
                                                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Especialidades</h4>
                                                  <div className="flex flex-wrap gap-2">
                                                      {provider.trades.map(t => (
                                                          <span key={t} className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 border border-primary-500/20 text-sm font-medium">
                                                              {t}
                                                          </span>
                                                      ))}
                                                  </div>
                                              </div>
                                          </div>

                                          {/* Right: Catalog & Reviews */}
                                          <div className="flex-1 space-y-6">
                                             {/* Services Catalog */}
                                             <div>
                                                 <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                     <Sparkles className="w-4 h-4" />
                                                     Catálogo de Servicios
                                                 </h4>
                                                 {!provider.services ? (
                                                     <div className="flex gap-2 text-gray-500 text-sm py-4"><Loader2 className="w-4 h-4 animate-spin"/> Cargando servicios...</div>
                                                 ) : provider.services.length === 0 ? (
                                                     <p className="text-gray-500 italic text-sm">Este profesional no tiene servicios publicados.</p>
                                                 ) : (
                                                     <div className="space-y-3">
                                                         {provider.services.map(service => (
                                                             <div key={service.id} className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-center group hover:border-gray-600">
                                                                 <div>
                                                                     <h5 className="font-bold text-white text-sm">{service.title}</h5>
                                                                     <p className="text-xs text-gray-500">{service.category}</p>
                                                                 </div>
                                                                 {/* Just display, interaction is generic request */}
                                                                 <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-primary-400" />
                                                             </div>
                                                         ))}
                                                     </div>
                                                 )}
                                             </div>

                                             {/* Recent Reviews */}
                                             <div>
                                                 <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                                     <MessageSquare className="w-4 h-4" />
                                                     Reseñas Recientes
                                                 </h4>
                                                 {!provider.reviewsReceived ? (
                                                      <div className="flex gap-2 text-gray-500 text-sm py-4"><Loader2 className="w-4 h-4 animate-spin"/> Cargando reseñas...</div>
                                                 ) : provider.reviewsReceived.length === 0 ? (
                                                      <p className="text-gray-500 italic text-sm">Sin reseñas aún.</p>
                                                 ) : (
                                                     <div className="space-y-3">
                                                         {provider.reviewsReceived.slice(0, 3).map(review => (
                                                             <div key={review.id} className="bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                                                 <div className="flex justify-between items-start mb-1">
                                                                     <span className="font-bold text-gray-300 text-xs">{review.author.firstName}</span>
                                                                     <div className="flex">{renderStars(review.rating)}</div>
                                                                 </div>
                                                                 {review.comment && (
                                                                     <p className="text-xs text-gray-400 italic">"{review.comment}"</p>
                                                                 )}
                                                             </div>
                                                         ))}
                                                     </div>
                                                 )}
                                             </div>
                                          </div>
                                      </div>
                                      
                                      <div className="mt-8 pt-4 border-t border-gray-700 flex justify-end">
                                          <button 
                                            onClick={(e) => handleRequestClick(e, provider.id)}
                                            className="w-full sm:w-auto btn-primary py-3 px-8 font-bold text-base shadow-lg shadow-primary-500/20"
                                          >
                                              Contactar Profesional
                                          </button>
                                      </div>
                                  </div>
                              </motion.div>
                          )}
                      </AnimatePresence>
                  </motion.div>
              );
          })}
      </div>

      )}

       {/* Request Modal */}
       {selectedProviderId && (
        <RequestModal 
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          targetProviderId={selectedProviderId}
        />
      )}
    </div>
  );
}
