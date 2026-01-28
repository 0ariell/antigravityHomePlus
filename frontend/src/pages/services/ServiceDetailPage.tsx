import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, MapPin, Loader2, CheckCircle, Shield, Clock, ChevronRight, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../../app/stores';
import { useServiceDetail } from '../../app/view-models/useServiceDetail';
import { RequestModal } from '../../ui/components/bookings/RequestModal';
import { useState } from 'react';

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { service, providerProfile, isLoading } = useServiceDetail(id);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const handleRequestClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'CLIENT') {
      alert('Solo los clientes pueden solicitar servicios');
      return;
    }
    setShowRequestModal(true);
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
        <p className="text-gray-400 text-lg mb-4">Servicio no encontrado</p>
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
      className="pb-20 bg-gray-900 min-h-screen"
    >
      {/* Hero Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
                  {service.category}
                </span>
                {!service.isActive && (
                  <span className="px-3 py-1 bg-gray-700 text-gray-400 text-xs font-bold rounded-full">
                    No Disponible
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-display leading-tight">
                {service.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-8">
                <div className="flex items-center gap-1.5 bg-gray-700 px-3 py-1.5 rounded-lg">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-white">{service.avgRating.toFixed(1)}</span>
                  <span>({service.totalReviews} reseñas)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  <span>{service.zone}</span>
                </div>
              </div>

              {/* Provider Snippet */}
              <Link to={`/profile/${service.provider.id}`} className="inline-flex items-center gap-4 p-2 pr-6 rounded-full bg-gray-700/50 hover:bg-gray-700 transition-colors border border-gray-600 group">
                <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-primary-400 to-primary-600">
                   {service.provider.avatarUrl ? (
                    <img src={service.provider.avatarUrl} alt={service.provider.firstName} className="w-full h-full object-cover rounded-full border-2 border-gray-800" />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-primary-400 font-bold">
                      {service.provider.firstName[0]}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white group-hover:text-primary-400 transition-colors">
                    {service.provider.firstName} {service.provider.lastName}
                  </span>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-blue-500 fill-blue-500" />
                    Profesional Verificado
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Hero Image */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 bg-gray-800 border border-gray-700">
               {service.images[0] ? (
                 <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center">
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
              <h2 className="text-2xl font-bold text-white mb-4">Sobre el Servicio</h2>
              <div className="prose prose-invert max-w-none text-gray-300">
                <p className="whitespace-pre-wrap leading-relaxed text-lg">{service.description}</p>
              </div>
            </section>

            {/* Gallery */}
            {service.images.length > 1 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">Galería</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {service.images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity bg-gray-800 border border-gray-700">
                      <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Reviews Section */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                Reseñas del Profesional
                <span className="text-sm font-normal text-gray-500 bg-gray-800 px-3 py-1 rounded-full border border-gray-700">
                  {providerProfile?.reviewsReceived?.length || 0}
                </span>
              </h2>
              
              <div className="space-y-6">
                {providerProfile?.reviewsReceived && providerProfile.reviewsReceived.length > 0 ? (
                  providerProfile.reviewsReceived.slice(0, 3).map((review) => (
                    <div key={review.id} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                              {review.author.avatarUrl ? (
                                <img src={review.author.avatarUrl} alt={review.author.firstName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{review.author.firstName[0]}</div>
                              )}
                           </div>
                           <div>
                             <h4 className="font-bold text-white">{review.author.firstName}</h4>
                             <span className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                           </div>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 italic">"{review.comment}"</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-800 rounded-2xl border border-dashed border-gray-700">
                    <p className="text-gray-500">Este profesional aún no tiene reseñas.</p>
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Sticky Sidebar */}
          <div className="lg:col-span-1">
             <div className="sticky top-24 space-y-6">
               <div className="bg-gray-800 rounded-3xl p-6 shadow-none border border-gray-700">
                 <div className="mb-6">
                   <span className="text-lg text-gray-400">Precio estimado</span>
                   <div className="flex items-baseline gap-1 mt-1">
                     <span className="text-4xl font-bold text-white">
                        ${service.priceBase ? service.priceBase.toLocaleString() : 'A convenir'}
                     </span>
                     {service.priceUnit && (
                       <span className="text-gray-500 font-medium">/ {service.priceUnit}</span>
                     )}
                   </div>
                 </div>

                 <div className="space-y-4 mb-8">
                   <div className="flex items-center gap-3 text-sm text-gray-300">
                     <CheckCircle className="w-5 h-5 text-green-500" />
                     <span>Reserva garantizada</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-300">
                     <Clock className="w-5 h-5 text-gray-500" />
                     <span>Respuesta rápida</span>
                   </div>
                   <div className="flex items-center gap-3 text-sm text-gray-300">
                     <Shield className="w-5 h-5 text-blue-500" />
                     <span>Pago seguro</span>
                   </div>
                 </div>

                 <button
                   onClick={handleRequestClick}
                   disabled={!service.isActive}
                   className="w-full btn-primary py-4 text-lg font-bold shadow-lg shadow-primary-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.02] active:scale-[0.98]"
                 >
                   {service.isActive ? 'Solicitar Presupuesto' : 'No Disponible'}
                 </button>
                 
                 <p className="text-xs text-center text-gray-500 mt-4">
                   Recibirás una cotización antes de confirmar la reserva.
                 </p>
               </div>
               
               <div className="bg-gray-800/50 rounded-2xl p-4 flex items-center justify-between border border-gray-700">
                 <div className="flex items-center gap-3">
                   <MessageSquare className="w-5 h-5 text-gray-500" />
                   <div className="flex flex-col">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">¿Dudas?</span>
                      <span className="text-xs text-gray-500">Consulta antes de reservar</span>
                   </div>
                 </div>
                 <button className="text-primary-400 font-bold text-sm hover:underline">Chat</button>
               </div>
             </div>
          </div>

        </div>
      </div>

      <RequestModal 
        isOpen={showRequestModal} 
        onClose={() => setShowRequestModal(false)}
        targetProviderId={service.provider.id} // Sending a DIRECT request
        initialCategory={service.category}
        initialZone={service.zone}
      />
    </motion.div>
  );
}
