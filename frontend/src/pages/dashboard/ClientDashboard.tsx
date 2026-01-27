import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Droplet, 
  PaintBucket, 
  Wrench, 
  Home,
  Star,
  Clock,
  MessageSquare,
  TrendingUp,
  FileText,
  CheckCircle,
  ArrowRight,
  Bell,
  Briefcase,
  ChevronRight,
  Sparkles,
  Search
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { RequestWizard } from '../requests/RequestWizard';
import { SkeletonStats } from '../../ui';

interface DashboardStats {
  activeRequests: number;
  pendingQuotes: number;
  jobsInProgress: number;
  completedJobs: number;
}

interface RecentActivity {
  id: string;
  type: 'quote' | 'message' | 'status';
  title: string;
  description: string;
  time: string;
  link?: string;
}

interface TopProvider {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  avgRating: number;
  totalReviews: number;
  zone: string;
}

interface ActiveJob {
  id: string;
  title: string;
  status: string;
  providerName: string;
  updatedAt: string;
}

const QUICK_CATEGORIES = [
  { id: 'plomeria', label: 'Plomería', icon: Droplet, color: 'from-blue-500 to-blue-600', bgLight: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'electricidad', label: 'Electricidad', icon: Zap, color: 'from-yellow-500 to-yellow-600', bgLight: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: 'pintura', label: 'Pintura', icon: PaintBucket, color: 'from-pink-500 to-pink-600', bgLight: 'bg-pink-50 dark:bg-pink-900/20' },
  { id: 'reparaciones', label: 'Reparaciones', icon: Wrench, color: 'from-gray-500 to-gray-600', bgLight: 'bg-gray-100 dark:bg-gray-800' },
  { id: 'construccion', label: 'Construcción', icon: Home, color: 'from-orange-500 to-orange-600', bgLight: 'bg-orange-50 dark:bg-orange-900/20' },
];

export function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats>({
    activeRequests: 0,
    pendingQuotes: 0,
    jobsInProgress: 0,
    completedJobs: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
  const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Load stats from bookings and requests
      const [bookingsRes, requestsRes, providersRes] = await Promise.all([
        httpClient.get('/bookings/my-bookings').catch(() => ({ data: [] })),
        httpClient.get('/service-requests/my-requests').catch(() => ({ data: [] })),
        httpClient.get('/users/top-providers').catch(() => ({ data: [] }))
      ]);

      const bookings = bookingsRes.data || [];
      const requests = requestsRes.data || [];
      const providers = providersRes.data || [];

      // Calculate stats
      const activeRequests = requests.filter((r: any) => r.status === 'OPEN').length;
      const pendingQuotes = requests.reduce((acc: number, r: any) => acc + (r._count?.quotes || 0), 0);
      const jobsInProgress = bookings.filter((b: any) => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)).length;
      const completedJobs = bookings.filter((b: any) => b.status === 'COMPLETED').length;

      setStats({ activeRequests, pendingQuotes, jobsInProgress, completedJobs });

      // Build recent activity from real data
      const activity: RecentActivity[] = [];
      
      // Add recent bookings activity
      bookings.slice(0, 3).forEach((b: any) => {
        if (b.status === 'ACCEPTED') {
          activity.push({
            id: b.id,
            type: 'status',
            title: `Solicitud aceptada`,
            description: b.service?.title || 'Servicio',
            time: formatTimeAgo(b.updatedAt),
            link: '/my-jobs'
          });
        }
      });

      // Add pending quotes info
      requests.filter((r: any) => r._count?.quotes > 0).slice(0, 2).forEach((r: any) => {
        activity.push({
          id: r.id,
          type: 'quote',
          title: `${r._count.quotes} presupuesto(s) recibido(s)`,
          description: r.title,
          time: formatTimeAgo(r.updatedAt || r.createdAt),
          link: '/my-jobs'
        });
      });

      setRecentActivity(activity);
      setTopProviders(providers.slice(0, 4));

      // Active jobs
      const active = bookings
        .filter((b: any) => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status))
        .slice(0, 3)
        .map((b: any) => ({
          id: b.id,
          title: b.service?.title || 'Servicio Personalizado',
          status: b.status,
          providerName: `${b.provider?.firstName || 'Profesional'} ${b.provider?.lastName?.[0] || ''}.`,
          updatedAt: formatTimeAgo(b.updatedAt)
        }));
      setActiveJobs(active);

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
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `hace ${diffMins}m`;
    if (diffHours < 24) return `hace ${diffHours}h`;
    return `hace ${diffDays}d`;
  };

  const handleCategoryClick = (_category: string) => {
    // Show wizard - could pre-fill category via context or props in future
    setShowWizard(true);
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick }: { 
    icon: any; 
    label: string; 
    value: number; 
    color: string;
    onClick?: () => void;
  }) => (
    <button 
      onClick={onClick}
      className={`card p-5 text-left hover:shadow-md transition-all hover:-translate-y-0.5 ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white">{value}</span>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </button>
  );

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="skeleton h-8 w-48" />
            <div className="skeleton h-4 w-64" />
          </div>
          <div className="skeleton h-10 w-40 rounded-xl" />
        </div>
        <SkeletonStats />
        <div className="skeleton h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="heading-2 text-gray-900 dark:text-white flex items-center gap-2">
            Hola, {user?.firstName}
            <Sparkles className="w-6 h-6 text-primary-500" />
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            ¿Qué necesitas solucionar hoy?
          </p>
        </div>
        <button
          onClick={() => navigate('/services')}
          className="btn-secondary flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          Buscar Profesionales
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={FileText} 
          label="Pedidos activos" 
          value={stats.activeRequests} 
          color="from-blue-500 to-blue-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Presupuestos recibidos" 
          value={stats.pendingQuotes} 
          color="from-green-500 to-green-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={Clock} 
          label="Trabajos en curso" 
          value={stats.jobsInProgress} 
          color="from-orange-500 to-orange-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Completados" 
          value={stats.completedJobs} 
          color="from-purple-500 to-purple-600"
          onClick={() => navigate('/my-jobs')}
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-orange-500" />
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
          {QUICK_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.label)}
                className={`${cat.bgLight} p-4 rounded-xl text-center hover:scale-105 transition-transform group`}
              >
                <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-br ${cat.color} flex items-center justify-center mb-2 group-hover:shadow-lg transition-shadow`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main CTA Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 rounded-2xl p-6 md:p-8 text-white shadow-lg shadow-orange-500/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {showWizard ? 'Describe tu problema' : '¿Necesitas ayuda con algo?'}
          </h2>
          {!showWizard && (
            <>
              <p className="text-orange-100 text-lg mb-6 max-w-xl">
                Publica tu problema y recibe múltiples presupuestos de profesionales verificados en minutos.
              </p>
              <button 
                onClick={() => setShowWizard(true)}
                className="bg-white text-orange-600 font-semibold py-3 px-6 rounded-xl hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                Crear Pedido
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Request Wizard (conditionally shown) */}
      {showWizard && (
        <div className="animate-fade-in">
          <RequestWizard />
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Jobs */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-orange-500" />
              Trabajos Activos
            </h2>
            <button 
              onClick={() => navigate('/my-jobs')}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {activeJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No tenés trabajos en curso</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeJobs.map(job => (
                <button
                  key={job.id}
                  onClick={() => navigate('/my-jobs')}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{job.providerName}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      job.status === 'IN_PROGRESS' 
                        ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {job.status === 'IN_PROGRESS' ? 'En progreso' : 'Aceptado'}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{job.updatedAt}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-orange-500" />
              Actividad Reciente
            </h2>
          </div>

          {recentActivity.length === 0 ? (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Sin actividad reciente</p>
              <p className="text-sm">Cuando recibas presupuestos o mensajes, aparecerán aquí</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(activity => (
                <button
                  key={activity.id}
                  onClick={() => activity.link && navigate(activity.link)}
                  className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-start gap-3"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.type === 'quote' 
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : activity.type === 'message'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                  }`}>
                    {activity.type === 'quote' && <TrendingUp className="w-5 h-5" />}
                    {activity.type === 'message' && <MessageSquare className="w-5 h-5" />}
                    {activity.type === 'status' && <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">{activity.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{activity.time}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Providers */}
      {topProviders.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Profesionales Destacados
            </h2>
            <button 
              onClick={() => navigate('/services')}
              className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center gap-1"
            >
              Ver más <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {topProviders.map(provider => (
              <div 
                key={provider.id}
                className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-center hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-xl font-bold mb-3">
                  {provider.firstName?.[0] || 'P'}
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white">
                  {provider.firstName} {provider.lastName?.[0]}.
                </h4>
                <p className="text-sm text-orange-500 font-medium">{provider.category}</p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {provider.avgRating?.toFixed(1) || 'Nuevo'}
                  </span>
                  <span className="text-xs text-gray-400">({provider.totalReviews || 0})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
