import { useEffect, useState } from 'react';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { quotesService } from '../../services/quotes.service';
import { MapPin, Clock, Loader2, DollarSign, CheckCircle } from 'lucide-react';

export function ProviderLeads() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [quotePrice, setQuotePrice] = useState('');
  const [quoteDesc, setQuoteDesc] = useState('');
  const [sendingQuote, setSendingQuote] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      const data = await requestsService.getNearbyOpen();
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
        alert('Presupuesto enviado!');
        setSelectedRequest(null);
        setQuotePrice('');
        setQuoteDesc('');
        // Refresh? Or strictly remove from list if we only show unquoted?
        loadLeads();
    } catch (error) {
        console.error(error);
        alert('Error al enviar cotización');
    } finally {
        setSendingQuote(false);
    }
  };

  if (loading) return (
      <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
  );

  if (requests.length === 0) return (
      <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No hay solicitudes nuevas</h3>
          <p className="text-gray-500 dark:text-gray-400">Asegúrate de estar "Online" y tener configurada tu zona.</p>
      </div>
  );

  return (
    <div className="space-y-6">
      {requests.map(req => {
        const isQuoted = req.quotes && req.quotes.length > 0;
        const isSelected = selectedRequest === req.id;

        return (
            <div key={req.id} className="card p-6 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-medium rounded-full mb-2">
                            {req.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{req.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {req.zone}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {new Date(req.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                    {req.description}
                </p>

                {isQuoted ? (
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle className="w-5 h-5" />
                        Ya enviaste una cotización
                    </div>
                ) : (
                    <>
                        {!isSelected ? (
                             <button 
                                onClick={() => setSelectedRequest(req.id)}
                                className="w-full btn-primary"
                             >
                                Enviar Presupuesto
                             </button>
                        ) : (
                            <div className="animate-fade-in pt-4 border-t border-gray-100 dark:border-gray-700">
                                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Tu propuesta</h4>
                                <div className="space-y-3 mb-4">
                                    <div>
                                        <label className="text-sm text-gray-700 dark:text-gray-300">Precio estimado ($)</label>
                                        <input 
                                            type="number" 
                                            value={quotePrice}
                                            onChange={e => setQuotePrice(e.target.value)}
                                            className="input-field mt-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-gray-700 dark:text-gray-300">Notas / Condiciones</label>
                                        <textarea 
                                            value={quoteDesc}
                                            onChange={e => setQuoteDesc(e.target.value)}
                                            className="input-field mt-1 resize-none dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            rows={2}
                                            placeholder="Incluye mano de obra y materiales..."
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => setSelectedRequest(null)}
                                        className="btn-secondary flex-1 dark:bg-gray-700 dark:text-white"
                                    >
                                        Cancelar
                                    </button>
                                    <button 
                                        onClick={() => handleSendQuote(req.id)}
                                        disabled={sendingQuote || !quotePrice}
                                        className="btn-primary flex-1 flex justify-center items-center gap-2"
                                    >
                                        {sendingQuote ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
                                        Enviar
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
  );
}

// Missing CheckCircle import, adding simple icon mock or import

