import { useEffect, useState } from 'react';
import { X, Star, Calendar, MapPin, Loader2 } from 'lucide-react';
import { httpClient } from '../../infra/http';

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
      if (i < fullStars) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="w-5 h-5 fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} className="w-5 h-5 text-gray-300" />);
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Perfil del Profesional</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : profile ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {profile.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={profile.firstName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    profile.firstName?.[0] || 'P'
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {profile.firstName} {profile.lastName}
                  </h3>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex">{renderStars(profile.avgRating)}</div>
                    <span className="text-lg font-medium text-gray-900">
                      {profile.avgRating.toFixed(1)}
                    </span>
                    <span className="text-gray-500">
                      ({profile.totalReviews} {profile.totalReviews === 1 ? 'reseña' : 'reseñas'})
                    </span>
                  </div>

                  {/* Zone */}
                  {profile.zone && (
                    <div className="flex items-center gap-1 text-gray-500 mt-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.zone}</span>
                    </div>
                  )}

                  {/* Member since */}
                  <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde {formatDate(profile.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sobre mí</h4>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {/* Trades */}
              {profile.trades && profile.trades.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Oficios</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.trades.map((trade, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm"
                      >
                        {trade}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div>
                <h4 className="font-medium text-gray-900 mb-4">Reseñas</h4>
                {profile.reviewsReceived.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Aún no tiene reseñas</p>
                ) : (
                  <div className="space-y-4">
                    {profile.reviewsReceived.map((review) => (
                      <div
                        key={review.id}
                        className="p-4 bg-gray-50 rounded-xl"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0">
                            {review.author.avatarUrl ? (
                              <img
                                src={review.author.avatarUrl}
                                alt={review.author.firstName}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              review.author.firstName?.[0] || 'U'
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-gray-900">
                                {review.author.firstName} {review.author.lastName}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatDate(review.createdAt)}
                              </span>
                            </div>
                            <div className="flex mt-1">
                              {renderStars(review.rating)}
                            </div>
                            {review.comment && (
                              <p className="text-gray-600 mt-2 text-sm">{review.comment}</p>
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
  );
}
