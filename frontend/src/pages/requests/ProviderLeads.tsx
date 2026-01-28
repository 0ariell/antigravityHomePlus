import { useEffect, useState } from 'react';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { quotesService } from '../../services/quotes.service';
import { MapPin, Clock, Loader2, DollarSign, CheckCircle, List, Map as MapIcon, Globe, ArrowRight, Star } from 'lucide-react';
import { MapLeadsView } from '../../components/MapLeadsView';
import { motion, AnimatePresence } from 'framer-motion';

export function ProviderLeads() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'DIRECT' | 'OPPORTUNITIES'>('DIRECT');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  
  // Quote Form
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  
  // View options for Opportunities
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [activeTab, isGlobal]);

  const loadLeads = async () => {
    setLoading(true);
    setRequests([]);
    try {
      let data: ServiceRequest[] = [];
      if (activeTab === 'DIRECT') {
        data = await requestsService.getDirect();
      } else {
        data = isGlobal 
          ? await requestsService.getAllOpen()
          : await requestsService.getNearbyOpen();
      }
      setRequests(data);
    } catch (error) {
      console.error('Error loading leads', error);
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
        loadLeads(); // Reload to update status
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Tabs */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <div>
             <h2 className="text-2xl font-bold text-white">Panel de Solicitudes</h2>
             <p className="text-gray-400">Gestiona tus oportunidades de trabajo</p>
           </div>
        </div>

        <div className="flex p-1 bg-gray-800 rounded-2xl w-full sm:w-fit border border-gray-700">
           <button
             onClick={() => setActiveTab('DIRECT')}
             className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
               activeTab === 'DIRECT' 
                 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                 : 'text-gray-400 hover:text-white hover:bg-gray-700'
             }`}
           >
             <Star className="w-4 h-4" />
             Solicitudes Directas
           </button>
           <button
             onClick={() => setActiveTab('OPPORTUNITIES')}
             className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
               activeTab === 'OPPORTUNITIES' 
                 ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25' 
                 : 'text-gray-400 hover:text-white hover:bg-gray-700'
             }`}
           >
             <Globe className="w-4 h-4" />
             Oportunidades
           </button>
        </div>
      </div>

      {/* Filters (Only for Opportunities) */}
      {activeTab === 'OPPORTUNITIES' && (
         <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
            <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-xl border border-gray-700">
              <button 
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'list' 
                    ? 'bg-gray-700 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
                Lista
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  viewMode === 'map' 
                    ? 'bg-gray-700 text-white shadow-sm' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Mapa
              </button>
            </div>

            <div className="flex items-center gap-3">
               <span className="text-sm text-gray-400">¿No encuentras nada cerca?</span>
               <button 
                 onClick={() => setIsGlobal(!isGlobal)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                   isGlobal ? 'bg-primary-500' : 'bg-gray-700'
                 }`}
               >
                 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                   isGlobal ? 'translate-x-6' : 'translate-x-1'
                 }`} />
               </button>
               <span className="text-xs font-bold text-white uppercase tracking-wider">Modo Global</span>
            </div>
         </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
             className="flex justify-center p-20"
          >
            <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
          </motion.div>
        ) : activeTab === 'OPPORTUNITIES' && viewMode === 'map' ? (
           <MapLeadsView requests={requests} onQuote={openQuoteForm} />
        ) : requests.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center p-12 bg-gray-800 rounded-3xl border border-gray-700 shadow-xl"
          >
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'DIRECT' ? (
                 <Star className="w-10 h-10 text-gray-500" />
              ) : (
                 <Globe className="w-10 h-10 text-gray-500" />
              )}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
               {activeTab === 'DIRECT' ? 'Sin solicitudes directas' : 'No hay oportunidades disponibles'}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {activeTab === 'DIRECT' 
                ? 'Cuando un cliente te elija específicamente desde tu perfil, aparecerá aquí.' 
                : isGlobal 
                  ? 'No hay solicitudes abiertas en la plataforma en este momento.' 
                  : 'Prueba activando la "Búsqueda Global" para ver solicitudes de otras zonas.'}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requests.map(req => {
              const isQuoted = req.quotes && req.quotes.length > 0;
              const isSelected = selectedRequest === req.id;

              return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={req.id} 
                    id={req.id} 
                    className={`card p-6 transition-all border ${
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
                                {activeTab === 'DIRECT' && (
                                   <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                                      <Star className="w-3 h-3 fill-current" />
                                      Exclusivo para ti
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
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-gray-700 overflow-hidden">
                                        {req.client?.avatarUrl ? (
                                           <img src={req.client.avatarUrl} className="w-full h-full object-cover" />
                                        ) : (
                                           <div className="w-full h-full flex items-center justify-center text-xs font-bold">{req.client?.firstName?.[0]}</div>
                                        )}
                                     </div>
                                     <span>{req.client?.firstName || 'Usuario'}</span>
                                  </div>
                              </div>
                          </div>
                      </div>

                      <div className="text-gray-300 mb-6 bg-gray-900/50 p-4 rounded-xl leading-relaxed border border-gray-700/50">
                          <p className="whitespace-pre-wrap">{req.description}</p>
                      </div>

                      {isQuoted ? (
                          <div className="flex items-center justify-center gap-2 text-green-400 font-bold bg-green-500/10 p-4 rounded-xl border border-green-500/20">
                              <CheckCircle className="w-5 h-5" />
                              Ya enviaste una cotización
                          </div>
                      ) : (
                          <>
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
                                              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Precio estimado ($)</label>
                                              <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">$</span>
                                                <input 
                                                    type="number" 
                                                    value={quotePrice}
                                                    onChange={e => setQuotePrice(e.target.value)}
                                                    className="input-field pl-8"
                                                    placeholder="0.00"
                                                    autoFocus
                                                />
                                              </div>
                                          </div>
                                          <div>
                                              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 block">Notas / Condiciones</label>
                                              <textarea 
                                                  value={quoteDesc}
                                                  onChange={e => setQuoteDesc(e.target.value)}
                                                  className="input-field resize-none"
                                                  rows={1}
                                                  placeholder="Ej: Incluye materiales..."
                                              />
                                          </div>
                                      </div>
                                      <div className="flex gap-3">
                                          <button 
                                              onClick={() => setSelectedRequest(null)}
                                              className="btn-secondary flex-1 py-3 font-bold"
                                          >
                                              Cancelar
                                          </button>
                                          <button 
                                              onClick={() => handleSendQuote(req.id)}
                                              disabled={sendingQuote || !quotePrice}
                                              className="btn-primary flex-1 flex justify-center items-center gap-2 py-3 font-bold shadow-lg shadow-primary-500/20"
                                          >
                                              {sendingQuote ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                              Confirmar Presupuesto
                                          </button>
                                      </div>
                                  </motion.div>
                              )}
                          </>
                      )}
                  </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
