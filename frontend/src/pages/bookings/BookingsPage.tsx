import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  X, 
  MessageSquare,
  Loader2,
  Check,
  Star,
  User
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { ProviderProfileModal } from '../../components/ProviderProfileModal';

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
  };
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

const STATUS_CONFIG: Record<string, { label: string; class: string; icon: any }> = {
  PENDING: { label: 'Pendiente', class: 'bg-gray-100 text-gray-700', icon: Clock },
  ACCEPTED: { label: 'Aceptado', class: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  IN_PROGRESS: { label: 'En Progreso', class: 'bg-orange-100 text-orange-700', icon: Clock },
  COMPLETED: { label: 'Completado', class: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELLED: { label: 'Cancelado', class: 'bg-red-100 text-red-700', icon: X },
  REJECTED: { label: 'Rechazado', class: 'bg-red-100 text-red-700', icon: X },
};

export function BookingsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Accept modal state
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [acceptingBooking, setAcceptingBooking] = useState<Booking | null>(null);
  const [quotedPrice, setQuotedPrice] = useState<string>('');

  // Provider profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  const isProvider = user?.role === 'PROVIDER';

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await httpClient.get('/bookings/my-bookings');
      setBookings(response.data || []);
    } catch (error) {
      console.error('Error loading bookings:', error);
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
      alert('Error al actualizar la reserva');
    } finally {
      setActionLoading(null);
    }
  };

  const goToChat = async (bookingId: string) => {
    try {
      const response = await httpClient.get(`/chat/booking/${bookingId}`);
      if (response.data?.id) {
        navigate('/chat');
      }
    } catch (error) {
      // Create conversation if doesn't exist
      navigate('/chat');
    }
  };

  const openAcceptModal = (booking: Booking) => {
    setAcceptingBooking(booking);
    setQuotedPrice('');
    setShowAcceptModal(true);
  };

  const handleAccept = async () => {
    if (!acceptingBooking) return;
    setActionLoading(acceptingBooking.id);
    try {
      const payload: any = { status: 'ACCEPTED' };
      if (quotedPrice) {
        payload.quotedPrice = parseFloat(quotedPrice);
      }
      await httpClient.patch(`/bookings/${acceptingBooking.id}/status`, payload);
      setBookings((prev) =>
        prev.map((b) => (b.id === acceptingBooking.id ? { ...b, status: 'ACCEPTED' as Booking['status'], quotedPrice: payload.quotedPrice || null } : b))
      );
      setShowAcceptModal(false);
      setAcceptingBooking(null);
    } catch (error) {
      console.error('Error accepting booking:', error);
      alert('Error al aceptar la solicitud');
    } finally {
      setActionLoading(null);
    }
  };



  const filteredBookings = selectedStatus === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === selectedStatus);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const statusFilters = [
    { value: 'all', label: 'Todas' },
    { value: 'PENDING', label: 'Pendientes' },
    { value: 'ACCEPTED', label: 'Aceptadas' },
    { value: 'IN_PROGRESS', label: 'En Progreso' },
    { value: 'COMPLETED', label: 'Completadas' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Reservas</h1>
          <p className="text-gray-500 mt-1">
            {isProvider ? 'Gestiona las solicitudes de tus clientes' : 'Historial de servicios solicitados'}
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setSelectedStatus(filter.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedStatus === filter.value
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="card p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay reservas</h3>
          <p className="text-gray-500">
            {selectedStatus === 'all' 
              ? 'No tienes reservas aún' 
              : `No hay reservas con estado "${statusFilters.find(f => f.value === selectedStatus)?.label}"`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => {
            const statusConfig = STATUS_CONFIG[booking.status];
            const StatusIcon = statusConfig?.icon || Clock;
            const isActionLoading = actionLoading === booking.id;

            return (
              <div key={booking.id} className="card p-4 sm:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Service Icon */}
                  <div className="hidden sm:flex w-12 h-12 bg-orange-100 rounded-xl items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-orange-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {booking.service?.title || 'Servicio'}
                      </h3>
                      <span className={`badge ${statusConfig?.class || 'bg-gray-100 text-gray-700'} flex items-center gap-1`}>
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig?.label || booking.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {booking.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
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
                            <span className="flex items-center gap-1 text-yellow-600">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {booking.provider.avgRating.toFixed(1)}
                            </span>
                          )}
                        </span>
                      )}
                      {booking.quotedPrice && (
                        <span className="font-medium text-orange-600">
                          ${booking.quotedPrice}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-100">
                      {/* Provider Actions */}
                      {isProvider && booking.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => openAcceptModal(booking)}
                            disabled={isActionLoading}
                            className="btn-primary text-sm py-2 px-3 flex items-center gap-1"
                          >
                            {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                            Aceptar
                          </button>
                          <button
                            onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                            disabled={isActionLoading}
                            className="btn-secondary text-sm py-2 px-3 flex items-center gap-1 text-red-600 hover:bg-red-50"
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
                          className="btn-secondary text-sm py-2 px-3 flex items-center gap-1 text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      )}

                      {/* Ver Perfil - Only for clients */}
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

                      {/* Common Actions */}
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
          })}
        </div>
      )}

      {/* Accept Modal */}
      {showAcceptModal && acceptingBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Aceptar Solicitud</h2>
              <p className="text-sm text-gray-500 mt-1">{acceptingBooking.service?.title}</p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Detalles del cliente:</h4>
                <p className="text-sm text-gray-600">{acceptingBooking.description}</p>
                {acceptingBooking.address && (
                  <p className="text-sm text-gray-500 mt-1">📍 {acceptingBooking.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Presupuesto estimado (opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={quotedPrice}
                    onChange={(e) => setQuotedPrice(e.target.value)}
                    className="input-field pl-8"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">Puedes dejarlo vacío y acordar después por chat</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3">
              <button
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                disabled={actionLoading === acceptingBooking.id}
                className="flex-1 btn-primary flex items-center justify-center gap-2"
              >
                {actionLoading === acceptingBooking.id && <Loader2 className="w-4 h-4 animate-spin" />}
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

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
