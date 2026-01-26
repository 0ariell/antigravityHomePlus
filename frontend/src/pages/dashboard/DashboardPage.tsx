import { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  ArrowUp,
  Star,
  Briefcase,
  Play,
  Pause,
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  inProgressBookings: number;
  completedBookings: number;
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    inProgressBookings: 0,
    completedBookings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await httpClient.get('/bookings/my-bookings');
      const bookings = response.data;

      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter((b: any) => b.status === 'PENDING').length,
        inProgressBookings: bookings.filter((b: any) => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length,
        completedBookings: bookings.filter((b: any) => b.status === 'COMPLETED').length,
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isProvider = user?.role === 'PROVIDER';

  const StatCard = ({
    title,
    value,
    icon: Icon,
    trend,
    isPrimary,
  }: {
    title: string;
    value: number;
    icon: any;
    trend?: string;
    isPrimary?: boolean;
  }) => (
    <div className={`stat-card ${isPrimary ? 'stat-card-primary' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className={`text-sm ${isPrimary ? 'text-orange-100' : 'text-gray-500'}`}>{title}</p>
          <p className={`text-3xl font-bold mt-1 ${isPrimary ? 'text-white' : 'text-gray-900'}`}>
            {value}
          </p>
        </div>
        <div
          className={`p-2 rounded-xl ${
            isPrimary ? 'bg-white/20' : 'bg-gray-100'
          }`}
        >
          <Icon className={`w-5 h-5 ${isPrimary ? 'text-white' : 'text-gray-600'}`} />
        </div>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-sm ${isPrimary ? 'text-orange-100' : 'text-orange-600'}`}>
          <ArrowUp className="w-4 h-4" />
          <span>{trend}</span>
        </div>
      )}
    </div>
  );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: 'badge-pending',
      ACCEPTED: 'badge-warning',
      IN_PROGRESS: 'badge-warning',
      COMPLETED: 'badge-success',
    };

    const labels: Record<string, string> = {
      PENDING: 'Pendiente',
      ACCEPTED: 'Aceptado',
      IN_PROGRESS: 'En Progreso',
      COMPLETED: 'Completado',
    };

    return <span className={`badge ${styles[status] || 'badge-pending'}`}>{labels[status] || status}</span>;
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {isProvider
              ? 'Gestiona tus servicios y reservas'
              : 'Encuentra profesionales para tu hogar'}
          </p>
        </div>
        <div className="flex gap-3">
          {isProvider && (
            <button className="btn-primary flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Nuevo Servicio
            </button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Reservas"
          value={stats.totalBookings}
          icon={Calendar}
          trend="Desde el inicio"
          isPrimary
        />
        <StatCard
          title="Pendientes"
          value={stats.pendingBookings}
          icon={Clock}
        />
        <StatCard
          title="En Progreso"
          value={stats.inProgressBookings}
          icon={TrendingUp}
        />
        <StatCard
          title="Completadas"
          value={stats.completedBookings}
          icon={CheckCircle}
        />
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Reservas Recientes</h2>
            <a href="/bookings" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
              Ver todas →
            </a>
          </div>

          {recentBookings.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No tienes reservas aún</p>
              {!isProvider && (
                <a href="/services" className="btn-primary mt-4 inline-block">
                  Buscar Servicios
                </a>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {booking.service?.title || 'Servicio'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isProvider
                        ? `${booking.client?.firstName} ${booking.client?.lastName}`
                        : `${booking.provider?.firstName} ${booking.provider?.lastName}`}
                    </p>
                  </div>
                  {getStatusBadge(booking.status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Side Cards */}
        <div className="space-y-6">
          {/* Quick Stats for Provider */}
          {isProvider && (
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Tu Perfil</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.firstName?.[0] || 'P'}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-gray-700 text-sm">4.8 (24 reseñas)</span>
                  </div>
                </div>
              </div>
              <button className="w-full btn-secondary">
                Editar Perfil
              </button>
            </div>
          )}

          {/* Time Tracker Style Card */}
          <div className="card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
            <h3 className="font-semibold mb-4">Tiempo Activo</h3>
            <div className="text-4xl font-bold font-mono mb-4">01:24:08</div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
              </button>
              <button className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Pause className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Team/Collaboration Placeholder */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Equipo</h3>
              <button className="text-sm text-orange-600 hover:text-orange-700">
                + Invitar
              </button>
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 border-2 border-white flex items-center justify-center text-white text-xs font-medium"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-gray-600 text-xs font-medium">
                +5
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
