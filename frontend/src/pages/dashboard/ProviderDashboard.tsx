import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Star, 
  DollarSign,
  Clock,
  MapPin,
  ChevronRight,
  Zap,
  Users,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { SkeletonStats, SkeletonCard } from '../../ui';

interface ProviderStats {
  activeJobs: number;
  completedJobs: number;
  pendingQuotes: number;
  monthlyEarnings: number;
  rating: number;
  totalReviews: number;
}

interface LeadRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  urgency: string;
  budget: number | null;
  createdAt: string;
  client: {
    firstName: string;
    lastName: string;
  };
}

export function ProviderDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<ProviderStats>({
    activeJobs: 0,
    completedJobs: 0,
    pendingQuotes: 0,
    monthlyEarnings: 0,
    rating: 0,
    totalReviews: 0,
  });
  const [leads, setLeads] = useState<LeadRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, leadsRes] = await Promise.all([
        httpClient.get('/bookings/my-bookings').catch(() => ({ data: [] })),
        httpClient.get('/service-requests').catch(() => ({ data: { data: [] } })),
      ]);

      const bookings = bookingsRes.data || [];
      const leadsData = leadsRes.data?.data || [];

      const activeJobs = bookings.filter((b: any) => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length;
      const completedJobs = bookings.filter((b: any) => b.status === 'COMPLETED').length;
      const pendingQuotes = bookings.filter((b: any) => b.status === 'PENDING').length;
      
      // Mock earnings calculation
      const monthlyEarnings = bookings
        .filter((b: any) => b.status === 'COMPLETED')
        .reduce((sum: number, b: any) => sum + (b.quotedPrice || 0), 0);

      setStats({
        activeJobs,
        completedJobs,
        pendingQuotes,
        monthlyEarnings,
        rating: (user as any)?.avgRating || 0,
        totalReviews: (user as any)?.totalReviews || 0,
      });

      setLeads(leadsData.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace menos de 1h';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  };

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    subtext,
    color,
    onClick 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    subtext?: string;
    color: string;
    onClick?: () => void;
  }) => (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`card p-5 cursor-pointer group ${onClick ? 'hover:shadow-xl' : ''}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
        )}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      {subtext && <p className="text-xs text-gray-400 mt-1">{subtext}</p>}
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-64" />
          </div>
        </div>
        <SkeletonStats />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-2 text-gray-900 dark:text-white flex items-center gap-3">
            Hola, {user?.firstName}
            <Zap className="w-7 h-7 text-primary-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            {user?.isOnline 
              ? '✨ Estás disponible para recibir trabajos' 
              : '⏸️ Estás en modo offline'}
          </p>
        </div>

        {/* Quick Stats Badge */}
        <div className="flex items-center gap-3">
          {stats.rating > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-500/10 rounded-xl border border-yellow-200 dark:border-yellow-500/30">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-yellow-700 dark:text-yellow-400">{stats.rating.toFixed(1)}</span>
              <span className="text-sm text-yellow-600/70 dark:text-yellow-400/70">({stats.totalReviews})</span>
            </div>
          )}
        </div>
      </div>

      {/* Online Status Warning */}
      {!user?.isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl flex items-center gap-4"
        >
          <div className="w-10 h-10 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-amber-800 dark:text-amber-300">Estás en modo offline</p>
            <p className="text-sm text-amber-600 dark:text-amber-400/80">Activá "Disponible" en el header para recibir nuevas solicitudes</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Briefcase} 
          label="Trabajos activos" 
          value={stats.activeJobs}
          color="from-blue-500 to-blue-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={Clock} 
          label="Por responder" 
          value={stats.pendingQuotes}
          subtext="solicitudes pendientes"
          color="from-amber-500 to-orange-500"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Completados" 
          value={stats.completedJobs}
          subtext="este mes"
          color="from-green-500 to-emerald-500"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={DollarSign} 
          label="Ganancias" 
          value={`$${stats.monthlyEarnings.toLocaleString()}`}
          subtext="este mes"
          color="from-purple-500 to-violet-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Section - Takes 2 columns */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Solicitudes en tu zona</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Nuevas oportunidades de trabajo</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/leads')}
              className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-gray-300 dark:text-gray-500" />
              </div>
              <h3 className="font-medium text-gray-900 dark:text-white mb-1">Sin solicitudes por ahora</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Las nuevas solicitudes en tu zona aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/leads/${lead.id}`)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 text-xs font-semibold rounded-full">
                          {lead.category}
                        </span>
                        {lead.urgency === 'urgent' && (
                          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 text-xs font-semibold rounded-full">
                            Urgente
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {lead.title}
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                        {lead.description}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {lead.client.firstName}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {lead.zone}
                        </span>
                        <span>{formatTimeAgo(lead.createdAt)}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      {lead.budget && (
                        <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                          ${lead.budget.toLocaleString()}
                        </p>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all ml-auto" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Performance Card */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Tu rendimiento
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Tasa de respuesta</span>
                  <span className="font-semibold text-gray-900 dark:text-white">85%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Trabajos completados</span>
                  <span className="font-semibold text-gray-900 dark:text-white">92%</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full" />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-500 dark:text-gray-400">Satisfacción</span>
                  <span className="font-semibold text-gray-900 dark:text-white">4.8/5</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full w-[96%] bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Acciones rápidas</h3>
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/my-services')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Mis servicios</span>
                  <p className="text-xs text-gray-500">Gestionar catálogo</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/chat')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Mensajes</span>
                  <p className="text-xs text-gray-500">Ver conversaciones</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-left group"
              >
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">Mi perfil</span>
                  <p className="text-xs text-gray-500">Editar información</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
