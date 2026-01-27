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

export function MyRequestsPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
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

  const handleAcceptQuote = async (quoteId: string) => {
    setActionLoading(quoteId);
    try {
      await httpClient.post(`/quotes/${quoteId}/accept`);
      alert('¡Presupuesto aceptado! Ya puedes coordinar con el profesional en la sección de Reservas.');
      navigate('/bookings');
    } catch (error) {
      console.error('Error accepting quote', error);
      alert('Error al aceptar el presupuesto');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-20">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Pedidos Abiertos</h2>
          <p className="text-gray-500 dark:text-gray-400">Gestiona tus solicitudes y revisa los presupuestos recibidos</p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="card p-12 text-center bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No tienes pedidos activos</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Cuando publiques un problema, aparecerá aquí.</p>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Pedir un Presupuesto
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {requests.map(req => (
            <div key={req.id} className="card bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full mb-2 uppercase tracking-wider">
                      {req.category}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{req.title}</h3>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 block mb-1">Recibidos</span>
                    <span className="text-xl font-bold text-orange-500">
                      {req._count?.quotes || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    {req.zone}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    {req.status === 'OPEN' ? 'Esperando presupuestos...' : 'Cerrado'}
                  </p>
                  
                  <button 
                    onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
                    className="flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 py-2 px-4 rounded-xl border border-orange-100 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
                  >
                    {req._count?.quotes ? 'Ver Presupuestos' : 'Ver Detalles'}
                    {expandedId === req.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expandedId === req.id && (
                <div className="bg-gray-50 dark:bg-gray-900/50 p-6 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4">Detalles del Pedido</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-wrap">
                    {req.description}
                  </p>

                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Propuestas Recibidas
                  </h4>

                  {!req._count?.quotes ? (
                    <div className="p-8 text-center bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
                      Aún no has recibido propuestas para este pedido. 
                      En cuanto un profesional te envíe una, aparecerá aquí.
                    </div>
                  ) : (
                    <div className="space-y-4">
                       <div className="p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-3 w-full sm:w-auto">
                             <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                J
                             </div>
                             <div>
                                <p className="font-bold text-gray-900 dark:text-white">Juan Pérez</p>
                                <p className="text-sm text-gray-500 italic line-clamp-1">"Tengo los materiales listos para hoy..."</p>
                             </div>
                          </div>
                          <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                             <div className="text-center sm:text-right">
                                <p className="text-xs text-gray-400 uppercase font-bold">Presupuesto</p>
                                <p className="text-xl font-bold text-orange-500">$15.000</p>
                             </div>
                             <button 
                                onClick={() => handleAcceptQuote('mock-1')}
                                disabled={!!actionLoading}
                                className="btn-primary px-6 py-2.5 flex items-center gap-2"
                             >
                                {actionLoading === 'mock-1' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                                Aceptar
                             </button>
                          </div>
                       </div>
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
