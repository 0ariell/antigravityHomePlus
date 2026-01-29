import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Clock, 
    AlertCircle, 
    Loader2, 
    Zap, 
    Calendar,
    ChevronDown,
    ChevronUp,
    User,
    MessageSquare,
    ExternalLink,
    Briefcase
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { httpClient } from '../../infra/http';
import { BOOKING_STATUS } from '../../app/constants/domain';


interface Booking {
  id: string;
  status: string;
  description: string;
  diagnosis?: any;
  extraInfo?: string;
  images: string[];
  createdAt: string;
  service?: { title: string };
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface Quote {
  id: string;
  price: number;
  description: string;
  estimatedDate?: string;
  isAsap: boolean;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating?: number;
  };
}

function CompactRequestCard({ req, onExpand, isExpanded, quotes, loadingQuotes, onAcceptQuote }: { 
  req: ServiceRequest, 
  onExpand: (id: string) => void, 
  isExpanded: boolean,
  quotes: Quote[],
  loadingQuotes: boolean,
  onAcceptQuote: (id: string) => void
}) {
  const [expandedQuoteId, setExpandedQuoteId] = useState<string | null>(null);

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-colors">
      <div className="p-4 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
             <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-[10px] font-bold rounded-full uppercase tracking-wider border border-primary-500/20">
               {req.category}
             </span>
             <span className="text-[10px] text-gray-500 flex items-center gap-1">
               <Clock className="w-3 h-3" />
               {new Date(req.createdAt).toLocaleDateString()}
             </span>
          </div>
          <h3 className="text-sm font-bold text-white truncate">{req.title}</h3>
          <p className="text-xs text-gray-500 truncate mt-0.5">{req.description}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-tight">Presupuestos</span>
            <span className="text-sm font-black text-primary-500">{req._count?.quotes || 0}</span>
          </div>
          <button 
            onClick={() => onExpand(req.id)}
            className={`p-2 rounded-xl border transition-all ${isExpanded ? 'bg-primary-500 border-primary-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800 bg-black/20"
          >
            <div className="p-4 space-y-5">
              
              {/* Diagnosis Summary (NEW) */}
              {req.diagnosis && (
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-widest pl-1">Detalle del Diagnóstico</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
                      {req.diagnosis.answers?.map((ans: any, idx: number) => (
                        <div key={idx} className="space-y-0.5">
                           <p className="text-[10px] text-gray-500 font-medium">{ans.question}</p>
                           <p className="text-[11px] text-white font-bold">{ans.answer}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Extra Info (NEW) */}
              {req.extraInfo && (
                <div className="space-y-1.5">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Información Adicional</h4>
                   <p className="text-xs text-gray-300 leading-relaxed italic bg-gray-900/40 p-4 rounded-2xl border border-gray-800/50">
                     "{req.extraInfo}"
                   </p>
                </div>
              )}

              {/* Images (NEW - if any) */}
              {req.images && req.images.length > 0 && (
                <div className="space-y-2">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Imágenes Adjuntas</h4>
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {req.images.map((img, idx) => (
                        <div key={idx} className="w-20 h-20 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shrink-0">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                   </div>
                </div>
              )}

              {/* Quotes Section */}
              <div className="space-y-3 pt-4 border-t border-gray-800/50">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Presupuestos Recibidos</h4>
                {loadingQuotes ? (
                  <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-primary-500" /></div>
                ) : quotes.length === 0 ? (
                  <p className="text-xs text-center text-gray-600 py-2">No hay presupuestos aún.</p>
                ) : (
                  <div className="space-y-2">
                    {quotes.map(quote => (
                      <div key={quote.id} className="space-y-2">
                        <div className="flex items-center justify-between bg-gray-800/80 p-3 rounded-xl border border-gray-700">
                          <div className="flex items-center gap-3 flex-1">
                             <div className="w-8 h-8 rounded-full bg-gray-700 overflow-hidden shrink-0">
                               {quote.provider.avatarUrl ? <img src={quote.provider.avatarUrl} className="w-full h-full object-cover" /> : <User className="w-4 h-4 m-2 text-gray-500" />}
                             </div>
                             <div className="min-w-0">
                               <p className="text-xs font-bold text-white truncate">{quote.provider.firstName} {quote.provider.lastName}</p>
                               <div className="flex items-center gap-2">
                                  <p className="text-[10px] text-green-400 font-bold">${quote.price.toLocaleString()}</p>
                                  {quote.isAsap ? (
                                    <span className="text-[8px] bg-primary-500/20 text-primary-400 px-1.5 py-0.5 rounded-full font-black border border-primary-500/20 flex items-center gap-0.5">
                                      <Zap className="w-2 h-2" /> YA MISMO
                                    </span>
                                  ) : quote.estimatedDate && (
                                    <span className="text-[8px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full font-bold border border-gray-700 flex items-center gap-0.5">
                                      <Calendar className="w-2 h-2" /> {new Date(quote.estimatedDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                    </span>
                                  )}
                               </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setExpandedQuoteId(expandedQuoteId === quote.id ? null : quote.id)}
                              className={`text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors border ${expandedQuoteId === quote.id ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-900/50 border-gray-700 text-gray-400 hover:text-white'}`}
                            >
                              {expandedQuoteId === quote.id ? 'Ocultar' : 'Ver Propuesta'}
                            </button>
                            <button 
                              onClick={() => onAcceptQuote(quote.id)}
                              className="text-[10px] font-bold bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20"
                            >
                              Aceptar
                            </button>
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {expandedQuoteId === quote.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="px-4 py-3 bg-primary-500/5 border border-primary-500/10 rounded-xl"
                            >
                              <p className="text-xs text-gray-300 leading-relaxed italic">
                                "{quote.description || 'Sin descripción adicional.'}"
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CompactBookingCard({ booking, navigate }: { booking: Booking, navigate: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColors: any = {
    [BOOKING_STATUS.PENDING]: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    [BOOKING_STATUS.ACCEPTED]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    [BOOKING_STATUS.IN_PROGRESS]: 'bg-green-500/10 text-green-500 border-green-500/20',
    [BOOKING_STATUS.COMPLETED]: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden hover:border-primary-500/30 transition-colors">
      <div className="card p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center border border-gray-700 shrink-0">
            {booking.provider.avatarUrl ? (
              <img src={booking.provider.avatarUrl} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <User className="w-6 h-6 text-gray-500" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{booking.service?.title || 'Servicio Directo'}</h3>
            <p className="text-xs text-gray-400">Con {booking.provider.firstName} {booking.provider.lastName}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-tighter ${statusColors[booking.status] || 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                {booking.status}
              </span>
              <span className="text-[10px] text-gray-600">{new Date(booking.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/chat', { state: { bookingId: booking.id } })}
            className="p-2.5 bg-gray-800 text-gray-400 rounded-xl hover:text-white hover:bg-gray-700 transition-colors"
            title="Ir al Chat"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className={`p-2.5 rounded-xl border transition-all ${isExpanded ? 'bg-primary-500 border-primary-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-800 bg-black/20"
          >
            <div className="p-5 space-y-5">
              
              {/* Diagnosis Summary (NEW) */}
              {booking.diagnosis && (
                <div className="space-y-3">
                   <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-widest pl-1">Diagnóstico</h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-900/80 p-4 rounded-2xl border border-gray-800">
                      {(booking.diagnosis as any).answers?.map((ans: any, idx: number) => (
                        <div key={idx} className="space-y-0.5">
                           <p className="text-[10px] text-gray-500 font-medium">{ans.question}</p>
                           <p className="text-[11px] text-white font-bold">{ans.answer}</p>
                        </div>
                      ))}
                   </div>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest pl-1">Descripción</h4>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap bg-gray-900/40 p-4 rounded-2xl border border-gray-800/50">
                  {booking.description}
                </p>
              </div>

              {booking.extraInfo && (
                <div className="space-y-1.5">
                   <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Info Extra</h4>
                   <p className="text-xs text-gray-300 leading-relaxed italic bg-gray-900/40 p-4 rounded-2xl border border-gray-800/50">
                     "{booking.extraInfo}"
                   </p>
                </div>
              )}

              {booking.images && booking.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Imágenes Adjuntas</h4>
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {booking.images.map((img, idx) => (
                      <div key={idx} className="w-20 h-20 rounded-xl bg-gray-800 border border-gray-700 overflow-hidden shrink-0">
                        <img src={img} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <button 
                   onClick={() => navigate(`/my-jobs`)}
                   className="flex items-center gap-2 text-[10px] font-bold text-primary-400 hover:text-primary-300 transition-colors"
                >
                  Ver en mis reservas <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentQuotes, setCurrentQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [reqs, booksRes] = await Promise.all([
        requestsService.getMyRequests(),
        httpClient.get('/bookings/my-bookings')
      ]);
      setRequests(reqs);
      setBookings(booksRes.data || []);
    } catch (error) {
      console.error('Error loading my solicitudes', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = async (requestId: string) => {
    if (expandedId === requestId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(requestId);
    setLoadingQuotes(true);
    try {
      const res = await httpClient.get(`/quotes/request/${requestId}`);
      setCurrentQuotes(res.data);
    } catch (error) {
      console.error('Error loading quotes', error);
      setCurrentQuotes([]);
    } finally {
      setLoadingQuotes(false);
    }
  };

  const handleAcceptQuote = async (quoteId: string) => {
    if(!confirm('¿Estás seguro de aceptar este presupuesto?')) return;
    try {
      await httpClient.patch(`/quotes/${quoteId}/accept`);
      loadAllData(); // Refresh to move to Direct Requests
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al aceptar');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-gray-500 font-medium font-mono text-xs uppercase tracking-widest">Sincronizando solicitudes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">
      {/* Page Header */}
      <header className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Mis Solicitudes</h2>
          <p className="text-gray-500 text-sm mt-1">Todas tus gestiones en un solo lugar.</p>
        </div>
        <button 
          onClick={() => navigate('/request-wizard')}
          className="bg-primary-500 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-primary-500/20 hover:scale-105 transition-transform"
        >
          Nueva Solicitud
        </button>
      </header>

      {/* Direct Requests / Confirmed Bookings */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2 text-primary-400">
            <Briefcase className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">Solicitudes Directas</h3>
            <span className="text-[10px] px-1.5 py-0.5 bg-primary-500/20 rounded-lg text-primary-300 font-black">{bookings.length}</span>
         </div>
         
         {bookings.length === 0 ? (
           <div className="p-10 border border-dashed border-gray-800 rounded-2xl text-center bg-gray-900/10">
              <p className="text-gray-600 text-sm italic">No hay solicitudes directas o confirmadas.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {bookings.map(b => (
                <CompactBookingCard key={b.id} booking={b} navigate={navigate} />
              ))}
           </div>
         )}
      </section>

      {/* Public / General Requests */}
      <section className="space-y-4">
         <div className="flex items-center gap-2 px-2 text-gray-500">
            <Clock className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-bold text-white">Otras Solicitudes</h3>
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-800 rounded-lg text-gray-400 font-black">{requests.length}</span>
         </div>

         {requests.length === 0 ? (
           <div className="p-10 border border-dashed border-gray-800 rounded-2xl text-center bg-gray-900/10">
              <p className="text-gray-600 text-sm italic">No tienes otras solicitudes abiertas.</p>
           </div>
         ) : (
           <div className="grid grid-cols-1 gap-3">
              {requests.map(req => (
                <CompactRequestCard 
                  key={req.id} 
                  req={req} 
                  onExpand={handleExpand}
                  isExpanded={expandedId === req.id}
                  quotes={currentQuotes}
                  loadingQuotes={loadingQuotes}
                  onAcceptQuote={handleAcceptQuote}
                />
              ))}
           </div>
         )}
      </section>

      {/* Empty State Final Call */}
      {requests.length === 0 && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 glass rounded-2xl shadow-2xl">
           <AlertCircle className="w-16 h-16 text-gray-600 mb-4" />
           <h3 className="text-xl font-bold text-white mb-2 font-display">Todo bajo control</h3>
           <p className="text-gray-500 text-sm text-center max-w-xs mb-8">No tienes gestiones pendientes en este momento. ¡Buen trabajo!</p>
           <button 
             onClick={() => navigate('/dashboard')}
             className="w-full btn-secondary"
           >
             Volver al Inicio
           </button>
        </div>
      )}
    </div>
  );
}
