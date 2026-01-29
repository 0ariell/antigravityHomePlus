import { 
  CheckCircle, 
  X, 
  Loader2, 
  Check, 
  User, 
  Calendar, 
  Briefcase, 
  Layers, 
  Archive
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProviderProfileModal } from '../../components/ProviderProfileModal';
import { BookingCard } from '../../ui/components/cards/BookingCard';
import { RequestCard } from '../../ui/components/cards/RequestCard';
import { useMyJobs } from './hooks/useMyJobs';

export function MyJobsPage() {
  const {
      bookings,
      requests,
      isLoading,
      activeTab,
      setActiveTab,
      actionLoading,
      showProfileModal,
      setShowProfileModal,
      selectedProviderId,
      setSelectedProviderId,
      isProvider,
      updateBookingStatus,
      goToChat,
      openExternalMap,
      navigate
  } = useMyJobs();

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
    { id: 'open' as const, label: 'Abiertos', icon: Layers, count: openBookings.length + openRequests.length },
    { id: 'active' as const, label: 'En Curso', icon: Calendar, count: activeBookings.length },
    { id: 'completed' as const, label: 'Historial', icon: Archive, count: completedBookings.length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20 min-h-screen">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-primary-500" />
          Mis Trabajos
        </h1>
        <p className="text-gray-400 mt-1">
          Gestiona tus reservas, solicitudes y pedidos.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-900/50 backdrop-blur-md p-2 rounded-2xl overflow-x-auto border border-gray-800 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all relative ${
                isActive
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-black tracking-tighter ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-gray-800 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-6">
        {/* Open Tab: Requests + Pending Bookings */}
        {activeTab === 'open' && (
          <div className="space-y-6">
            {!isProvider && openRequests.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white px-1">Mis Solicitudes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {openRequests.map(req => (
                    <RequestCard
                      key={req.id}
                      id={req.id}
                      title={req.title}
                      description={req.description}
                      status={req.status}
                      createdAt={req.createdAt}
                      category={req.category}
                      quotesCount={req._count?.quotes || 0}
                      onClick={() => navigate(`/requests/${req.id}`)}
                    />
                  ))}
                </div>
              </div>
            )}

            {openBookings.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-white px-1">
                  Reservas Pendientes
                </h3>
                <div className="space-y-4">
                  {openBookings.map(booking => (
                    <BookingCard
                      key={booking.id}
                      id={booking.id}
                      title={booking.service?.title || 'Servicio Personalizado'}
                      description={booking.description}
                      status={booking.status}
                      date={formatDate(booking.createdAt)}
                      price={booking.quotedPrice}
                      counterParty={{
                        name: isProvider 
                          ? `${booking.client?.firstName} ${booking.client?.lastName}`
                          : `${booking.provider?.firstName} ${booking.provider?.lastName}`,
                        role: isProvider ? 'Client' : 'Provider',
                        avatar: isProvider ? booking.client?.avatarUrl : booking.provider?.avatarUrl,
                        rating: isProvider ? undefined : booking.provider?.avgRating
                      }}
                      onChat={() => goToChat(booking.id)}
                      onMapClick={
                        (booking.latitude && booking.longitude) 
                          ? () => openExternalMap(booking.latitude!, booking.longitude!) 
                          : undefined
                      }
                      actions={
                        <>
                          {isProvider ? (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'ACCEPTED')}
                                disabled={actionLoading === booking.id}
                                className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2"
                              >
                                {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                Aceptar
                              </button>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'REJECTED')}
                                disabled={actionLoading === booking.id}
                                className="px-4 py-2 bg-red-900/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-900/30 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Rechazar
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                                disabled={actionLoading === booking.id}
                                className="px-4 py-2 bg-red-900/20 text-red-400 text-sm font-semibold rounded-xl hover:bg-red-900/30 transition-colors flex items-center gap-2"
                              >
                                <X className="w-4 h-4" />
                                Cancelar
                              </button>
                              {booking.provider?.id && (
                                <button
                                  onClick={() => {
                                    setSelectedProviderId(booking.provider.id);
                                    setShowProfileModal(true);
                                  }}
                                  className="px-4 py-2 bg-gray-700 text-gray-300 text-sm font-semibold rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2"
                                >
                                  <User className="w-4 h-4" />
                                  Ver Perfil
                                </button>
                              )}
                            </>
                          )}
                        </>
                      }
                    />
                  ))}
                </div>
              </div>
            )}
            
            {openBookings.length === 0 && openRequests.length === 0 && (
               <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-dashed border-gray-700">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Layers className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No tienes trabajos pendientes</h3>
                <p className="text-gray-400 max-w-xs mx-auto text-sm">
                  {isProvider ? 'Espera nuevas solicitudes.' : 'Crea un pedido o contrata un servicio para empezar.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Active Tab */}
        {activeTab === 'active' && (
          <div className="space-y-4">
            {activeBookings.length === 0 ? (
               <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-dashed border-gray-700">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Calendar className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">No hay trabajos en curso</h3>
              </div>
            ) : (
              activeBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  title={booking.service?.title || 'Servicio Personalizado'}
                  description={booking.description}
                  status={booking.status}
                  date={formatDate(booking.createdAt)}
                  price={booking.quotedPrice}
                  counterParty={{
                    name: isProvider 
                      ? `${booking.client?.firstName} ${booking.client?.lastName}`
                      : `${booking.provider?.firstName} ${booking.provider?.lastName}`,
                    role: isProvider ? 'Client' : 'Provider',
                    avatar: isProvider ? booking.client?.avatarUrl : booking.provider?.avatarUrl,
                    rating: isProvider ? undefined : booking.provider?.avgRating
                  }}
                  onChat={() => goToChat(booking.id)}
                  onMapClick={
                    (booking.latitude && booking.longitude) 
                      ? () => openExternalMap(booking.latitude!, booking.longitude!) 
                      : undefined
                  }
                  actions={
                    <>
                      {isProvider && booking.status === 'ACCEPTED' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                          disabled={actionLoading === booking.id}
                          className="px-4 py-2 bg-primary-500 text-white text-sm font-semibold rounded-xl hover:bg-primary-600 transition-colors flex items-center gap-2"
                        >
                           {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar Trabajo'}
                        </button>
                      )}
                      
                      {isProvider && booking.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                          disabled={actionLoading === booking.id}
                          className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-xl hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                          {actionLoading === booking.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                          Marcar Completado
                        </button>
                      )}
                    </>
                  }
                />
              ))
            )}
          </div>
        )}

        {/* Completed Tab */}
        {activeTab === 'completed' && (
          <div className="space-y-4">
            {completedBookings.length === 0 ? (
               <div className="text-center py-20 bg-gray-800/50 rounded-3xl border border-dashed border-gray-700">
                <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Archive className="w-10 h-10 text-gray-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Sin historial aún</h3>
              </div>
            ) : (
              completedBookings.map(booking => (
                <BookingCard
                  key={booking.id}
                  id={booking.id}
                  title={booking.service?.title || 'Servicio Personalizado'}
                  description={booking.description}
                  status={booking.status}
                  date={formatDate(booking.createdAt)}
                  price={booking.quotedPrice}
                  counterParty={{
                    name: isProvider 
                      ? `${booking.client?.firstName} ${booking.client?.lastName}`
                      : `${booking.provider?.firstName} ${booking.provider?.lastName}`,
                    role: isProvider ? 'Client' : 'Provider',
                    avatar: isProvider ? booking.client?.avatarUrl : booking.provider?.avatarUrl,
                    rating: isProvider ? undefined : booking.provider?.avgRating
                  }}
                  onChat={() => goToChat(booking.id)}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Provider Profile Modal */}
      {selectedProviderId && (
        <ProviderProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          providerId={selectedProviderId}
        />
      )}
    </motion.div>
  );
}
