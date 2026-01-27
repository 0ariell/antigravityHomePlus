import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Droplet, 
  PaintBucket, 
  Wrench, 
  Home,
  Clock,
  TrendingUp,
  FileText,
  CheckCircle,
  Search,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';
import { SkeletonStats } from '../../ui';
import { ProfessionalCard } from '../../ui/components/cards/ProfessionalCard';
import { BookingCard } from '../../ui/components/cards/BookingCard';

interface DashboardStats {
  activeRequests: number;
  pendingQuotes: number;
  jobsInProgress: number;
  completedJobs: number;
}

interface TopProvider {
  id: string;
  firstName: string;
  lastName: string;
  category: string;
  avgRating: number;
  totalReviews: number;
  zone: string; // Add zone to interface
  avatarUrl?: string;
  isOnline?: boolean;
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
  const [topProviders, setTopProviders] = useState<TopProvider[]>([]);
  const [activeJobs, setActiveJobs] = useState<any[]>([]); // Using any for flexibility with booking structure
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
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

      setTopProviders(providers.slice(0, 4));

      // Active jobs
      const active = bookings
        .filter((b: any) => ['ACCEPTED', 'IN_PROGRESS'].includes(b.status))
        .slice(0, 2);
      setActiveJobs(active);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setIsLoading(false);
    }
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
      className={`card p-5 text-left hover:shadow-xl transition-all hover:-translate-y-1 relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className={`absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full group-hover:scale-110 transition-transform`} />
      <div className="flex items-center justify-between mb-3 relative">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-gray-200 dark:shadow-none`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</span>
      </div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 relative">{label}</p>
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
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            ¿Qué necesitas solucionar hoy?
          </p>
        </div>
        <button
          onClick={() => navigate('/services')}
          className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
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
          color="from-blue-500 to-indigo-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={TrendingUp} 
          label="Presupuestos" 
          value={stats.pendingQuotes} 
          color="from-emerald-500 to-teal-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={Clock} 
          label="En curso" 
          value={stats.jobsInProgress} 
          color="from-orange-500 to-amber-600"
          onClick={() => navigate('/my-jobs')}
        />
        <StatCard 
          icon={CheckCircle} 
          label="Completados" 
          value={stats.completedJobs} 
          color="from-purple-500 to-violet-600"
          onClick={() => navigate('/my-jobs')}
        />
      </div>

      {/* Quick Actions */}
      <div className="card p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-800/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          ¿Qué estás buscando?
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {QUICK_CATEGORIES.map(cat => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => navigate(`/services?category=${cat.label}`)}
                className={`${cat.bgLight} p-6 rounded-2xl text-center hover:scale-105 transition-transform group border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-lg`}
              >
                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-3 group-hover:shadow-lg transition-shadow shadow-sm`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Jobs */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex items-center justify-between">
            <h2 className="heading-3 text-gray-900 dark:text-white">Trabajos en curso</h2>
            <button 
              onClick={() => navigate('/my-jobs')}
              className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          {activeJobs.length === 0 ? (
            <div className="card p-8 text-center bg-gray-50 dark:bg-gray-800/50 border-dashed">
              <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Clock className="w-8 h-8 text-gray-300 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No tienes trabajos en curso</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Los trabajos aceptados aparecerán aquí.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeJobs.map((job) => (
                <BookingCard
                  key={job.id}
                  id={job.id}
                  title={job.service?.title || 'Servicio Personalizado'}
                  description={job.description}
                  status={job.status}
                  date={new Date(job.createdAt).toLocaleDateString()}
                  price={job.quotedPrice}
                  counterParty={{
                    name: `${job.provider?.firstName} ${job.provider?.lastName}`,
                    role: 'Provider',
                    avatar: job.provider?.avatarUrl,
                    rating: job.provider?.avgRating
                  }}
                  onChat={() => navigate('/chat', { state: { bookingId: job.id } })}
                />
              ))}
            </div>
          )}
        </div>

        {/* Top Providers */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="heading-3 text-gray-900 dark:text-white">Profesionales Top</h2>
            <button className="text-primary-600 dark:text-primary-400 font-bold text-sm hover:underline flex items-center gap-1">
              Ver más <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            {topProviders.map((provider) => (
              <ProfessionalCard
                key={provider.id}
                id={provider.id}
                firstName={provider.firstName}
                lastName={provider.lastName}
                category={provider.category}
                rating={provider.avgRating}
                reviews={provider.totalReviews}
                zone={provider.zone || 'Buenos Aires'}
                avatarUrl={provider.avatarUrl}
                isOnline={provider.isOnline}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
