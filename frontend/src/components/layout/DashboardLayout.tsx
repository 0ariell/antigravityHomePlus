import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Search,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  HelpCircle,
  Briefcase,
  Menu,
  X,
  Sun,
  Moon,
  Power,
  ChevronRight,
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../app/stores';
import { NotificationsDropdown } from '../notifications';
import { socketService } from '../../infra/realtime';

export function DashboardLayout() {
  const navigate = useNavigate();
  const { user, logout, loadUser } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [togglingOnline, setTogglingOnline] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

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
    { icon: Search, label: 'Buscar', path: '/services', hide: isProvider, description: 'Encontrar profesionales' },
    { icon: Briefcase, label: 'Mis Servicios', path: '/my-services', hide: !isProvider, description: 'Gestionar servicios' },
    { icon: Calendar, label: 'Trabajos', path: '/my-jobs', description: 'Ver pedidos y reservas' },
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
            ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/25' 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
            isActive 
              ? 'bg-white/20' 
              : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-primary-100 dark:group-hover:bg-primary-900/30'
          }`}>
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="font-medium">{label}</span>
            {description && (
              <p className={`text-xs truncate ${isActive ? 'text-white/70' : 'text-gray-400'}`}>
                {description}
              </p>
            )}
          </div>
          <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'text-white/70' : 'text-gray-400'}`} />
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
            ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-500/10' 
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/30'
        }`
      }
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex">
      {/* Mobile Menu Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-800/95 dark:backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-700/50 flex flex-col transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 flex justify-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HomePlus" className="h-28 w-auto max-w-full object-contain" />
          </div>
        </div>

        {/* User Quick Card */}
        <div className="mx-4 mb-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
              {user?.firstName?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 dark:text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role === 'PROVIDER' ? 'Profesional' : 'Cliente'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-3">
            Navegación
          </p>
          {menuItems
            .filter((item) => !item.hide)
            .map((item) => (
              <NavItem key={item.path} {...item} />
            ))}

          <div className="my-6 mx-4 border-t border-gray-100 dark:border-gray-700/50" />

          <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-4 mb-2">
            Sistema
          </p>
          {generalItems.map((item) => (
            <SimpleNavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 space-y-2 border-t border-gray-100 dark:border-gray-700/50">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/30 transition-colors"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{isDarkMode ? 'Modo claro' : 'Modo oscuro'}</span>
          </button>
          
          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 py-2.5 px-4 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-lg ml-12 lg:ml-0">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar servicios, profesionales..."
                  className="w-full pl-11 pr-4 py-2.5 bg-gray-100/80 dark:bg-gray-700/50 text-gray-900 dark:text-white border border-transparent rounded-xl text-sm placeholder-gray-400 focus:bg-white dark:focus:bg-gray-700 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Provider Online Toggle */}
              {isProvider && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleOnline}
                  disabled={togglingOnline}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                    user?.isOnline 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25'
                      : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full ${user?.isOnline ? 'bg-white animate-pulse' : 'bg-gray-400'}`} />
                  <span className="hidden sm:inline">{user?.isOnline ? 'Disponible' : 'No disponible'}</span>
                  <Power className="w-4 h-4 sm:hidden" />
                </motion.button>
              )}
              
              {/* Notifications */}
              <NotificationsDropdown />

              {/* User Avatar (Mobile) */}
              <div className="lg:hidden w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
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
