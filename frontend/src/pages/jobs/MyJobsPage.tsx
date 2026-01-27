import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  X, 
  MessageSquare,
  Loader2,
  Check,
  Star,
  User,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Briefcase
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { ProviderProfileModal } from '../../components/ProviderProfileModal';
import { requestsService, type ServiceRequest } from '../../services/requests.service';

interface Booking {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  description: string;
  preferredDate: string | null;
  address: string | null;
  quotedPrice: number | null;
  createdAt: string;
  service: {
    id: string;
    title: string;
    category: string;
  } | null;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl?: string | null;
    avgRating?: number;
    totalReviews?: number;
  };
  client: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

const STATUS_CONFIG: Record<string, { label: string; class: string; darkClass: string; icon: any }> = {
  PENDING: { label: 'Pendiente', class: 'bg-gray-100 text-gray-700', darkClass: 'dark:bg-gray-700 dark:text-gray-300', icon: Clock },
  ACCEPTED: { label: 'Aceptado', class: 'bg-blue-100 text-blue-700', darkClass: 'dark:bg-blue-900/30 dark:text-blue-400', icon: CheckCircle },
  IN_PROGRESS: { label: 'En Progreso', class: 'bg-orange-100 text-orange-700', darkClass: 'dark:bg-orange-900/30 dark:text-orange-400', icon: Clock },
  COMPLETED: { label: 'Completado', class: 'bg-green-100 text-green-700', darkClass: 'dark:bg-green-900/30 dark:text-green-400', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', class: 'bg-red-100 text-red-700', darkClass: 'dark:bg-red-900/30 dark:text-red-400', icon: X },
  REJECTED: { label: 'Rechazado', class: 'bg-red-100 text-red-700', darkClass: 'dark:bg-red-900/30 dark:text-red-400', icon: X },
};

type TabType = 'open' | 'active' | 'completed';

export function MyJobsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('open');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Accept modal for quotes
  const [acceptingQuoteId, setAcceptingQuoteId] = useState<string | null>(null);

  const isProvider = user?.role === 'PROVIDER';

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, requestsData] = await Promise.all([
        httpClient.get('/bookings/my-bookings'),
        isProvider ? Promise.resolve([]) : requestsService.getMyRequests()
      ]);
      setBookings(bookingsRes.data || []);
      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
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

  const handleAcceptQuote = async (quoteId: string) => {
    setAcceptingQuoteId(quoteId);
    try {
      await httpClient.post(`/quotes/${quoteId}/accept`);
      alert('¡Presupuesto aceptado! Ya puedes coordinar con el profesional.');
      loadData();
    } catch (error) {
      console.error('Error accepting quote', error);
      alert('Error al aceptar el presupuesto');
    } finally {
      setAcceptingQuoteId(null);
    }
  };

  const goToChat = (bookingId: string) => {
    navigate('/chat', { state: { bookingId } });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Filter logic
  const openBookings = bookings.filter(b => b.status === 'PENDING');
  const activeBookings = bookings.filter(b => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status));
  const completedBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status));
  const openRequests = requests.filter(r => r.status === 'OPEN');

  const tabs = [
    { id: 'open' as const, label: 'Abiertos', count: openBookings.length + openRequests.length },
    { id: 'active' as const, label: 'En Curso', count: activeBookings.length },
    { id: 'completed' as const, label: 'Historial', count: completedBookings.length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  const renderBookingCard = (booking: Booking) => {
    const statusConfig = STATUS_CONFIG[booking.status];
    const StatusIcon = statusConfig?.icon || Clock;
    const isActionLoading = actionLoading === booking.id;

    return (
      <div key={booking.id} className="card p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="hidden sm:flex w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
              <div>
                <span className="text-xs text-gray-400 dark:text-gray-500 block mb-1">
                  {booking.service ? 'Solicitud directa' : 'Desde pedido abierto'}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {booking.service?.title || 'Servicio Personalizado'}
                </h3>
              </div>
              <span className={`badge ${statusConfig?.class || 'bg-gray-100 text-gray-700'} ${statusConfig?.darkClass || ''} flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {statusConfig?.label || booking.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
              {booking.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(booking.createdAt)}
              </span>
              {isProvider ? (
                <span>
                  Cliente: {booking.client?.firstName} {booking.client?.lastName}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Profesional: {booking.provider?.firstName} {booking.provider?.lastName}</span>
                  {booking.provider?.avgRating !== undefined && booking.provider.avgRating > 0 && (
                    <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {booking.provider.avgRating.toFixed(1)}
                    </span>
                  )}
                </span>
              )}
              {booking.quotedPrice && (
                <span className="font-medium text-orange-600 dark:text-orange-400">
                  ${booking.quotedPrice}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
              {/* Provider Actions */}
              {isProvider && booking.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'ACCEPTED')}
                    disabled={isActionLoading}
                    className="btn-primary text-sm py-2 px-3 flex items-center gap-1"
                  >
                    {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    Aceptar
                  </button>
                  <button
                    onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                    disabled={isActionLoading}
                    className="btn-secondary text-sm py-2 px-3 flex items-center gap-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                    Rechazar
                  </button>
                </>
              )}

              {isProvider && booking.status === 'ACCEPTED' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                  disabled={isActionLoading}
                  className="btn-primary text-sm py-2 px-3"
                >
                  {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar Trabajo'}
                </button>
              )}

              {isProvider && booking.status === 'IN_PROGRESS' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                  disabled={isActionLoading}
                  className="btn-primary text-sm py-2 px-3 flex items-center gap-1"
                >
                  {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Marcar Completado
                </button>
              )}

              {/* Client Actions */}
              {!isProvider && booking.status === 'PENDING' && (
                <button
                  onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                  disabled={isActionLoading}
                  className="btn-secondary text-sm py-2 px-3 flex items-center gap-1 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <X className="w-4 h-4" />
                  Cancelar
                </button>
              )}

              {!isProvider && booking.provider?.id && (
                <button
                  onClick={() => {
                    setSelectedProviderId(booking.provider.id);
                    setShowProfileModal(true);
                  }}
                  className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Ver Perfil</span>
                </button>
              )}

              <button
                onClick={() => goToChat(booking.id)}
                className="btn-secondary text-sm py-2 px-3 flex items-center gap-1"
              >
                <MessageSquare className="w-4 h-4" />
                <span className="hidden sm:inline">Mensaje</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRequestCard = (req: ServiceRequest) => {
    const isExpanded = expandedRequestId === req.id;
    const quotesCount = req._count?.quotes || 0;

    return (
      <div key={req.id} className="card overflow-hidden">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full mb-2 uppercase tracking-wider">
                Pedido Abierto
              </span>
              <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs font-semibold rounded-full mb-2 ml-2">
                {req.category}
              </span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">{req.title}</h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block mb-1">Presupuestos</span>
              <span className="text-xl font-bold text-orange-500">{quotesCount}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{req.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">{formatDate(req.createdAt)}</span>
            <button 
              onClick={() => setExpandedRequestId(isExpanded ? null : req.id)}
              className="flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 py-2 px-4 rounded-xl border border-orange-100 dark:border-orange-900/40 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all"
            >
              {quotesCount ? 'Ver Presupuestos' : 'Ver Detalles'}
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-gray-50 dark:bg-gray-900/50 p-5 border-t border-gray-100 dark:border-gray-700 animate-fade-in">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Propuestas Recibidas
            </h4>

            {!quotesCount ? (
              <div className="p-6 text-center bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 text-gray-400">
                Aún no recibiste propuestas. Los profesionales las verán pronto.
              </div>
            ) : (
              <div className="space-y-3">
                {/* Mock quote - in real implementation, iterate over req.quotes */}
                <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center text-orange-600 font-bold">
                      J
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">Juan Pérez</p>
                      <p className="text-sm text-gray-500 italic line-clamp-1">"Tengo los materiales..."</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                    <div className="text-center sm:text-right">
                      <p className="text-xs text-gray-400 uppercase font-bold">Presupuesto</p>
                      <p className="text-xl font-bold text-orange-500">$15.000</p>
                    </div>
                    <button 
                      onClick={() => handleAcceptQuote('mock-1')}
                      disabled={!!acceptingQuoteId}
                      className="btn-primary px-4 py-2 flex items-center gap-2"
                    >
                      {acceptingQuoteId === 'mock-1' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                      Aceptar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderEmptyState = (tab: TabType) => {
    const messages = {
      open: {
        icon: AlertCircle,
        title: 'No tenés solicitudes abiertas',
        description: 'Cuando solicites un servicio o publiques un problema, aparecerá aquí.',
        cta: isProvider ? null : { label: 'Buscar Servicios', path: '/services' }
      },
      active: {
        icon: Briefcase,
        title: 'No tenés trabajos en curso',
        description: 'Los trabajos aceptados y en progreso aparecerán aquí.',
        cta: null
      },
      completed: {
        icon: CheckCircle,
        title: 'No tenés historial',
        description: 'Tus trabajos completados aparecerán aquí.',
        cta: null
      }
    };

    const msg = messages[tab];
    const Icon = msg.icon;

    return (
      <div className="card p-12 text-center">
        <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{msg.title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{msg.description}</p>
        {msg.cta && (
          <button onClick={() => navigate(msg.cta!.path)} className="btn-primary">
            {msg.cta.label}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Trabajos</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {isProvider ? 'Gestiona las solicitudes de tus clientes' : 'Seguí el estado de tus servicios solicitados'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'open' && (
          <>
            {/* Show open requests first (client only) */}
            {!isProvider && openRequests.map(renderRequestCard)}
            
            {/* Then pending bookings */}
            {openBookings.map(renderBookingCard)}
            
            {openBookings.length === 0 && openRequests.length === 0 && renderEmptyState('open')}
          </>
        )}

        {activeTab === 'active' && (
          <>
            {activeBookings.map(renderBookingCard)}
            {activeBookings.length === 0 && renderEmptyState('active')}
          </>
        )}

        {activeTab === 'completed' && (
          <>
            {completedBookings.map(renderBookingCard)}
            {completedBookings.length === 0 && renderEmptyState('completed')}
          </>
        )}
      </div>

      {/* Provider Profile Modal */}
      {selectedProviderId && (
        <ProviderProfileModal
          providerId={selectedProviderId}
          isOpen={showProfileModal}
          onClose={() => {
            setShowProfileModal(false);
            setSelectedProviderId(null);
          }}
        />
      )}
    </div>
  );
}
