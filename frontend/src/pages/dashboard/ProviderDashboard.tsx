import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Zap, 
  Globe, 
  List,
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { useAuthStore } from '../../app/stores';

interface DashboardStats {
  monthRevenue: number;
  activeJobs: number;
  rating: number;
}

interface Booking {
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

export function ProviderDashboard() {
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
         requestsService.getNearbyOpen() // Fetch strict personalized leads for dashboard
      ]);

      const myBookings = bookingsRes.data || [];
      const myQuotes = quotes || [];

      // Calculate Revenue (Accepted / Completed)
      const revenue = myQuotes
        .filter(q => q.status === 'ACCEPTED')
        .reduce((acc, q) => acc + q.price, 0);

      const activeCount = myBookings.filter((b: any) => 
        ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)
      ).length;

      // Find Next Job (Simplified logic: first accepted/in-progress)
      // In a real app, sort by date.
      const upcoming = myBookings.find((b: any) => 
        ['ACCEPTED', 'IN_PROGRESS'].includes(b.status)
      );

      setStats({
          monthRevenue: revenue,
          activeJobs: activeCount,
          rating: (user as any)?.avgRating || 0 // Assuming user object has rating
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20 pt-6 px-4 md:px-8">
      
      {/* 1. HERO SECTION */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 mb-2"
             >
                <div className={`w-2 h-2 rounded-full ${user?.isOnline ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {user?.isOnline ? 'En Línea' : 'Desconectado'}
                </span>
             </motion.div>
             <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                {getTimeGreeting()}, <span className="text-gray-400">{user?.firstName}</span>
             </h1>
          </div>
          <div className="flex gap-3">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 min-w-[140px]">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Este Mes</p>
                  <p className="text-2xl font-bold text-white font-mono">${stats.monthRevenue.toLocaleString()}</p>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 min-w-[140px]">
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Activos</p>
                  <div className="flex items-center gap-2">
                     <p className="text-2xl font-bold text-primary-500">{stats.activeJobs}</p>
                     <Briefcase className="w-4 h-4 text-gray-600" />
                  </div>
              </div>
          </div>
      </section>

      {/* 2. UP NEXT (AGENDA PREVIEW) */}
      <section>
          <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Próximo Trabajo
               </h3>
               <button onClick={() => navigate('/my-jobs')} className="text-xs text-primary-500 font-bold hover:underline">Ver Agenda</button>
          </div>
          
          {nextBooking ? (
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group hover:border-gray-700 transition-colors cursor-pointer" onClick={() => navigate('/my-jobs')}>
                   <div className="absolute top-0 right-0 p-4 opacity-50">
                       <Zap className="w-24 h-24 text-gray-800 -mr-8 -mt-8 transform rotate-12" />
                   </div>
                   <div className="relative z-10 flex justify-between items-center">
                       <div>
                           <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-green-500/20 mb-3 inline-block">
                               En Curso
                           </span>
                           <h2 className="text-xl font-bold text-white mb-1">{nextBooking.request?.title || 'Servicio Privado'}</h2>
                           <p className="text-gray-400 text-sm flex items-center gap-2">
                               <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                               Cliente: {nextBooking.client.firstName} {nextBooking.client.lastName}
                           </p>
                       </div>
                       <ChevronRight className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors" />
                   </div>
              </div>
          ) : (
             <div className="bg-gray-900/30 border border-dashed border-gray-800 rounded-2xl p-8 text-center">
                 <p className="text-gray-500 text-sm">No tienes trabajos programados próximamente.</p>
                 <button onClick={() => navigate('/leads', { state: { initialTab: 'OPPORTUNITIES' } })} className="mt-3 text-primary-500 font-bold text-sm hover:underline">Buscar Oportunidades</button>
             </div>
          )}
      </section>

      {/* 3. OPPORTUNITIES PREVIEW & SHORTCUTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Recent Leads List */}
          <div className="md:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                   <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      Nuevas Solicitudes
                   </h3>
                   <button onClick={() => navigate('/leads', { state: { initialTab: 'OPPORTUNITIES' } })} className="text-xs text-primary-500 font-bold hover:underline">Explorar Todo</button>
              </div>

              <div className="space-y-3">
                  {recentLeads.length > 0 ? recentLeads.map(lead => (
                      <div key={lead.id} className="bg-gray-900/50 border border-gray-800 hover:border-gray-700 rounded-xl p-4 flex items-center justify-between group cursor-pointer transition-colors" onClick={() => navigate(`/leads/${lead.id}`)}>
                          <div>
                              <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded uppercase">{lead.category}</span>
                                  <span className="text-[10px] text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3"/> {lead.zone}</span>
                              </div>
                              <h4 className="text-white font-bold text-sm truncate max-w-[200px] sm:max-w-md">{lead.title}</h4>
                          </div>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-500 transition-colors" />
                      </div>
                  )) : (
                      <div className="text-center py-8 text-gray-500 text-xs bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
                          Sin oportunidades nuevas en tu zona.
                      </div>
                  )}
              </div>
          </div>

          {/* Quick Actions / Menu */}
          <div>
               <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-4">
                  <List className="w-4 h-4" />
                  Accesos Directos
               </h3>
               <div className="grid gap-3">
                  <button onClick={() => navigate('/my-jobs')} className="bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-all group">
                      <div className="bg-blue-500/10 w-fit p-2 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                          <Calendar className="w-5 h-5 text-blue-500" />
                      </div>
                      <span className="block text-white font-bold text-sm">Mi Agenda</span>
                      <span className="text-xs text-gray-500">Gestionar trabajos</span>
                  </button>
                  <button onClick={() => navigate('/leads', { state: { initialTab: 'OPPORTUNITIES' } })} className="bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-all group">
                      <div className="bg-primary-500/10 w-fit p-2 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                          <Globe className="w-5 h-5 text-primary-500" />
                      </div>
                      <span className="block text-white font-bold text-sm">Búsqueda</span>
                      <span className="text-xs text-gray-500">Encontrar clientes</span>
                  </button>
                  <button onClick={() => navigate('/leads', { state: { initialTab: 'MY_QUOTES' } })} className="bg-gray-900 border border-gray-800 hover:bg-gray-800 p-4 rounded-xl text-left transition-all group">
                      <div className="bg-purple-500/10 w-fit p-2 rounded-lg mb-3 group-hover:scale-110 transition-transform">
                          <DollarSign className="w-5 h-5 text-purple-500" />
                      </div>
                      <span className="block text-white font-bold text-sm">Presupuestos</span>
                      <span className="text-xs text-gray-500">Historial enviado</span>
                  </button>
               </div>
          </div>
      </div>

    </div>
  );
}
