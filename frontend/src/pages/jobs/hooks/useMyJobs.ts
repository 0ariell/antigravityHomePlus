import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../infra/http';
import { requestsService, type ServiceRequest } from '../../../services/requests.service';
import { useAuthStore } from '../../../app/stores/authStore';

export interface Booking {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';
  description: string;
  preferredDate: string | null;
  address: string | null;
  latitude?: number;
  longitude?: number;
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
    avatarUrl?: string | null;
  };
}

export type TabType = 'open' | 'active' | 'completed';

export function useMyJobs() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('open');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Profile modal state
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

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
      setBookings((bookingsRes.data || []) as Booking[]);
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

  const goToChat = (bookingId: string) => {
    navigate('/chat', { state: { bookingId } });
  };

  const openExternalMap = (lat?: number, lng?: number) => {
    if (!lat || !lng) return;
    window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, '_blank');
  };

  return {
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
      openExternalMap, // Export it
      navigate,
      user
  };
}
