import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  Star, 
  DollarSign,
  MapPin,
  ChevronRight,
  Zap,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Briefcase
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { SkeletonStats, SkeletonCard } from '../../ui';
import { OpportunityCard } from '../../ui/components/cards/OpportunityCard';

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
    <motion.button
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left card p-5 relative overflow-hidden group ${onClick ? 'cursor-pointer hover:shadow-xl' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />
      
      <div className="flex items-start justify-between mb-4 relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-gray-200 dark:shadow-none`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {onClick && (
          <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
        )}
      </div>
      
      <div className="relative">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        {subtext && <p className="text-xs text-gray-400 mt-1 font-medium">{subtext}</p>}
      </div>
    </motion.button>
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
            <div className="bg-primary-500/10 p-2 rounded-xl">
              <Zap className="w-6 h-6 text-primary-500" />
            </div>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {user?.isOnline 
              ? '✨ Estás disponible para recibir trabajos' 
              : '⏸️ Estás en modo offline, actívate para recibir alertas'}
          </p>
        </div>

        {/* Quick Stats Badge */}
        <div className="flex items-center gap-3">
          {stats.rating > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-2xl border border-amber-100 dark:border-amber-500/20 shadow-sm">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <div className="flex flex-col items-start leading-none">
                <span className="font-bold text-amber-900 dark:text-amber-400 text-lg">{stats.rating.toFixed(1)}</span>
                <span className="text-[10px] text-amber-700 dark:text-amber-500 uppercase font-bold tracking-wide">{stats.totalReviews} Reseñas</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Online Status Warning */}
      {!user?.isOnline && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 rounded-2xl flex items-center gap-4 shadow-sm"
        >
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-500/20 rounded-full flex items-center justify-center animate-pulse">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-orange-800 dark:text-orange-300">Estás en modo offline</p>
            <p className="text-sm text-orange-600 dark:text-orange-400/80">Activá "Disponible" en el header para que los clientes te encuentren.</p>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Briefcase} 
          label="Trabajos activos" 
          value={stats.activeJobs}
          color="from-blue-500 to-indigo-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={Clock} 
          label="Por responder" 
          value={stats.pendingQuotes}
          subtext="Oportunidades"
          color="from-amber-500 to-orange-500"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Completados" 
          value={stats.completedJobs}
          subtext="Total histórico"
          color="from-green-500 to-emerald-500"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={DollarSign} 
          label="Ganancias" 
          value={`$${stats.monthlyEarnings.toLocaleString()}`}
          subtext="Este mes"
          color="from-purple-500 to-violet-600"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Leads Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Solicitudes en tu zona</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Oportunidades cercanas a tu ubicación</p>
              </div>
            </div>
            <button 
              onClick={() => navigate('/leads')}
              className="text-sm text-primary-600 dark:text-primary-400 font-bold hover:underline flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {leads.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-20 h-20 bg-white dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <MapPin className="w-8 h-8 text-gray-300 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Sin solicitudes por ahora</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                Las nuevas solicitudes en tu zona aparecerán aquí automáticamente.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leads.map((lead, index) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <OpportunityCard
                    id={lead.id}
                    title={lead.title}
                    description={lead.description}
                    category={lead.category}
                    zone={lead.zone}
                    urgency={lead.urgency}
                    budget={lead.budget}
                    createdAt={lead.createdAt}
                    clientName={`${lead.client.firstName} ${lead.client.lastName}`}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar Actions */}
        <div className="space-y-6">
          {/* Performance Card */}
          <div className="card p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-xl">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Tu rendimiento
            </h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between text-sm mb-2 opacity-90">
                  <span>Tasa de respuesta</span>
                  <span className="font-bold text-green-400">85%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-green-500 rounded-full" 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2 opacity-90">
                  <span>Trabajos completados</span>
                  <span className="font-bold text-blue-400">92%</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '92%' }}
                    className="h-full bg-blue-500 rounded-full" 
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-2 opacity-90">
                  <span>Satisfacción</span>
                  <span className="font-bold text-amber-400">4.8/5</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '96%' }}
                    className="h-full bg-amber-500 rounded-full" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Acciones rápidas</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/my-services')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 hover:bg-white hover:shadow-lg dark:hover:bg-gray-700 transition-all text-left group border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-gray-900 dark:text-white block">Mis servicios</span>
                  <p className="text-xs text-gray-500">Gestionar catálogo</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button 
                onClick={() => navigate('/chat')}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/30 hover:bg-white hover:shadow-lg dark:hover:bg-gray-700 transition-all text-left group border border-transparent hover:border-gray-100 dark:hover:border-gray-600"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <span className="font-bold text-gray-900 dark:text-white block">Mensajes</span>
                  <p className="text-xs text-gray-500">Ver conversaciones</p>
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
