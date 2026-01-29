import { 
    MapPin, 
    Loader2, 
    Star, 
    List, 
    Map as MapIcon, 
    Globe, 
    ArrowRight 
} from 'lucide-react';
import { MapLeadsView } from '../../components/MapLeadsView';
import { motion, AnimatePresence } from 'framer-motion';
import { useProviderLeads, type TabType } from './hooks/useProviderLeads';
import type { ServiceRequest } from '../../services/requests.service';

export function ProviderLeads() {
  const {
      activeTab,
      setActiveTab,
      loading,
      requests,
      myQuotes,
      viewMode,
      setViewMode,
      isGlobal,
      setIsGlobal,
      openQuoteForm,
      navigate,
      QUOTE_STATUS
  } = useProviderLeads();
  
  const renderRequestCard = (req: ServiceRequest, isDirect: boolean = false) => {
      return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            key={req.id} 
            className="card p-6 transition-all border mb-4"
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
                    </div>
                </div>
            </div>

            <p className="text-gray-300 mb-6 bg-gray-900/50 p-4 rounded-xl leading-relaxed border border-gray-700/50 truncate">
                {req.description}
            </p>

            <button 
                onClick={() => navigate(`/leads/${req.id}`)}
                className="w-full btn-primary py-3 font-bold shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2 group"
            >
                Ver detalle y cotizar
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
        </motion.div>
      );
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-6">
        <div>
            <h2 className="text-3xl font-bold text-white font-display">Búsqueda de Oportunidades</h2>
            <p className="text-gray-400 text-lg">Encuentra clientes y gestiona tus presupuestos recibidos.</p>
        </div>

        <div className="flex bg-gray-900/50 backdrop-blur-md p-1 rounded-2xl w-full sm:w-fit border border-gray-800 overflow-x-auto">
           {[
               { id: 'DIRECT', label: 'Mis Solicitudes', icon: Star },
               { id: 'OPPORTUNITIES', label: 'Oportunidades', icon: Globe },
               { id: 'MY_QUOTES', label: 'Historial', icon: List },
           ].map(tab => (
               <button
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id as TabType)}
                 className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
                   activeTab === tab.id 
                     ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20' 
                     : 'text-gray-400 hover:text-white hover:bg-white/5'
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
         <div className="flex items-center justify-between bg-gray-900/50 backdrop-blur-sm p-3 rounded-2xl border border-gray-800 animate-fade-in">
            <div className="flex gap-2">
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}><List className="w-4 h-4"/></button>
                 <button onClick={() => setViewMode('map')} className={`p-2 rounded-lg transition-colors ${viewMode === 'map' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-400'}`}><MapIcon className="w-4 h-4"/></button>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs text-gray-400">Búsqueda Global</span>
               <button 
                 onClick={() => setIsGlobal(!isGlobal)}
                 className={`w-10 h-5 rounded-full relative transition-colors ${isGlobal ? 'bg-primary-500 shadow-[0_0_10px_rgba(249,115,22,0.3)]' : 'bg-gray-800'}`}
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
                                <div key={quote.id} className="card p-5 flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                quote.status === QUOTE_STATUS.ACCEPTED ? 'bg-green-500/20 text-green-400' :
                                                quote.status === QUOTE_STATUS.REJECTED ? 'bg-red-500/20 text-red-400' :
                                                'bg-amber-500/20 text-amber-400'
                                            }`}>
                                                {quote.status === QUOTE_STATUS.ACCEPTED ? 'Aceptado' : quote.status === QUOTE_STATUS.PENDING ? 'Pendiente' : 'Rechazado'}
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
