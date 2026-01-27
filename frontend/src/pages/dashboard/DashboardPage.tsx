import { useAuthStore } from '../../app/stores';
import { ClientDashboard } from './ClientDashboard';
import { ProviderLeads } from '../requests/ProviderLeads';

export function DashboardPage() {
  const { user } = useAuthStore();

  if (user?.role === 'CLIENT') {
    return (
      <div className="animate-fade-in min-h-screen pb-12">
        <ClientDashboard />
      </div>
    );
  }

  // Provider Dashboard
  return (
    <div className="animate-fade-in min-h-screen pb-12">
       {/* Dashboard Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
         <div>
           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
             Hola, {user?.firstName}
           </h1>
           <p className="text-gray-500 dark:text-gray-400">
             Gestiona tus oportunidades y mantente activo
           </p>
         </div>
       </div>

       {/* Main Content Area */}
       <div className="grid grid-cols-1 gap-8">
         {!user?.isOnline && (
           <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-xl flex items-center gap-3 text-yellow-800 dark:text-yellow-200">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              Estás desconectado. Activa tu estado "En línea" en el header para recibir notificaciones.
           </div>
         )}
         <h2 className="text-xl font-bold text-gray-900 dark:text-white">Solicitudes en tu zona</h2>
         <ProviderLeads />
       </div>
    </div>
  );
}

