import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpClient } from '../../../infra/http';
import { requestsService, type ServiceRequest } from '../../../services/requests.service';
import { useAuthStore } from '../../../app/stores/authStore';

export interface DashboardStats {
  monthRevenue: number;
  activeJobs: number;
  rating: number;
}

export interface Booking {
    id: string;
    status: string;
    quotedPrice: number | null;
    request: {
        title: string;
    }
    client: {
        firstName: string;
        lastName: string;
    }
    estimatedDate?: string;
}

export function useProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({ monthRevenue: 0, activeJobs: 0, rating: 0 });
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [recentLeads, setRecentLeads] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [quotes, bookingsRes, leads] = await Promise.all([
         requestsService.getMyQuotes(),
         httpClient.get('/bookings/my-bookings'),
         requestsService.getNearbyOpen()
      ]);

      const myBookings = (bookingsRes.data || []) as Booking[];
      const myQuotes = quotes || [];

      // Calculate Revenue (Accepted / Completed)
      const revenue = myQuotes
        .filter(q => q.status === 'ACCEPTED')
        .reduce((acc: number, q) => acc + q.price, 0);

      const activeCount = myBookings.filter((b: Booking) => 
        ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)
      ).length;

      // Find Next Job
      // Logic: First accepted/in_progress. In real app, sort by date.
      const upcoming = myBookings.find((b: Booking) => 
        ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)
      );

      setStats({
          monthRevenue: revenue,
          activeJobs: activeCount,
          rating: user?.avgRating || 0
      });

      setNextBooking(upcoming || null);
      setRecentLeads((leads || []).slice(0, 3)); // Top 3

    } catch (error) {
       console.error("Dashboard Load Error", error);
    } finally {
       setLoading(false);
    }
  };

  const getTimeGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Buenos días';
      if (hour < 19) return 'Buenas tardes';
      return 'Buenas noches';
  };

  return {
    user,
    loading,
    stats,
    nextBooking,
    recentLeads,
    getTimeGreeting,
    navigate
  };
}
