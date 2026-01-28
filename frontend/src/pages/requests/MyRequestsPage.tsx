import { useEffect, useState } from 'react';
import { 
  Clock, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  Loader2, 
  CheckCircle, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../infra/http';

interface Quote {
  id: string;
  price: number;
  description: string;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating: number;
  };
}

export function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Accordion & Quotes State
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentQuotes, setCurrentQuotes] = useState<Quote[]>([]);
  const [loadingQuotes, setLoadingQuotes] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const data = await requestsService.getMyRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error loading my requests', error);
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
    if(!confirm('¿Estás seguro de aceptar este presupuesto? Se creará una reserva confirmada.')) return;
    setActionLoading(quoteId);
    try {
      await httpClient.patch(`/quotes/${quoteId}/accept`);
      // Update local state is complex, simpler to reload or navigate
      navigate('/bookings'); // Redirect to bookings
    } catch (error: any) {
      console.error('Error accepting quote', error);
      alert(error.response?.data?.message || 'Error al aceptar el presupuesto');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Mis Pedidos Abiertos</h2>
          <p className="text-gray-400">Gestiona tus solicitudes y revisa los presupuestos recibidos</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="card p-12 text-center bg-gray-800 border-gray-700">
          <AlertCircle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No tienes pedidos activos</h3>
          <p className="text-gray-400 mb-6">Cuando publiques un problema, aparecerá aquí.</p>
          <button onClick={() => navigate('/services')} className="btn-primary">
            Buscar Servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => (
            <div key={req.id} className="card bg-gray-800 border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
                      {req.category}
                    </span>
                    <h3 className="text-xl font-bold text-white">{req.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">Recibidos</span>
                    <span className="text-xl font-bold text-primary-500">
                      {req._count?.quotes || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    {req.zone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-gray-500" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <p className="text-sm text-gray-400 italic">
                    {req.status === 'OPEN' ? 'Esperando presupuestos...' : 'Cerrado/Completado'}
                  </p>
                  
                  <button 
                    onClick={() => handleExpand(req.id)}
                    className="flex items-center gap-2 text-primary-400 font-bold hover:text-white py-2 px-4 rounded-xl border border-primary-500/30 hover:bg-primary-500/20 transition-all"
                  >
                    {req._count?.quotes ? 'Ver Presupuestos' : 'Ver Detalles'}
                    {expandedId === req.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expandedId === req.id && (
                <div className="bg-gray-900/50 p-6 border-t border-gray-700 animate-fade-in">
                  <h4 className="font-bold text-white mb-4">Detalles del Pedido</h4>
                  <p className="text-gray-300 mb-8 whitespace-pre-wrap leading-relaxed">
                    {req.description}
                  </p>

                  <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Propuestas Recibidas
                  </h4>

                  {loadingQuotes ? (
                     <div className="py-8 flex justify-center">
                        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                     </div>
                  ) : currentQuotes.length === 0 ? (
                    <div className="p-8 text-center bg-gray-800 rounded-2xl border border-dashed border-gray-700 text-gray-500">
                      Aún no has recibido propuestas para este pedido. 
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {currentQuotes.map(quote => (
                          <div key={quote.id} className="p-4 bg-gray-800 rounded-2xl border border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                             <div className="flex items-center gap-3 w-full sm:w-auto">
                                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold overflow-hidden border border-gray-600">
                                   {quote.provider.avatarUrl ? (
                                     <img src={quote.provider.avatarUrl} alt={quote.provider.firstName} className="w-full h-full object-cover" />
                                   ) : quote.provider.firstName[0]}
                                </div>
                                <div>
                                   <p className="font-bold text-white">{quote.provider.firstName} {quote.provider.lastName}</p>
                                   <p className="text-sm text-gray-400 italic line-clamp-1">"{quote.description}"</p>
                                </div>
                             </div>
                             <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t border-gray-700 sm:border-t-0 pt-4 sm:pt-0">
                                <div className="text-center sm:text-right">
                                   <p className="text-xs text-gray-500 uppercase font-bold">Total</p>
                                   <p className="text-xl font-bold text-green-400">${quote.price.toLocaleString()}</p>
                                </div>
                                <button 
                                   onClick={() => handleAcceptQuote(quote.id)}
                                   disabled={!!actionLoading}
                                   className="btn-primary px-6 py-2.5 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                                >
                                   {actionLoading === quote.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                   Aceptar
                                </button>
                             </div>
                          </div>
                       ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
