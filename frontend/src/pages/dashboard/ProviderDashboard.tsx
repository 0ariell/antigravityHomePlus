import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe,
  Briefcase,
  List,
  MapPin, 
  Loader2, 
  Calendar,
  ChevronRight,
  Map as MapIcon 
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { MapLeadsView } from '../../components/MapLeadsView';

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

export function ProviderDashboard() {
  const navigate = useNavigate();
  // Tabs: SEARCH (Opportunities + Direct), SCHEDULE (Jobs), MANAGEMENT (Quotes)
  const [activeTab, setActiveTab] = useState<'SEARCH' | 'SCHEDULE' | 'MANAGEMENT'>('SEARCH');
  const [loading, setLoading] = useState(true);
  
  // Data
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [directRequests, setDirectRequests] = useState<ServiceRequest[]>([]);
  const [myQuotes, setMyQuotes] = useState<MyQuote[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Stats
  const [stats, setStats] = useState({ 
    sent: 0, 
    accepted: 0, 
    pendingMoney: 0, 
    totalRevenue: 0 
  });

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // View options
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeTab, isGlobal]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Parallel Data Fetching
      const [quotesData, bookingsRes] = await Promise.all([
         requestsService.getMyQuotes(),
         httpClient.get('/bookings/my-bookings')
      ]);

      const quotes = quotesData || [];
      const userBookings = bookingsRes.data || [];

      setMyQuotes(quotes);
      setBookings(userBookings);
      
      // Calculate Stats
      const sent = quotes.length;
      const accepted = quotes.filter(q => q.status === 'ACCEPTED').length;
      const pendingMoney = quotes
          .filter(q => q.status === 'PENDING')
          .reduce((acc, q) => acc + q.price, 0);
      const totalRevenue = quotes
          .filter(q => q.status === 'ACCEPTED')
          .reduce((acc, q) => acc + q.price, 0);
      
      setStats({
          sent,
          accepted,
          pendingMoney,
          totalRevenue
      });

      // Load specific tab data
      if (activeTab === 'SEARCH') {
         const [direct, opportunities] = await Promise.all([
            requestsService.getDirect(), // Always fetch direct
            isGlobal ? requestsService.getAllOpen() : requestsService.getNearbyOpen()
         ]);
         setDirectRequests(direct || []);
         setRequests(opportunities || []);
      }
      
    } catch (error) {
      console.error('Error loading data', error);
    } finally {
      setLoading(false);
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

  // --- Render Components ---

  const renderStatsRow = () => (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-center">
             <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Ingresos Totales</span>
             <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-white font-mono tracking-tight">${stats.totalRevenue.toLocaleString()}</span>
             </div>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-center">
             <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Pendiente Cobro</span>
             <span className="text-2xl font-bold text-gray-400 font-mono tracking-tight">${stats.pendingMoney.toLocaleString()}</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-center">
             <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Por Aceptar</span>
             <span className="text-2xl font-bold text-gray-400 font-mono tracking-tight">{stats.sent - stats.accepted}</span>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex flex-col justify-center">
             <span className="text-gray-500 text-[10px] uppercase tracking-widest font-bold mb-1">Trabajos Activos</span>
             <span className="text-2xl font-bold text-primary-500 font-mono tracking-tight">{bookings.filter(b => b.status === 'IN_PROGRESS').length}</span>
          </div>
      </div>
  );

  const renderCompactRequest = (req: ServiceRequest, isDirect = false) => (
    <div key={req.id} className="group bg-gray-900/40 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1.5">
                {isDirect && (
                    <span className="bg-amber-500/10 text-amber-500 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider border border-amber-500/20">
                        Directa
                    </span>
                )}
                <span className="bg-gray-800 text-gray-400 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    {req.category}
                </span>
                <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {req.zone}
                </span>
            </div>
            <h3 className="text-white font-bold text-sm truncate pr-4">{req.title}</h3>
            <p className="text-gray-500 text-xs truncate mt-0.5 max-w-[90%]">{req.description}</p>
        </div>
        <button 
            onClick={() => navigate(`/leads/${req.id}`)}
            className="shrink-0 bg-primary-500/10 text-primary-500 hover:bg-primary-500 hover:text-white border border-primary-500/20 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2"
        >
            Cotizar <ChevronRight className="w-3 h-3" />
        </button>
    </div>
  );

  const renderJobCard = (booking: Booking) => (
      <div key={booking.id} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex flex-col gap-4">
         <div className="flex justify-between items-start">
             <div>
                 <div className="flex items-center gap-2 mb-2">
                     <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                         booking.status === 'IN_PROGRESS' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                         booking.status === 'ACCEPTED' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' :
                         'bg-gray-800 text-gray-500'
                     }`}>
                         {booking.status === 'IN_PROGRESS' ? 'En Curso' : booking.status === 'ACCEPTED' ? 'Agendado' : booking.status}
                     </span>
                     <span className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                 </div>
                 <h3 className="text-white font-bold">{booking.service?.title || 'Servicio'}</h3>
                 <p className="text-xs text-gray-500 mt-1">Cliente: {booking.client.firstName} {booking.client.lastName}</p>
             </div>
             <div className="text-right">
                 <p className="text-lg font-bold text-white font-mono">${booking.quotedPrice?.toLocaleString()}</p>
             </div>
         </div>
         
         <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
             <button 
               onClick={() => navigate('/chat', { state: { bookingId: booking.id } })}
               className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-bold py-2.5 rounded-lg transition-colors"
             >
                 Chat
             </button>
             {booking.status === 'ACCEPTED' && (
                 <button 
                   onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                   className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                   disabled={actionLoading === booking.id}
                 >
                     {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'Iniciar'}
                 </button>
             )}
             {booking.status === 'IN_PROGRESS' && (
                 <button 
                   onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                   className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                   disabled={actionLoading === booking.id}
                 >
                     {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin mx-auto"/> : 'Completar'}
                 </button>
             )}
         </div>
      </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 pt-6">
      
      {/* Header Info */}
      <header>
          <div className="flex items-center gap-2 mb-2 text-primary-500">
             <Briefcase className="w-5 h-5" />
             <span className="text-xs font-black uppercase tracking-widest">Panel Profesional</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tu Negocio</h2>
      </header>

      {renderStatsRow()}

      {/* Tabs */}
      <div className="bg-gray-900/50 p-1 rounded-xl flex gap-1 border border-gray-800 w-full sm:w-fit">
          {[
              { id: 'SEARCH', label: 'Búsqueda', icon: Globe },
              { id: 'SCHEDULE', label: 'Agenda', icon: Calendar },
              { id: 'MANAGEMENT', label: 'Gestión', icon: List }
          ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                    activeTab === tab.id 
                    ? 'bg-gray-800 text-white shadow-sm ring-1 ring-gray-700' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                 <tab.icon className="w-3.5 h-3.5" />
                 {tab.label}
              </button>
          ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
             <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-primary-500 animate-spin" /></div>
        ) : (
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
            >
                {/* --- TAB: SEARCH --- */}
                {activeTab === 'SEARCH' && (
                    <>
                        {/* Filters */}
                        <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center gap-3">
                                <span className="text-xs text-gray-500 font-medium">Radio de búsqueda:</span>
                                <button 
                                    onClick={() => setIsGlobal(!isGlobal)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors border ${
                                        isGlobal 
                                        ? 'bg-primary-500/10 text-primary-400 border-primary-500/30' 
                                        : 'bg-gray-800 text-gray-500 border-gray-700'
                                    }`}
                                >
                                    {isGlobal ? 'Global (Todo el país)' : 'Cercanos (Tu Zona)'}
                                </button>
                             </div>
                             <div className="flex bg-gray-900 rounded-lg p-0.5 border border-gray-800">
                                 <button onClick={() => setViewMode('list')} className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}><List className="w-3.5 h-3.5"/></button>
                                 <button onClick={() => setViewMode('map')} className={`p-1.5 rounded ${viewMode === 'map' ? 'bg-gray-800 text-white' : 'text-gray-500'}`}><MapIcon className="w-3.5 h-3.5"/></button>
                             </div>
                        </div>

                        {viewMode === 'map' ? (
                            <MapLeadsView requests={[...directRequests, ...requests]} onQuote={(id) => navigate(`/leads/${id}`)} />
                        ) : (
                            <div className="space-y-6">
                                {/* Direct Requests First */}
                                {directRequests.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-xs font-black text-amber-500 uppercase tracking-widest pl-1">Solicitudes Directas ({directRequests.length})</h3>
                                        <div className="grid gap-2">
                                            {directRequests.map(req => renderCompactRequest(req, true))}
                                        </div>
                                    </div>
                                )}

                                {/* General Opportunities */}
                                <div className="space-y-3">
                                    <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">
                                        {isGlobal ? 'Todas las Oportunidades' : 'Oportunidades en tu Zona'} ({requests.length})
                                    </h3>
                                    
                                    {requests.length === 0 && directRequests.length === 0 ? (
                                        <div className="text-center py-16 px-4 border border-dashed border-gray-800 rounded-2xl">
                                            <Globe className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                            <p className="text-gray-400 text-sm font-medium">No hay solicitudes disponibles ahora.</p>
                                            <p className="text-gray-600 text-xs mt-1">Probá ampliando a búsqueda global.</p>
                                        </div>
                                    ) : requests.length === 0 ? (
                                        <p className="text-center text-xs text-gray-600 py-8">No hay oportunidades generales, solo directas.</p>
                                    ) : (
                                        <div className="grid gap-2">
                                            {requests.map(req => renderCompactRequest(req))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* --- TAB: SCHEDULE (JOBS) --- */}
                {activeTab === 'SCHEDULE' && (
                    <div className="space-y-6">
                         {bookings.length === 0 ? (
                             <div className="text-center py-16 px-4 bg-gray-900/20 border border-gray-800 rounded-2xl">
                                 <Briefcase className="w-10 h-10 text-gray-700 mx-auto mb-3" />
                                 <p className="text-gray-400 text-sm">Tu agenda está vacía.</p>
                                 <button onClick={() => setActiveTab('SEARCH')} className="text-primary-500 text-xs font-bold mt-2 hover:underline">Buscar trabajos</button>
                             </div>
                         ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 {bookings.map(b => renderJobCard(b))}
                             </div>
                         )}
                    </div>
                )}

                {/* --- TAB: MANAGEMENT (Quotes) --- */}
                {activeTab === 'MANAGEMENT' && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-black text-white uppercase tracking-widest pl-1">Presupuestos Enviados</h3>
                        </div>
                        
                        {myQuotes.length === 0 ? (
                             <div className="text-center py-12 text-gray-500 text-xs">No has enviado presupuestos aún.</div>
                        ) : (
                            <div className="grid gap-3">
                                {myQuotes.map(quote => (
                                    <div key={quote.id} className="bg-gray-900 border border-gray-800 p-4 rounded-xl flex justify-between items-center group hover:border-gray-700 transition-colors">
                                        <div>
                                            <h4 className="text-sm font-bold text-white mb-1">{quote.request.title}</h4>
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded lowercase ${
                                                    quote.status === 'ACCEPTED' ? 'bg-green-500/20 text-green-500' :
                                                    quote.status === 'REJECTED' ? 'bg-red-900/20 text-red-500' :
                                                    'bg-gray-800 text-gray-400'
                                                }`}>
                                                    {quote.status}
                                                </span>
                                                <span className="text-[10px] text-gray-600">{new Date(quote.request.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-gray-300 font-mono">${quote.price.toLocaleString()}</p>
                                            <button 
                                                onClick={() => navigate(`/leads/${quote.request.id}`)}
                                                className="text-[10px] text-primary-500 font-bold hover:underline mt-1"
                                            >
                                                Ver Detalle
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
