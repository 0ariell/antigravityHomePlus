import { useEffect, useState } from 'react';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { quotesService } from '../../services/quotes.service';
import { MapPin, Clock, Loader2, DollarSign, CheckCircle, List, Map as MapIcon, Globe } from 'lucide-react';
import { MapLeadsView } from '../../components/MapLeadsView';

export function ProviderLeads() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);
  
  // View states
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [isGlobal, setIsGlobal] = useState(false);

  useEffect(() => {
    loadLeads();
  }, [isGlobal]);

  const loadLeads = async () => {
    setLoading(true);
    try {
      const data = isGlobal 
        ? await requestsService.getAllOpen()
        : await requestsService.getNearbyOpen();
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
        loadLeads();
    } catch (error) {
        console.error(error);
        alert('Error al enviar cotización');
    } finally {
        setSendingQuote(false);
    }
  };

  const openQuoteForm = (requestId: string) => {
    setSelectedRequest(requestId);
    setViewMode('list');
    // Scroll to the request might be good but for now simple toggle
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Oportunidades Disponibles</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Encuentra trabajos cerca de ti o explora el mapa</p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl self-start">
          <button 
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'list' 
                ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <List className="w-4 h-4" />
            Lista
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'map' 
                ? 'bg-white dark:bg-gray-700 text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <MapIcon className="w-4 h-4" />
            Mapa
          </button>
        </div>
      </div>

      {/* Global Filter Toggle */}
      <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <Globe className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Búsqueda Global</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ver todas las solicitudes sin importar la zona configurada</p>
          </div>
        </div>
        <button 
          onClick={() => setIsGlobal(!isGlobal)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
            isGlobal ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            isGlobal ? 'translate-x-6' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-20">
          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
        </div>
      ) : viewMode === 'map' ? (
        <MapLeadsView requests={requests} onQuote={openQuoteForm} />
      ) : requests.length === 0 ? (
        <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-gray-300 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay solicitudes</h3>
          <p className="text-gray-500 dark:text-gray-400">
            {isGlobal 
              ? 'No hay solicitudes abiertas en este momento.' 
              : 'No hay solicitudes en tu zona. ¡Prueba activar la Búsqueda Global!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => {
            const isQuoted = req.quotes && req.quotes.length > 0;
            const isSelected = selectedRequest === req.id;

            return (
                <div key={req.id} className={`card p-6 transition-all ${isSelected ? 'ring-2 ring-orange-500 bg-orange-50/30' : 'dark:bg-gray-800 dark:border-gray-700'}`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full mb-2 uppercase tracking-wider">
                                {req.category}
                            </span>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">{req.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-3">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <MapPin className="w-4 h-4 text-orange-500" />
                                    {req.zone}
                                </span>
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {new Date(req.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl leading-relaxed">
                        {req.description}
                    </p>

                    {isQuoted ? (
                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/10 p-3 rounded-xl border border-green-100 dark:border-green-900/20">
                            <CheckCircle className="w-5 h-5" />
                            Ya enviaste una cotización
                        </div>
                    ) : (
                        <>
                            {!isSelected ? (
                                 <button 
                                    onClick={() => setSelectedRequest(req.id)}
                                    className="w-full btn-primary py-3 font-semibold shadow-lg shadow-orange-500/20"
                                 >
                                    Enviar Presupuesto
                                 </button>
                            ) : (
                                <div className="animate-fade-in pt-6 border-t border-gray-100 dark:border-gray-700">
                                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                      <DollarSign className="w-5 h-5 text-orange-500" />
                                      Tu propuesta
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Precio estimado ($)</label>
                                            <div className="relative">
                                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                              <input 
                                                  type="number" 
                                                  value={quotePrice}
                                                  onChange={e => setQuotePrice(e.target.value)}
                                                  className="input-field pl-8 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                  placeholder="0.00"
                                              />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5 block">Notas / Condiciones</label>
                                            <textarea 
                                                value={quoteDesc}
                                                onChange={e => setQuoteDesc(e.target.value)}
                                                className="input-field resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                                rows={1}
                                                placeholder="Ej: Incluye materiales..."
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button 
                                            onClick={() => setSelectedRequest(null)}
                                            className="btn-secondary flex-1 py-3 dark:bg-gray-700 dark:text-white font-semibold"
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            onClick={() => handleSendQuote(req.id)}
                                            disabled={sendingQuote || !quotePrice}
                                            className="btn-primary flex-1 flex justify-center items-center gap-2 py-3 font-semibold shadow-lg shadow-orange-500/20"
                                        >
                                            {sendingQuote ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                            Confirmar Presupuesto
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Missing CheckCircle import, adding simple icon mock or import

