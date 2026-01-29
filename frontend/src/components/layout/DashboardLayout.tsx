import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Send,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  HelpCircle,
  Menu,
  X,
  Power,
  ChevronRight,
  Layers,
  Globe,
  Users,
  PlusCircle,
  User,
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../app/stores';
import { NotificationsDropdown } from '../notifications';
import { BrandLogo } from '../ui/BrandLogo';
import { socketService } from '../../infra/realtime';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [togglingOnline, setTogglingOnline] = useState(false);

  const toggleOnline = async () => {
    if (!user) return;
    setTogglingOnline(true);
    try {
      await httpClient.patch('/auth/me', { isOnline: !user.isOnline });
      await loadUser();
    } catch (error) {
      console.error('Error toggling online status', error);
    } finally {
      setTogglingOnline(false);
    }
  };

  const handleLogout = () => {
    socketService.disconnect();
    logout();
    navigate('/login');
  };

  useEffect(() => {
    socketService.connect();
    socketService.connectChat();
    return () => socketService.disconnect();
  }, []);

  const isProvider = user?.role === 'PROVIDER';

  const menuItems = [
    { icon: Home, label: 'Inicio', path: '/dashboard', description: 'Tu centro de control' },
    { icon: PlusCircle, label: 'Solicitar Servicio', path: '/request-wizard', hide: isProvider, description: 'Nueva solicitud general' },
    { icon: Users, label: 'Profesionales', path: '/professionals', hide: isProvider, description: 'Directorio de trabajadores' },
    // Client specific
    { icon: Layers, label: 'Mis Solicitudes', path: '/my-requests', hide: isProvider, description: 'Estado de tus solicitudes' },
    
    // Provider specific
    { icon: Globe, label: 'Panel Profesional', path: '/leads', hide: !isProvider, description: 'Tu centro de trabajo' },
    { icon: User, label: 'Mi Perfil Profesional', path: '/my-services', hide: !isProvider, description: 'Gestionar perfil y servicios' },
    
    // Common
    { icon: Calendar, label: 'Reservas', path: '/my-jobs', hide: !isProvider, description: 'Trabajos confirmados' },
    { icon: MessageSquare, label: 'Chat', path: '/chat', description: 'Conversaciones' },
  ];

  const generalItems = [
    { icon: Settings, label: 'Ajustes', path: '/settings' },
    { icon: HelpCircle, label: 'Ayuda', path: '/help' },
  ];

  const NavItem = ({ icon: Icon, label, path, description }: { icon: any; label: string; path: string; description?: string }) => (
    <NavLink
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `group flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-lg shadow-primary-500/20' 
            : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            isActive 
              ? 'bg-white/20' 
              : 'bg-gray-800 group-hover:bg-gray-700'
          }`}>
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-medium">{label}</span>
            {description && (
              <p className={`text-xs truncate ${isActive ? 'text-white/70' : 'text-gray-600'}`}>
                {description}
              </p>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white/70' : 'text-gray-600'}`} />
        </>
      )}
    </NavLink>
  );

  const SimpleNavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <NavLink
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm transition-all ${
          isActive 
            ? 'text-primary-400 bg-primary-500/10' 
            : 'text-gray-500 hover:text-white hover:bg-gray-800/50'
        }`
      }
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex">
      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gray-900 rounded-xl shadow-lg border border-gray-800"
      >
        {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </motion.button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-gray-900/95 backdrop-blur-xl border-r border-gray-800 flex flex-col transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center py-6 border-b border-gray-800">
          <BrandLogo variant="sidebar" className="filter brightness-0 invert" />
        </div>

        {/* User Quick Card */}
        <div className="mx-4 my-4 p-4 bg-gray-800/50 rounded-xl border border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role === 'PROVIDER' ? 'Profesional' : 'Cliente'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 mb-3">
            Navegación
          </p>
          {menuItems
            .filter((item) => !item.hide)
            .map((item) => (
              <NavItem key={item.path} {...item} />
            ))}

          <div className="my-6 mx-4 border-t border-gray-800" />

          <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest px-4 mb-2">
            Sistema
          </p>
          {generalItems.map((item) => (
            <SimpleNavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 space-y-2 border-t border-gray-800">
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl px-4 sm:px-6 py-4">
          <div className="flex items-center justify-end gap-4">
            
            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Chat Quick Access */}
              <button 
                onClick={() => navigate('/chat')}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all relative group"
                title="Ir al Chat"
              >
                <Send className="w-6 h-6 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {/* Provider Online Toggle */}
              {isProvider && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleOnline}
                  disabled={togglingOnline}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    user?.isOnline 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${user?.isOnline ? 'bg-white animate-pulse' : 'bg-gray-500'}`} />
                  <span className="hidden sm:inline">{user?.isOnline ? 'Disponible' : 'No disponible'}</span>
                  <Power className="w-4 h-4 sm:hidden" />
                </motion.button>
              )}
              
              {/* Notifications */}
              <NotificationsDropdown />

              {/* User Avatar (Mobile) */}
              <div className="lg:hidden w-9 h-9 bg-gradient-to-br from-primary-400 to-orange-500 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {user?.firstName?.[0] || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
