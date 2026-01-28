import { useEffect, useState } from 'react';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { quotesService } from '../../services/quotes.service';
import { MapPin, Clock, Loader2, DollarSign, CheckCircle, List, Map as MapIcon, Globe, ArrowRight, Star, Send } from 'lucide-react';
import { MapLeadsView } from '../../components/MapLeadsView';
import { motion, AnimatePresence } from 'framer-motion';

interface MyQuote {
    id: string;
    status: string;
    price: number;
    request: ServiceRequest;
}

export function ProviderLeads() {
  const [activeTab, setActiveTab] = useState<'DIRECT' | 'OPPORTUNITIES' | 'MY_QUOTES'>('DIRECT');
  const [loading, setLoading] = useState(true);
  
  // Data
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [myQuotes, setMyQuotes] = useState<MyQuote[]>([]);
  const [stats, setStats] = useState({ sent: 0, accepted: 0, pendingMoney: 0 });
  
  // Quote Form
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  
  // View options for Opportunities
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
      
      // Calculate Stats
      const accepted = quotesData.filter(q => q.status === 'ACCEPTED').length;
      const pendingMoney = quotesData
          .filter(q => q.status === 'PENDING')
          .reduce((acc, q) => acc + q.price, 0);
      setStats({
          sent: quotesData.length,
          accepted,
          pendingMoney
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
      // For MY_QUOTES we already have quotesData
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
        setActiveTab('MY_QUOTES'); // Switch to sent quotes to show feedback
    } catch (error: any) {
        console.error(error);
        alert(error.response?.data?.message || 'Error al enviar cotización');
    } finally {
      setSendingQuote(false);
    }
  };

  const openQuoteForm = (requestId: string) => {
    setSelectedRequest(requestId);
    setViewMode('list');
  };

  // --- Render Helpers ---

  const renderStats = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center text-blue-400">
                  <Send className="w-5 h-5" />
              </div>
              <div>
                  <p className="text-sm text-gray-400">Presupuestos Enviados</p>
                  <p className="text-xl font-bold text-white">{stats.sent}</p>
              </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-900/30 flex items-center justify-center text-green-400">
                  <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                  <p className="text-sm text-gray-400">Aceptados</p>
                  <p className="text-xl font-bold text-white">{stats.accepted}</p>
              </div>
          </div>
          <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-900/30 flex items-center justify-center text-amber-400">
                  <DollarSign className="w-5 h-5" />
              </div>
              <div>
                  <p className="text-sm text-gray-400">Pendiente de Aprobación</p>
                  <p className="text-xl font-bold text-white">${stats.pendingMoney.toLocaleString()}</p>
              </div>
          </div>
      </div>
  );

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
    <div className="space-y-6 pb-20">
      <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-2xl font-bold text-white">Panel de Oportunidades</h2>
            <p className="text-gray-400">Gestiona tus presupuestos y encuentra nuevos trabajos</p>
        </div>

        {renderStats()}

        <div className="flex bg-gray-800 p-1 rounded-2xl w-full sm:w-fit border border-gray-700 overflow-x-auto">
           {[
               { id: 'DIRECT', label: 'Directas', icon: Star },
               { id: 'OPPORTUNITIES', label: 'Oportunidades', icon: Globe },
               { id: 'MY_QUOTES', label: 'Mis Presupuestos', icon: List }
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
         <div className="flex items-center justify-between bg-gray-800/50 p-3 rounded-2xl border border-gray-700/50">
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
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                
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

            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
