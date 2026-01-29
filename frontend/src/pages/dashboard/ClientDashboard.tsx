import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Clock,
  ArrowRight,
  Users,
  AlertCircle
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';


function ActiveJobCard({ job, navigate }: { job: any, navigate: any }) {
  const [duration, setDuration] = useState<string>('00:00:00');

  useEffect(() => {
    if (!job.startedAt && job.status !== 'IN_PROGRESS') return;

    const interval = setInterval(() => {
      const start = job.startedAt ? new Date(job.startedAt).getTime() : new Date(job.createdAt).getTime(); // Fallback if no startedAt yet
      const now = new Date().getTime();
      const diff = Math.max(0, now - start);
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setDuration(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [job]);

  return (
    <div className="bg-gray-900 p-6 rounded-3xl border border-gray-800 relative overflow-hidden">
        {/* Progress Bar Animation */}
        <div className="absolute top-0 left-0 h-1 bg-gray-800 w-full">
          <div className="h-full bg-green-500 w-[60%] shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse" /> 
        </div>

        <div className="flex justify-between items-start mb-6 pt-2">
            <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <div className="text-xs font-bold text-green-500 uppercase tracking-wider">En Progreso</div>
                </div>
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
                <span className="text-xs text-gray-500 mb-1">Tiempo Transcurrido</span>
                <span className="font-mono text-xl font-bold text-white tracking-widest">{duration}</span>
            </div>
            <button 
              onClick={() => navigate('/chat', { state: { bookingId: job.id } })}
              className="px-4 py-2 bg-gray-800 text-white text-sm font-bold rounded-lg hover:bg-gray-700 transition"
            >
                  Ver Detalles
            </button>
        </div>
    </div>
  );
}

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
                <p className="text-xl text-gray-400 font-light">¿Qué problema solucionamos hoy?</p>
            </motion.div>
        </header>

        {/* Dual Actions (Hero Section) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Urgent Request CTA */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/request-wizard')}
                className="group cursor-pointer relative h-64 rounded-[2rem] overflow-hidden bg-gradient-to-br from-red-600/80 to-orange-600/80 border border-red-500/30 shadow-2xl"
            >
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Abstract texture */}
                <div className="absolute inset-0 opacity-20">
                     <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <circle cx="90" cy="10" r="40" fill="white" />
                     </svg>
                </div>

                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-white/20 text-white">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">¡Solicitar Ayuda!</h2>
                    <p className="text-white/80 text-sm mb-4">¿Algo se rompió? ¿Necesitas algo urgente? </p>
                    
                    <div className="flex items-center gap-2 text-white font-bold text-sm bg-black/20 w-fit px-3 py-1.5 rounded-lg border border-white/10 group-hover:bg-black/30 transition-colors">
                        Resolver Ahora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>

            {/* Find Professionals CTA */}
            <motion.div 
                whileHover={{ scale: 1.02 }}
                onClick={() => navigate('/professionals')}
                className="group cursor-pointer relative h-64 rounded-[2rem] overflow-hidden bg-gray-900 border border-gray-800 shadow-xl"
            >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/60 to-transparent" />
                
                <div className="absolute bottom-0 left-0 p-8 w-full">
                    <div className="w-12 h-12 bg-primary-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 border border-primary-500/20 text-primary-500">
                        <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Encontrar Profesionales</h2>
                    <p className="text-gray-300 text-sm mb-4">Busca y contacta directamente con expertos verificados en tu zona.</p>
                    
                    <div className="flex items-center gap-2 text-primary-400 font-bold text-sm">
                        Explorar Directorio <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Active Jobs Tracker */}
        {activeJobs.length > 0 && (
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary-500" /> Seguimiento de Servicios
                    </h3>
                </div>
                
                <div className="grid gap-4">
                    {activeJobs.map((job) => (
                        <ActiveJobCard key={job.id} job={job} navigate={navigate} />
                    ))}
                </div>
            </div>
        )}

        {/* Inspiration Section */}
        <div className="space-y-4 pb-8">
            <h3 className="text-lg font-bold text-white px-2">Ideas para mejorar</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="h-48 rounded-[2rem] bg-gray-800 relative overflow-hidden group cursor-pointer border border-gray-800">
                     <img src="https://images.unsplash.com/photo-1540932296774-70974839840c?q=80&w=2670&auto=format&fit=crop" className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                     <div className="absolute bottom-5 left-5">
                         <span className="px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold text-white uppercase mb-2 inline-block">Mantenimiento</span>
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
