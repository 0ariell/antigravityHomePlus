import { useEffect, useState } from 'react';
import { useAuthStore } from '../../app/stores';
import { RequestWizard } from '../requests/RequestWizard';
import { ProviderLeads } from '../requests/ProviderLeads';
import { httpClient } from '../../infra/http';
import { Sun, Moon, Power } from 'lucide-react';

export function DashboardPage() {
  const { user, loadUser } = useAuthStore();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const toggleOnline = async () => {
    if (!user) return;
    setTogglingOnline(true);
    try {
      // Call generic update profile
      await httpClient.patch('/auth/me', { isOnline: !user.isOnline });
      await loadUser(); // Refresh state
    } catch (error) {
      console.error('Error toggling online status', error);
      alert('Error al actualizar estado');
    } finally {
      setTogglingOnline(false);
    }
  };

  return (
    <div className="animate-fade-in min-h-screen pb-12">
       {/* Dashboard Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
             Hola, {user?.firstName}
           </h1>
           <p className="text-gray-500 dark:text-gray-400">
             {user?.role === 'PROVIDER' 
               ? 'Gestiona tus oportunidades y mantente activo'
               : 'Encuentra al profesional ideal para tu hogar'
             }
           </p>
         </div>

         <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Provider Online Toggle */}
            {user?.role === 'PROVIDER' && (
              <button
                onClick={toggleOnline}
                disabled={togglingOnline}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                  user.isOnline 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <Power className={`w-5 h-5 ${user.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                <span>{user.isOnline ? 'En línea' : 'Desconectado'}</span>
              </button>
            )}
         </div>
       </div>

       {/* Main Content Area */}
       <div className="grid grid-cols-1 gap-8">
          {user?.role === 'CLIENT' ? (
             <div>
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 md:p-10 text-white mb-8 shadow-lg shadow-orange-500/20">
                    <h2 className="text-3xl font-bold mb-2">¿Qué necesitas solucionar hoy?</h2>
                    <p className="text-orange-100 text-lg">
                      Describe tu problema y recibe presupuestos de profesionales verificados en minutos.
                    </p>
                </div>
                <RequestWizard />
             </div>
          ) : (
             <div>
               {!user?.isOnline && (
                 <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    Estás desconectado. No recibirás notificaciones de nuevas solicitudes.
                 </div>
               )}
               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Solicitudes en tu zona</h2>
               <ProviderLeads />
             </div>
          )}
       </div>
    </div>
  );
}
