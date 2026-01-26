import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Star,
  MapPin,
  X,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';

interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  priceBase: number | null;
  priceUnit: string | null;
  images: string[];
  avgRating: number;
  totalReviews: number;
  isActive: boolean;
  provider: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    avgRating: number;
    totalReviews: number;
    bio: string | null;
  };
}

export function ServiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    description: '',
    preferredDate: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  const loadService = async () => {
    try {
      const response = await httpClient.get(`/services/${id}`);
      setService(response.data);
    } catch (error) {
      console.error('Error loading service:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service) return;

    setIsSubmitting(true);
    try {
      await httpClient.post('/bookings', {
        serviceId: service.id,
        description: bookingForm.description,
        preferredDate: bookingForm.preferredDate || null,
        address: bookingForm.address,
        notes: bookingForm.notes || null,
        images: [],
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setShowBookingModal(false);
        setBookingSuccess(false);
        navigate('/bookings');
      }, 2000);
    } catch (error: any) {
      console.error('Error creating booking:', error);
      alert(error.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openBookingModal = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user?.role !== 'CLIENT') {
      alert('Solo los clientes pueden solicitar servicios');
      return;
    }
    setShowBookingModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">Servicio no encontrado</p>
        <button onClick={() => navigate('/services')} className="btn-primary mt-4">
          Volver a servicios
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Service Header */}
          <div className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <span className="badge bg-orange-100 text-orange-700">{service.category}</span>
              {!service.isActive && (
                <span className="badge bg-gray-100 text-gray-600">No disponible</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-gray-900 font-medium">{service.avgRating.toFixed(1)}</span>
                <span>({service.totalReviews} reseñas)</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{service.zone}</span>
              </div>
            </div>

            {service.priceBase && (
              <p className="text-2xl font-bold text-orange-600 mb-4">
                ${service.priceBase} <span className="text-base font-normal text-gray-500">/ {service.priceUnit}</span>
              </p>
            )}

            <p className="text-gray-600 whitespace-pre-wrap">{service.description}</p>
          </div>

          {/* Images */}
          {service.images.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Galería</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {service.images.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`${service.title} ${i + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Provider Card */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Profesional</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {service.provider.firstName?.[0] || 'P'}
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {service.provider.firstName} {service.provider.lastName}
                </p>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{service.provider.avgRating.toFixed(1)}</span>
                  <span className="text-gray-400">({service.provider.totalReviews})</span>
                </div>
              </div>
            </div>
            {service.provider.bio && (
              <p className="text-sm text-gray-500">{service.provider.bio}</p>
            )}
          </div>

          {/* CTA */}
          <div className="card p-6">
            <button
              onClick={openBookingModal}
              disabled={!service.isActive}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {service.isActive ? 'Solicitar Servicio' : 'No disponible'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-3">
              El profesional revisará tu solicitud y te contactará
            </p>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {bookingSuccess ? (
              <div className="p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h2>
                <p className="text-gray-500">El profesional revisará tu solicitud pronto.</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Solicitar Servicio</h2>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Describe tu problema *
                    </label>
                    <textarea
                      value={bookingForm.description}
                      onChange={(e) => setBookingForm({ ...bookingForm, description: e.target.value })}
                      className="input-field resize-none"
                      rows={4}
                      required
                      placeholder="Ej: Tengo una pérdida de agua en la cocina debajo del fregadero..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha preferida
                    </label>
                    <input
                      type="datetime-local"
                      value={bookingForm.preferredDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección aproximada *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.address}
                      onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                      className="input-field"
                      required
                      placeholder="Ej: Palermo, CABA"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notas adicionales
                    </label>
                    <textarea
                      value={bookingForm.notes}
                      onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                      className="input-field resize-none"
                      rows={2}
                      placeholder="Horarios disponibles, acceso al edificio, etc."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowBookingModal(false)}
                      className="flex-1 btn-secondary"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 btn-primary flex items-center justify-center gap-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      Enviar Solicitud
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
