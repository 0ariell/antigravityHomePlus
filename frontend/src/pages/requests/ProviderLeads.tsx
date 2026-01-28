import { useEffect, useState } from 'react';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { quotesService } from '../../services/quotes.service';
import { httpClient } from '../../infra/http';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Loader2, DollarSign, CheckCircle, List, Map as MapIcon, Globe, ArrowRight, Star, Send, TrendingUp, BarChart, PieChart, Briefcase } from 'lucide-react';
import { MapLeadsView } from '../../components/MapLeadsView';
import { motion, AnimatePresence } from 'framer-motion';

interface MyQuote {
    id: string;
    status: string;
    price: number;
    request: ServiceRequest;
}

interface Booking {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  description: string;
  createdAt: string;
  quotedPrice: number | null;
  client: {
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
  };
   service: {
    title: string;
  } | null;
}

export function ProviderLeads() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'DIRECT' | 'OPPORTUNITIES' | 'MY_QUOTES' | 'JOBS' | 'ANALYTICS'>('DIRECT');
  const [loading, setLoading] = useState(true);
  
  // Data
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [myQuotes, setMyQuotes] = useState<MyQuote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({ sent: 0, accepted: 0, pendingMoney: 0, conversionRate: 0, totalRevenue: 0 });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Quote Form
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  
  // View options
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab, isGlobal]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Always load quotes for stats
      const quotesData = await requestsService.getMyQuotes();
      setMyQuotes(quotesData);

      // Load Bookings if on JOBS tab or for stats
      const bookingsRes = await httpClient.get('/bookings/my-bookings');
      setBookings(bookingsRes.data || []);
      
      // Calculate Stats
      const sent = quotesData.length;
      const accepted = quotesData.filter(q => q.status === 'ACCEPTED').length;
      const pendingMoney = quotesData
          .filter(q => q.status === 'PENDING')
          .reduce((acc, q) => acc + q.price, 0);
      const totalRevenue = quotesData
          .filter(q => q.status === 'ACCEPTED')
          .reduce((acc, q) => acc + q.price, 0);
      
      setStats({
          sent,
          accepted,
          pendingMoney,
          conversionRate: sent > 0 ? Math.round((accepted / sent) * 100) : 0,
          totalRevenue
      });

      // Load main list based on tab
      if (activeTab === 'DIRECT') {
        const data = await requestsService.getDirect();
        setRequests(data);
      } else if (activeTab === 'OPPORTUNITIES') {
        const data = isGlobal 
          ? await requestsService.getAllOpen()
          : await requestsService.getNearbyOpen();
        setRequests(data);
      }
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendQuote = async (requestId: string) => {
    if (!quotePrice) return;
    setSendingQuote(true);
    try {
        await quotesService.create({
            requestId,
            price: parseFloat(quotePrice),
            description: quoteDesc
        });
        alert('¡Presupuesto enviado!');
        setSelectedRequest(null);
        setQuotePrice('');
        setQuoteDesc('');
        loadData(); 
        setActiveTab('MY_QUOTES'); 
    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Error al enviar cotización');
    } finally {
      setSendingQuote(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    setActionLoading(bookingId);
    try {
      await httpClient.patch(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: status as Booking['status'] } : b))
      );
    } catch (error) {
      console.error('Error updating booking:', error);
      alert('Error al actualizar');
    } finally {
      setActionLoading(null);
    }
  };

  const openQuoteForm = (requestId: string) => {
    setSelectedRequest(requestId);
    setViewMode('list');
  };

  // --- Render Helpers ---

  const renderStatsCards = () => (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 flex flex-col justify-between hover:border-gray-600 transition-all">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <Send className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase tracking-wider">Enviados</span>
              </div>
              <div>
                  <p className="text-3xl font-bold text-white font-display">{stats.sent}</p>
              </div>
          </div>
          
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 flex flex-col justify-between hover:border-gray-600 transition-all">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <CheckCircle className="w-4 h-4 text-primary-400" />
                  <span className="text-sm font-medium uppercase tracking-wider">Aceptados</span>
              </div>
              <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-white font-display">{stats.accepted}</p>
                  <span className="text-sm text-green-500 font-bold mb-1">
                    {stats.conversionRate}% Conv.
                  </span>
              </div>
          </div>

          <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 flex flex-col justify-between hover:border-gray-600 transition-all">
              <div className="flex items-center gap-3 mb-2 text-gray-400">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium uppercase tracking-wider">Pendiente</span>
              </div>
              <div>
                  <p className="text-3xl font-bold text-white font-display">${stats.pendingMoney.toLocaleString()}</p>
              </div>
          </div>

           <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50 flex flex-col justify-between hover:border-gray-600 transition-all bg-gradient-to-br from-primary-900/10 to-transparent">
              <div className="flex items-center gap-3 mb-2 text-primary-400">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-bold uppercase tracking-wider">Ingresos</span>
              </div>
              <div>
                  <p className="text-3xl font-bold text-white font-display">${stats.totalRevenue.toLocaleString()}</p>
              </div>
          </div>
      </div>
  );

  const renderAnalytics = () => (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* Revenue Chart (CSS only for now) */}
          <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-gray-400" />
                  Rendimiento Mensual
              </h3>
              <div className="h-48 flex items-end justify-between gap-2 px-2">
                  {[40, 65, 30, 85, 50, 95, 75].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                          <div 
                            className="w-full bg-primary-500/20 rounded-t-lg group-hover:bg-primary-500 transition-colors relative" 
                            style={{ height: `${h}%` }}
                          >
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {h}%
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 font-bold uppercase">Sem {i+1}</span>
                      </div>
                  ))}
              </div>
          </div>

          <div className="space-y-6">
             <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-gray-400" />
                    Resumen de Actividad
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                        <span className="text-gray-400">Tasa de Conversión</span>
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats.conversionRate}%` }} />
                            </div>
                            <span className="text-white font-bold">{stats.conversionRate}%</span>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                        <span className="text-gray-400">Presupuestos Enviados</span>
                        <span className="text-white font-bold">{stats.sent}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-700/30 rounded-xl">
                        <span className="text-gray-400">Ingreso Promedio</span>
                        <span className="text-white font-bold">
                            ${stats.accepted > 0 ? Math.round(stats.totalRevenue / stats.accepted).toLocaleString() : 0}
                        </span>
                    </div>
                </div>
             </div>
          </div>
      </div>
  );

  const renderBookingCard = (booking: Booking) => {
      return (
          <div key={booking.id} className="card p-6 bg-gray-800 border-gray-700 mb-4 animate-fade-in">
              <div className="flex justify-between items-start mb-4">
                 <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl font-bold text-gray-400 border border-gray-600">
                         {booking.client.avatarUrl ? <img src={booking.client.avatarUrl} className="w-full h-full object-cover rounded-full"/> : booking.client.firstName[0]}
                     </div>
                     <div>
                         <h3 className="font-bold text-white text-lg">{booking.service?.title || 'Servicio Personalizado'}</h3>
                         <p className="text-gray-400 text-sm">Cliente: {booking.client.firstName} {booking.client.lastName}</p>
                     </div>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider mb-1 ${
                         booking.status === 'ACCEPTED' ? 'bg-blue-500/20 text-blue-400' :
                         booking.status === 'IN_PROGRESS' ? 'bg-amber-500/20 text-amber-400' :
                         booking.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                         'bg-gray-700 text-gray-400'
                     }`}>
                         {booking.status}
                     </span>
                     <span className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                 </div>
              </div>

              <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 mb-4 flex justify-between items-center">
                  <p className="text-gray-300 text-sm">{booking.description}</p>
                  <p className="text-xl font-bold text-white ml-6">${booking.quotedPrice}</p>
              </div>

              <div className="flex gap-3 justify-end border-t border-gray-700 pt-4">
                  <button onClick={() => navigate('/chat', { state: { bookingId: booking.id } })} className="btn-secondary text-sm py-2">
                      Mensaje
                  </button>

                  {booking.status === 'PENDING' && (
                      <>
                        <button 
                            onClick={() => updateBookingStatus(booking.id, 'ACCEPTED')} 
                            className="btn-primary text-sm py-2 bg-green-600 hover:bg-green-700 border-none"
                            disabled={actionLoading === booking.id}
                        >
                            {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Aceptar'}
                        </button>
                        <button 
                            onClick={() => updateBookingStatus(booking.id, 'REJECTED')} 
                            className="btn-secondary text-sm py-2 bg-red-900/20 text-red-400 hover:bg-red-900/30 border-none"
                            disabled={actionLoading === booking.id}
                        >
                            Rechazar
                        </button>
                      </>
                  )}

                  {booking.status === 'ACCEPTED' && (
                      <button 
                        onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                        className="btn-primary text-sm py-2"
                        disabled={actionLoading === booking.id}
                      >
                         {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Iniciar Trabajo'}
                      </button>
                  )}

                  {booking.status === 'IN_PROGRESS' && (
                      <button 
                        onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                        className="btn-primary text-sm py-2 bg-green-600 hover:bg-green-700 border-none"
                        disabled={actionLoading === booking.id}
                      >
                          {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Marcar Completado'}
                      </button>
                  )}
              </div>
          </div>
      );
  };

  const renderRequestCard = (req: ServiceRequest, isDirect: boolean = false) => {
      const isSelected = selectedRequest === req.id;
      return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={req.id} 
            className={`card p-6 transition-all border mb-4 ${
                isSelected 
                    ? 'ring-2 ring-primary-500 bg-gray-800 border-primary-500' 
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
            }`}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full uppercase tracking-wider">
                        {req.category}
                    </span>
                    {isDirect && (
                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" />
                            Directa
                        </span>
                    )}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight mb-2">{req.title}</h3>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1.5 font-medium">
                            <MapPin className="w-4 h-4 text-primary-500" />
                            {req.zone}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                            <Clock className="w-4 h-4 text-gray-500" />
                            {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            <p className="text-gray-300 mb-6 bg-gray-900/50 p-4 rounded-xl leading-relaxed border border-gray-700/50">
                {req.description}
            </p>

            {!isSelected ? (
                    <button 
                    onClick={() => openQuoteForm(req.id)}
                    className="w-full btn-primary py-3 font-bold shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group"
                    >
                    Enviar Presupuesto
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
            ) : (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-6 border-t border-gray-700"
                >
                    <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary-500" />
                        Tu propuesta
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Precio ($)</label>
                            <input 
                                type="number" 
                                value={quotePrice}
                                onChange={e => setQuotePrice(e.target.value)}
                                className="input-field"
                                placeholder="0.00"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Notas</label>
                            <input 
                                value={quoteDesc}
                                onChange={e => setQuoteDesc(e.target.value)}
                                className="input-field"
                                placeholder="Detalles..."
                            />
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedRequest(null)} className="btn-secondary flex-1">Cancelar</button>
                        <button 
                            onClick={() => handleSendQuote(req.id)}
                            disabled={sendingQuote || !quotePrice}
                            className="btn-primary flex-1 flex justify-center items-center gap-2"
                        >
                            {sendingQuote ? <Loader2 className="animate-spin" /> : 'Enviar'}
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
      );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-3xl font-bold text-white font-display">Panel Profesional</h2>
            <p className="text-gray-400 text-lg">Gestiona tu negocio y encuentra nuevas oportunidades.</p>
        </div>

        {renderStatsCards()}

        <div className="flex bg-gray-800 p-1 rounded-2xl w-full sm:w-fit border border-gray-700 overflow-x-auto">
           {[
               { id: 'DIRECT', label: 'Mis Solicitudes', icon: Star },
               { id: 'OPPORTUNITIES', label: 'Oportunidades', icon: Globe },
               { id: 'MY_QUOTES', label: 'Historial', icon: List },
               { id: 'JOBS', label: 'Trabajos', icon: Briefcase },
               { id: 'ANALYTICS', label: 'Analíticas', icon: BarChart },
           ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                   activeTab === tab.id 
                     ? 'bg-primary-500 text-white shadow-lg' 
                     : 'text-gray-400 hover:text-white hover:bg-gray-700'
                 }`}
               >
                 <tab.icon className="w-4 h-4" />
                 {tab.label}
               </button>
           ))}
        </div>
      </div>

       {/* Filters (Opportunities only) */}
       {activeTab === 'OPPORTUNITIES' && (
         <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50 animate-fade-in">
            <div className="flex gap-2">
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}><List className="w-4 h-4"/></button>
                 <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-gray-700 text-white' : 'text-gray-500'}`}><MapIcon className="w-4 h-4"/></button>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs text-gray-400">Búsqueda Global</span>
               <button 
                 onClick={() => setIsGlobal(!isGlobal)}
                 className={`w-10 h-5 rounded-full relative transition-colors ${isGlobal ? 'bg-primary-500' : 'bg-gray-700'}`}
               >
                 <span className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${isGlobal ? 'translate-x-5' : ''}`} />
               </button>
            </div>
         </div>
       )}

      <AnimatePresence mode="wait">
        {loading ? (
           <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
        ) : (
            <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
            >
                
                {/* DIRECT & OPPORTUNITIES VIEW */}
                {(activeTab === 'DIRECT' || activeTab === 'OPPORTUNITIES') && (
                    viewMode === 'map' && activeTab === 'OPPORTUNITIES' ? (
                        <MapLeadsView requests={requests} onQuote={openQuoteForm} />
                    ) : requests.length > 0 ? (
                        requests.map(req => renderRequestCard(req, activeTab === 'DIRECT'))
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                            No hay solicitudes disponibles en esta sección.
                        </div>
                    )
                )}

                {/* MY QUOTES VIEW */}
                {activeTab === 'MY_QUOTES' && (
                    myQuotes.length > 0 ? (
                        <div className="grid gap-4">
                            {myQuotes.map(quote => (
                                <div key={quote.id} className="card p-5 bg-gray-800 border border-gray-700 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                quote.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-400' :
                                                quote.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-amber-500/20 text-amber-400'
                                            }`}>
                                                {quote.status === 'ACCEPTED' ? 'Aceptado' : quote.status === 'PENDING' ? 'Pendiente' : 'Rechazado'}
                                            </span>
                                            <span className="text-gray-400 text-sm">{new Date(quote.request.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <h3 className="font-bold text-white text-lg">{quote.request.title}</h3>
                                        <p className="text-gray-400 text-sm">{quote.request.zone} • {quote.request.category}</p>
                                    </div>
                                    <div className="flex flex-col items-end justify-center min-w-[100px]">
                                        <p className="text-2xl font-bold text-white">${quote.price}</p>
                                        <p className="text-xs text-gray-500 uppercase">Cotizado</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                            Aún no has enviado presupuestos.
                        </div>
                    )
                )}

                {/* JOBS VIEW */}
                {activeTab === 'JOBS' && (
                    bookings.length > 0 ? (
                        <div>
                            {bookings.map(booking => renderBookingCard(booking))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-800/30 rounded-2xl border border-gray-700 border-dashed">
                            <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            No tienes trabajos activos o pendientes.
                        </div>
                    )
                )}

                {/* ANALYTICS VIEW */}
                {activeTab === 'ANALYTICS' && renderAnalytics()}

            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
