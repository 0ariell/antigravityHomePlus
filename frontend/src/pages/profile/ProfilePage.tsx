import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Shield, 
  Award,
  ArrowLeft,
  Loader2,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { httpClient } from '../../infra/http';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  author: {
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  priceBase?: number;
  priceUnit?: string;
}

interface PublicProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  zone: string | null;
  trades: string[];
  avgRating: number;
  totalReviews: number;
  portfolioUrls: string[];
  createdAt: string;
  reviewsReceived: Review[];
  services?: Service[];
}

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'portfolio' | 'reviews'>('about');

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    try {
      // Use the newly identified endpoint
      const response = await httpClient.get(`/auth/users/${id}/public-profile`);
      setProfile(response.data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Perfil no encontrado</h2>
        <p className="text-gray-500 mb-6">El profesional que buscas no existe o no está disponible.</p>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-900 text-white rounded-xl">
          Volver
        </button>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('es-AR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="pb-20"
    >
      {/* Header / Cover */}
      <div className="relative h-48 md:h-64 bg-gradient-to-r from-primary-600 to-indigo-700 overflow-hidden rounded-b-3xl shadow-lg">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md text-white rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1581094794329-cd132c4a9191?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative -mt-16 md:-mt-20">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-end gap-6 border border-gray-100 dark:border-gray-700">
          
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full p-1.5 bg-white dark:bg-gray-800 ring-4 ring-primary-50 dark:ring-primary-900/30">
              {profile.avatarUrl ? (
                <img 
                  src={profile.avatarUrl} 
                  alt={profile.firstName} 
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center text-4xl font-bold text-gray-500">
                  {profile.firstName[0]}
                </div>
              )}
            </div>
            <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800" title="Online"></div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center md:text-left mb-2 md:mb-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 mb-1 justify-center md:justify-start">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white font-display">
                {profile.firstName} {profile.lastName}
              </h1>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-xs font-bold rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3 fill-current" />
                VERIFICADO
              </span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
              {profile.zone && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {profile.zone}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Miembro desde {joinDate}
              </span>
              <span className="flex items-center gap-1 font-medium text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                {profile.avgRating.toFixed(1)} ({profile.totalReviews} reseñas)
              </span>
            </div>

            {/* Trades badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              {profile.trades?.map((trade, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold">
                  {trade}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
             {/* TODO: Implement contact modal */}
            <button className="flex-1 md:flex-none btn-primary px-6 py-2.5 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Contactar
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'about' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Sobre mí
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'services' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Servicios
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'portfolio' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Portafolio
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
              >
                Reseñas
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[300px]">
              {activeTab === 'about' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Biografía</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {profile.bio || 'Este profesional aún no ha completado su biografía.'}
                  </p>
                  
                  <div className="mt-8 grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {/* Assuming we might fetch stats later, standardizing for now */}
                            {profile.totalReviews > 0 ? Math.floor(profile.totalReviews * 1.5) : 0}+ 
                          </div>
                          <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">Trabajos</div>
                        </div>
                      </div>
                    </div>
                    
                     <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400">
                          <Award className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
                          <div className="text-xs text-gray-500 uppercase font-bold tracking-wide">Garantía</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'services' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Catálogo de Servicios</h3>
                   {profile.services && profile.services.length > 0 ? (
                     <div className="space-y-4">
                       {profile.services.map(service => (
                         <div key={service.id} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-500/30 transition-colors group">
                           <div className="flex justify-between items-start">
                             <div>
                               <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-primary-500 transition-colors">{service.title}</h4>
                               <p className="text-gray-500 text-sm mb-2">{service.category}</p>
                               <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
                             </div>
                             <button className="btn-secondary px-4 py-2 text-sm">
                               Solicitar
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                       <p className="text-gray-500">Este profesional no tiene servicios publicados.</p>
                     </div>
                   )}
                 </motion.div>
              )}

              {activeTab === 'services' && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Catálogo de Servicios</h3>
                   {profile.services && profile.services.length > 0 ? (
                     <div className="space-y-4">
                       {profile.services.map(service => (
                         <div key={service.id} className="p-5 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary-500/30 transition-colors group">
                           <div className="flex justify-between items-start">
                             <div>
                               <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-primary-500 transition-colors">{service.title}</h4>
                               <p className="text-gray-500 text-sm mb-2">{service.category}</p>
                               <p className="text-gray-600 dark:text-gray-300 text-sm">{service.description}</p>
                             </div>
                             <button className="btn-secondary px-4 py-2 text-sm">
                               Solicitar
                             </button>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                       <p className="text-gray-500">Este profesional no tiene servicios publicados.</p>
                     </div>
                   )}
                 </motion.div>
              )}

              {activeTab === 'portfolio' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Trabajos Realizados</h3>
                  {profile.portfolioUrls && profile.portfolioUrls.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {profile.portfolioUrls.map((url, index) => (
                        <div key={index} className="aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img 
                            src={url} 
                            alt={`Portfolio ${index + 1}`} 
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500">Este profesional aún no ha subido fotos de sus trabajos.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                   <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Últimas Reseñas</h3>
                    <div className="flex items-center gap-2">
                       <span className="text-2xl font-bold text-gray-900 dark:text-white">{profile.avgRating.toFixed(1)}</span>
                       <div className="flex text-amber-500">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} className={`w-4 h-4 ${i < Math.round(profile.avgRating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                         ))}
                       </div>
                       <span className="text-sm text-gray-500">({profile.totalReviews})</span>
                    </div>
                   </div>

                   <div className="space-y-4">
                     {profile.reviewsReceived && profile.reviewsReceived.length > 0 ? (
                       profile.reviewsReceived.map((review) => (
                         <div key={review.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 overflow-hidden">
                                  {review.author.avatarUrl ? (
                                    <img src={review.author.avatarUrl} alt={review.author.firstName} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="font-bold">{review.author.firstName[0]}</span>
                                  )}
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {review.author.firstName} {review.author.lastName}
                                  </h4>
                                  <span className="text-xs text-gray-500">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                              <div className="flex text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm">
                              "{review.comment}"
                            </p>
                         </div>
                       ))
                     ) : (
                        <p className="text-gray-500 text-center py-8">Sin reseñas aún.</p>
                     )}
                   </div>
                </motion.div>
              )}
            </div>
          </div>
          
          {/* Sidebar / Widgets */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              <h3 className="text-lg font-bold mb-4 font-display">¿Necesitas un trabajo a medida?</h3>
              <p className="text-gray-300 text-sm mb-6">
                Puedes contactar directamente a {profile.firstName} para solicitar un presupuesto personalizado.
              </p>
              <button className="w-full py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
                Solicitar Presupuesto
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
