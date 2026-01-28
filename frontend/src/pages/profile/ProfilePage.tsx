
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Star, 
  Calendar, 
  Shield, 
  Award,
  ArrowLeft,
  Loader2,
  Briefcase,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { RequestModal } from '../../ui/components/bookings/RequestModal';

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
}

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'portfolio' | 'reviews'>('about');
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    if (id) {
      loadProfile();
    }
  }, [id]);

  const loadProfile = async () => {
    try {
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
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-4 bg-gray-950">
        <h2 className="text-2xl font-bold text-white mb-2">Perfil no encontrado</h2>
        <button onClick={() => navigate(-1)} className="px-6 py-2 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition">
          Volver
        </button>
      </div>
    );
  }

  const joinDate = new Date(profile.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-950 pb-20 font-sans text-gray-200">
      {/* Immersive Header */}
      <div className="relative h-80 md:h-96 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/60 to-gray-950 z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2669&auto=format&fit=crop')] bg-cover bg-center opacity-40 grayscale" />
        
        {/* Navigation */}
        <div className="absolute top-6 left-4 md:left-8 z-20">
             <button 
              onClick={() => navigate(-1)}
              className="p-3 bg-black/40 backdrop-blur-md text-white rounded-full hover:bg-black/60 transition-all border border-white/10 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Core Info & CTA */}
            <div className="lg:col-span-1 space-y-6">
                {/* Profile Card */}
                <div className="bg-gray-900 rounded-3xl p-6 border border-gray-800 shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className="w-32 h-32 rounded-3xl bg-gray-800 p-1 mb-4 shadow-2xl border-2 border-gray-700">
                             {profile.avatarUrl ? (
                                <img src={profile.avatarUrl} alt={profile.firstName} className="w-full h-full object-cover rounded-2xl" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500 bg-gray-800 rounded-2xl">{profile.firstName[0]}</div>
                             )}
                        </div>
                        
                        <h1 className="text-3xl font-bold text-white mb-1 font-display">{profile.firstName} {profile.lastName}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-primary-500/10 text-primary-400 text-xs font-bold rounded-full border border-primary-500/20 flex items-center gap-1.5">
                                <Shield className="w-3 h-3" /> VERIFICADO
                            </span>
                            <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs font-semibold rounded-full border border-gray-700">
                                {profile.zone || 'AMBA'}
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2 mb-6">
                            {profile.trades.map(t => (
                                <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-800 text-gray-300 border border-gray-700">
                                    {t}
                                </span>
                            ))}
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 gap-4 w-full border-t border-gray-800 pt-6 mb-6">
                             <div className="text-center">
                                 <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xl">
                                     {profile.avgRating.toFixed(1)} <Star className="w-4 h-4 fill-current" />
                                 </div>
                                 <div className="text-xs text-gray-500 uppercase font-medium mt-1">Calificación</div>
                             </div>
                             <div className="text-center border-l border-gray-800">
                                 <div className="font-bold text-xl text-white">{profile.totalReviews}</div>
                                 <div className="text-xs text-gray-500 uppercase font-medium mt-1">Trabajos</div>
                             </div>
                        </div>

                        {/* Main CTA */}
                        <button 
                            onClick={() => setShowRequestModal(true)}
                            className="w-full py-4 bg-gradient-to-r from-primary-600 to-primary-500 rounded-xl font-bold text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            Solicitar Servicio
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Trust Signals Widget */}
                <div className="bg-gray-900/50 rounded-3xl p-6 border border-gray-800/50">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Garantía HomePlus</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-sm text-gray-400">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            <span>Identidad Verificada</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-400">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            <span>Seguro de Responsabilidad</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-gray-400">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                            <span>Soporte 24/7</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Right Column: Detailed Content */}
            <div className="lg:col-span-2">
                <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden min-h-[600px]">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-800">
                        {['about', 'portfolio', 'reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition-all border-b-2 ${
                                    activeTab === tab 
                                    ? 'border-primary-500 text-primary-400 bg-primary-500/5' 
                                    : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                                }`}
                            >
                                {tab === 'about' && 'Perfil'}
                                {tab === 'portfolio' && 'Portafolio'}
                                {tab === 'reviews' && 'Opiniones'}
                            </button>
                        ))}
                    </div>

                    <div className="p-8">
                        {/* About Tab */}
                        {activeTab === 'about' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-4">Sobre mí</h3>
                                    <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap">
                                        {profile.bio || 'Este profesional es un hombre de pocas palabras.'}
                                    </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                     <div className="p-5 rounded-2xl bg-gray-800/50 border border-gray-800 flex items-center gap-4">
                                         <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400">
                                             <Calendar className="w-6 h-6" />
                                         </div>
                                         <div>
                                             <div className="text-sm text-gray-500 font-medium">Desde</div>
                                             <div className="text-white font-bold">{joinDate}</div>
                                         </div>
                                     </div>
                                     <div className="p-5 rounded-2xl bg-gray-800/50 border border-gray-800 flex items-center gap-4">
                                         <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                                             <Award className="w-6 h-6" />
                                         </div>
                                         <div>
                                             <div className="text-sm text-gray-500 font-medium">Nivel</div>
                                             <div className="text-white font-bold">Expert</div>
                                         </div>
                                     </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Portfolio Tab */}
                        {activeTab === 'portfolio' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <div className="flex justify-between items-end mb-6">
                                    <h3 className="text-xl font-bold text-white">Trabajos Realizados</h3>
                                    <span className="text-sm text-gray-500">Historial de proyectos</span>
                                </div>

                                {profile.portfolioUrls && profile.portfolioUrls.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {profile.portfolioUrls.map((url, i) => (
                                            <div key={i} className="group relative aspect-video bg-gray-800 rounded-xl overflow-hidden border border-gray-800 scrollbar-hide">
                                                <img src={url} alt={`Work ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-900 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                                                    <span className="text-white text-sm font-bold">Proyecto #{i+1}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="py-20 text-center border-2 border-dashed border-gray-800 rounded-2xl bg-gray-800/30">
                                        <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-500">Aún no hay trabajos en el portafolio.</p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Reviews Tab */}
                        {activeTab === 'reviews' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                {profile.reviewsReceived && profile.reviewsReceived.length > 0 ? (
                                    profile.reviewsReceived.map(review => (
                                        <div key={review.id} className="p-6 rounded-2xl bg-gray-800/50 border border-gray-800">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-400">
                                                        {review.author.firstName[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold">{review.author.firstName}</h4>
                                                        <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-400 italic">"{review.comment}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center text-gray-500">
                                        Sin opiniones todavía.
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
      </div>
      
      {/* Interaction Modal */}
      {id && (
        <RequestModal 
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          targetProviderId={id}
        />
      )}
    </div>
  );
}
