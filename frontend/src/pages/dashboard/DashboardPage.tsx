import { useAuthStore } from '../../app/stores';
import { RequestWizard } from '../requests/RequestWizard';
import { ProviderLeads } from '../requests/ProviderLeads';

export function DashboardPage() {
  const { user } = useAuthStore();

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
                    Estás desconectado. Activa tu estado "En línea" en el header para recibir notificaciones.
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
