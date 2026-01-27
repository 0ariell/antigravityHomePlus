import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  MapPin,
  X,
  Loader2,
  CheckCircle,
  Shield,
  Clock,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';

// Types
interface ServiceDetail {
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
  isActive: boolean;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating: number;
    totalReviews: number;
    bio: string | null;
  };
}

interface PublicProfile {
  reviewsReceived: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    author: {
      firstName: string;
      lastName: string;
      avatarUrl: string | null;
    };
  }>;
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [providerProfile, setProviderProfile] = useState<PublicProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    description: '',
    preferredDate: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadData();
    }
  }, [id]);

  const loadData = async () => {
    try {
      // 1. Load Service
      const serviceRes = await httpClient.get(`/services/${id}`);
      setService(serviceRes.data);

      // 2. Load Provider Profile (for reviews/extra info)
      if (serviceRes.data?.provider?.id) {
        try {
          const profileRes = await httpClient.get(`/auth/users/${serviceRes.data.provider.id}/public-profile`);
          setProviderProfile(profileRes.data);
        } catch (e) {
          console.warn('Could not load provider profile', e);
        }
      }
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsSubmitting(true);
    try {
      await httpClient.post('/bookings', {
        serviceId: service.id,
        description: bookingForm.description,
        preferredDate: bookingForm.preferredDate || null,
        address: bookingForm.address,
        notes: bookingForm.notes || null,
        images: [],
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        navigate('/bookings');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBookingModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'CLIENT') {
      alert('Solo los clientes pueden solicitar servicios');
      return;
    }
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg mb-4">Servicio no encontrado</p>
        <button onClick={() => navigate('/services')} className="btn-secondary">
          Volver a servicios
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }}
      className="pb-20 bg-gray-50 dark:bg-gray-900 min-h-screen"
    >
      {/* Hero Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  {service.category}
                </span>
                {!service.isActive && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs font-bold rounded-full">
                    No Disponible
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 font-display leading-tight">
                {service.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-gray-900 dark:text-white">{service.avgRating.toFixed(1)}</span>
                  <span>({service.totalReviews} reseñas)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{service.zone}</span>
                </div>
              </div>

              {/* Provider Snippet */}
              <Link to={`/profile/${service.provider.id}`} className="inline-flex items-center gap-4 p-2 pr-6 rounded-full bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-600 group">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-primary-400 to-primary-600">
                   {service.provider.avatarUrl ? (
                    <img src={service.provider.avatarUrl} alt={service.provider.firstName} className="w-full h-full object-cover rounded-full border-2 border-white dark:border-gray-800" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-primary-600 font-bold">
                      {service.provider.firstName[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">
                    {service.provider.firstName} {service.provider.lastName}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-500 fill-blue-500" />
                    Profesional Verificado
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500">
               {service.images[0] ? (
                 <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                   <Shield className="w-20 h-20 text-gray-400/50" />
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Sobre el Servicio</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                <p className="whitespace-pre-wrap leading-relaxed text-lg">{service.description}</p>
              </div>
            </section>

            {/* Gallery */}
            {service.images.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Galería</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews (Provider level for now) */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                Reseñas del Profesional
                <span className="text-sm font-normal text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                  {providerProfile?.reviewsReceived?.length || 0}
                </span>
              </h2>
              
              <div className="space-y-6">
                {providerProfile?.reviewsReceived && providerProfile.reviewsReceived.length > 0 ? (
                  providerProfile.reviewsReceived.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                              {review.author.avatarUrl ? (
                                <img src={review.author.avatarUrl} alt={review.author.firstName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{review.author.firstName[0]}</div>
                              )}
                           </div>
                           <div>
                             <h4 className="font-bold text-gray-900 dark:text-white">{review.author.firstName}</h4>
                             <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500">Este profesional aún no tiene reseñas.</p>
                  </div>
                )}
                
                {providerProfile?.reviewsReceived && providerProfile.reviewsReceived.length > 3 && (
                   <Link to={`/profile/${service.provider.id}`} className="block text-center text-primary-600 font-semibold hover:underline mt-4">
                     Ver todas las reseñas
                   </Link>
                )}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
               <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-gray-700">
                 <div className="mb-6">
                   <span className="text-lg text-gray-500 dark:text-gray-400">Precio estimado</span>
                   <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${service.priceBase ? service.priceBase.toLocaleString() : 'A convenir'}
                     </span>
                     {service.priceUnit && (
                       <span className="text-gray-500 font-medium">/ {service.priceUnit}</span>
                     )}
                   </div>
                 </div>

                 <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                     <CheckCircle className="w-5 h-5 text-green-500" />
                     <span>Reserva garantizada</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                     <Clock className="w-5 h-5 text-gray-400" />
                     <span>Respuesta en ~1 hora</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                     <Shield className="w-5 h-5 text-blue-500" />
                     <span>Seguro de satisfacción</span>
                   </div>
                 </div>

                 <button
                   onClick={openBookingModal}
                   disabled={!service.isActive}
                   className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                 >
                   {service.isActive ? 'Solicitar Presupuesto' : 'No Disponible'}
                 </button>
                 
                 <p className="text-xs text-center text-gray-400 mt-4">
                   No se te cobrará nada hasta que aceptes el presupuesto.
                 </p>
               </div>
               
               {/* Contact Card */}
               <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
                 <div className="flex items-center gap-3">
                   <MessageSquare className="w-5 h-5 text-gray-400" />
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">¿Dudas?</span>
                      <span className="text-xs text-gray-500">Consulta antes de reservar</span>
                   </div>
                 </div>
                 <button className="text-primary-600 font-bold text-sm hover:underline">Chat</button>
               </div>
             </div>
          </div>

        </div>
      </div>

      {/* Booking Modal (Preserved functionality, updated style) */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {bookingSuccess ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">¡Solicitud enviada!</h2>
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  {service.provider.firstName} revisará tu pedido y te responderá a la brevedad.
                </p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Solicitar Servicio</h2>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <X className="w-6 h-6 text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      ¿Qué necesitas? *
                    </label>
                    <textarea
                      value={bookingForm.description}
                      onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                      className="input-field min-h-[100px]"
                      rows={4}
                      required
                      placeholder="Describe tu problema con el mayor detalle posible..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        ¿Cuándo?
                      </label>
                      <input
                        type="datetime-local"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        className="input-field"
                      />
                    </div>
                     <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        ¿Dónde? *
                      </label>
                      <input
                        type="text"
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                        className="input-field"
                        required
                        placeholder="Dirección o zona"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      Notas adicionales
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      className="input-field"
                      rows={2}
                      placeholder="Código de acceso, piso, timbre..."
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-primary py-3.5 text-lg font-bold flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Confirmar Solicitud'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="w-full mt-3 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
