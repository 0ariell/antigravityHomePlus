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
  ArrowRight,
  Users,
  Plus
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';

const QUICK_CATEGORIES = [
  { id: 'plomeria', label: 'Plomería', icon: Droplet, gradient: 'from-blue-500 to-cyan-500' },
  { id: 'electricidad', label: 'Electricidad', icon: Zap, gradient: 'from-amber-400 to-orange-500' },
  { id: 'pintura', label: 'Pintura', icon: PaintBucket, gradient: 'from-pink-500 to-rose-500' },
  { id: 'reparaciones', label: 'Reparaciones', icon: Wrench, gradient: 'from-gray-400 to-slate-500' },
  { id: 'construccion', label: 'Construcción', icon: Home, gradient: 'from-emerald-400 to-green-600' },
];

export function ClientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [activeJobs, setActiveJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const bookingsRes = await httpClient.get('/bookings/my-bookings').catch(() => ({ data: [] }));
      const bookings = bookingsRes.data || [];

      // Get Active Jobs for Tracker
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

  if (isLoading) {
    return (
      <div className="space-y-8 min-h-screen bg-gray-950 p-4">
         <div className="h-20 w-3/4 bg-gray-900 rounded-2xl animate-pulse mx-auto" />
         <div className="grid grid-cols-2 gap-4">
             <div className="h-40 bg-gray-900 rounded-3xl animate-pulse" />
             <div className="h-40 bg-gray-900 rounded-3xl animate-pulse" />
         </div>
      </div>
    );
  }

  // Determine Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 20 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <div className="min-h-screen bg-gray-950 pb-24 font-sans text-gray-200 animate-fade-in relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto space-y-10">
        
        {/* Elegant Greeting */}
        <header className="pt-4 md:pt-8 px-2 md:px-0">
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight font-display mb-2">
                    {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">{user?.firstName}</span>
                </h1>
                <p className="text-xl text-gray-400 font-light">Transformemos tu espacio hoy.</p>
            </motion.div>
        </header>

        {/* Dual Actions (Hero Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Find Talent CTA */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/services')}
                className="group cursor-pointer relative h-64 rounded-[2rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 text-white">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Explorar Talentos</h2>
                    <p className="text-gray-300 text-sm mb-4">Arquitectos, plomeros y especialistas verificados.</p>
                    
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                        Buscar ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>

            {/* Request Service CTA */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/request-wizard')}
                className="group cursor-pointer relative h-64 rounded-[2rem] overflow-hidden bg-gradient-to-br from-primary-900/50 to-gray-900 border border-primary-500/20 shadow-2xl"
            >
                {/* Abstract texture */}
                <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="url(#grad1)" />
                        <defs>
                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className="stop-color-primary-500" stopOpacity="1" />
                            <stop offset="100%" className="stop-color-purple-500" stopOpacity="1" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-primary-500/30 text-white">
                        <Plus className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Iniciar Proyecto</h2>
                    <p className="text-gray-300 text-sm mb-4">Describe tu idea, nosotros la hacemos realidad.</p>
                    
                    <div className="flex items-center gap-2 text-primary-400 font-bold text-sm">
                        Crear solicitud <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Discovery & Quick Access */}
        <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-lg font-bold text-white">Categorías Populares</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {QUICK_CATEGORIES.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => navigate(`/services?category=${cat.label}`)}
                        className="flex flex-col items-center gap-3 min-w-[5rem] group"
                    >
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${cat.gradient} p-0.5 shadow-lg group-hover:scale-105 transition-transform`}>
                            <div className="w-full h-full bg-gray-900 rounded-[14px] flex items-center justify-center">
                                <cat.icon className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <span className="text-xs font-medium text-gray-400 group-hover:text-white transition-colors">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* Active Jobs Tracker */}
        {activeJobs.length > 0 && (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-500" /> Seguimiento en vivo
                    </h3>
                </div>
                
                <div className="grid gap-4">
                    {activeJobs.map((job) => (
                        <div key={job.id} className="bg-gray-900 p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
                             {/* Progress Bar (Mocked for visual effect) */}
                             <div className="absolute top-0 left-0 h-1 bg-gray-800 w-full">
                                <div className="h-full bg-green-500 w-[60%] shadow-[0_0_10px_rgba(34,197,94,0.5)]" /> 
                             </div>

                             <div className="flex justify-between items-start mb-6 pt-2">
                                 <div>
                                     <div className="text-xs font-bold text-green-500 uppercase tracking-wider mb-1">En Progreso</div>
                                     <h4 className="text-xl font-bold text-white">{job.service?.title || 'Servicio Activo'}</h4>
                                     <p className="text-sm text-gray-500">Proveedor: {job.provider?.firstName} {job.provider?.lastName}</p>
                                 </div>
                                 <div className="w-12 h-12 rounded-full bg-gray-800 overflow-hidden border-2 border-gray-700">
                                     {job.provider?.avatarUrl ? (
                                         <img src={job.provider.avatarUrl} className="w-full h-full object-cover" />
                                     ) : (
                                         <div className="w-full h-full flex items-center justify-center text-gray-500">{job.provider?.firstName?.[0]}</div>
                                     )}
                                 </div>
                             </div>

                             <div className="flex items-center justify-between bg-gray-950/50 p-4 rounded-xl border border-gray-800">
                                 <div className="flex flex-col">
                                     <span className="text-xs text-gray-500">Entrega Estimada</span>
                                     <span className="font-bold text-white">Mañana, 14:00hs</span>
                                 </div>
                                 <button 
                                    onClick={() => navigate('/chat', { state: { bookingId: job.id } })}
                                    className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition"
                                >
                                     Ver Detalles
                                 </button>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Trending / Inspiration Section (Static Mock) */}
        <div className="space-y-4 pb-8">
            <h3 className="text-lg font-bold text-white px-2">Inspiración para tu hogar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="h-48 rounded-[2rem] bg-gray-800 relative overflow-hidden group cursor-pointer border border-gray-800">
                     <img src="https://images.unsplash.com/photo-1540932296774-70974839840c?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                     <div className="absolute bottom-5 left-5">
                         <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase mb-2 inline-block">Tendencia</span>
                         <h4 className="text-xl font-bold text-white">Domótica Fácil</h4>
                     </div>
                 </div>
                 <div className="h-48 rounded-[2rem] bg-gray-800 relative overflow-hidden group cursor-pointer border border-gray-800">
                     <img src="https://images.unsplash.com/photo-1584622050111-993a426fbf0a?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                     <div className="absolute bottom-5 left-5">
                         <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase mb-2 inline-block">Tips</span>
                         <h4 className="text-xl font-bold text-white">Renueva tu baño</h4>
                     </div>
                 </div>
            </div>
        </div>

      </div>
    </div>
  );
}
