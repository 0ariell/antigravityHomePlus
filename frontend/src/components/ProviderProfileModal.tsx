import { useEffect, useState } from 'react';
import { X, Star, Calendar, MapPin, Loader2, Sparkles } from 'lucide-react';
import { httpClient } from '../infra/http';
import { RequestModal } from './bookings/RequestModal';

// ... (Interfaces remain the same) ...
interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
  };
}

interface ProviderProfile {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  zone: string | null;
  trades: string[];
  avgRating: number;
  totalReviews: number;
  createdAt: string;
  reviewsReceived: Review[];
}

interface ProviderProfileModalProps {
  providerId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProviderProfileModal({ providerId, isOpen, onClose }: ProviderProfileModalProps) {
  const [profile, setProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);

  useEffect(() => {
    if (isOpen && providerId) {
      loadProfile();
    }
  }, [isOpen, providerId]);

  const loadProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get(`/auth/users/${providerId}/public-profile`);
      setProfile(response.data);
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('No se pudo cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
        const key = `star-${i}`;
      if (i < fullStars) {
        stars.push(<Star key={key} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={key} className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={key} className="w-5 h-5 text-gray-300" />);
      }
    }
    return stars;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <div className="bg-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col border border-gray-700 shadow-2xl">
          {/* Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between bg-gray-900/50">
            <h2 className="text-lg font-bold text-white">Perfil del Profesional</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-900">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
              </div>
            ) : profile ? (
              <div className="space-y-8">
                {/* Profile Header */}
                <div className="flex items-start gap-5">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-orange-600 rounded-full p-1 flex-shrink-0 shadow-lg shadow-primary-500/20">
                    {profile.avatarUrl ? (
                      <img
                        src={profile.avatarUrl}
                        alt={profile.firstName}
                        className="w-full h-full rounded-full object-cover border-4 border-gray-900"
                      />
                    ) : (
                       <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-900">
                         {profile.firstName?.[0] || 'P'}
                       </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl font-bold text-white truncate">
                      {profile.firstName} {profile.lastName}
                    </h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex">{renderStars(profile.avgRating)}</div>
                      <span className="text-lg font-bold text-white">
                        {profile.avgRating.toFixed(1)}
                      </span>
                      <span className="text-gray-500 text-sm">
                        ({profile.totalReviews} reseñas)
                      </span>
                    </div>

                    {/* Zone */}
                    {profile.zone && (
                      <div className="flex items-center gap-1.5 text-gray-400 mt-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{profile.zone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Main CTA */}
                <button 
                  onClick={() => setShowRequestModal(true)}
                  className="w-full btn-primary py-3.5 font-bold text-lg flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Sparkles className="w-5 h-5" />
                  Solicitar Presupuesto Directo
                </button>

                {/* Bio */}
                {profile.bio && (
                  <div className="bg-gray-800/50 p-4 rounded-2xl border border-gray-700/50">
                    <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wider">Sobre mí</h4>
                    <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Trades */}
                {profile.trades && profile.trades.length > 0 && (
                  <div>
                    <h4 className="font-bold text-white mb-3 text-sm uppercase tracking-wider">Especialidades</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.trades.map((trade, index) => (
                        <span
                          key={index}
                          className="px-3 py-1.5 bg-gray-800 text-gray-300 border border-gray-700 rounded-lg text-sm font-medium"
                        >
                          {trade}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reviews */}
                <div>
                  <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Últimas Reseñas</h4>
                  {profile.reviewsReceived.length === 0 ? (
                    <div className="text-center py-6 bg-gray-800/30 rounded-2xl border border-dashed border-gray-700">
                       <p className="text-gray-500 text-sm">Aún no tiene reseñas recibidas.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {profile.reviewsReceived.map((review) => (
                        <div
                          key={review.id}
                          className="p-4 bg-gray-800 rounded-2xl border border-gray-700/50"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden flex-shrink-0">
                              {review.author.avatarUrl ? (
                                <img
                                  src={review.author.avatarUrl}
                                  alt={review.author.firstName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                   {review.author.firstName?.[0] || 'U'}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-gray-200 text-sm">
                                  {review.author.firstName} {review.author.lastName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <div className="flex mb-1.5 transform scale-90 origin-left">
                                {renderStars(review.rating)}
                              </div>
                              {review.comment && (
                                <p className="text-gray-400 text-sm italic">"{review.comment}"</p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <RequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        targetProviderId={providerId}
      />
    </>
  );
}
