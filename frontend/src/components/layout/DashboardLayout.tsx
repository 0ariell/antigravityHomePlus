import { NavLink, Outlet, useNavigate } from 'react-router-dom';
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
  Power
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
    // Check localStorage first, then system preference
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [togglingOnline, setTogglingOnline] = useState(false);

  useEffect(() => {
    // Apply dark mode class on mount
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
    // document.documentElement.classList.toggle('dark'); // REMOVED: useEffect handles this
  };

  const toggleOnline = async () => {
    if (!user) return;
    setTogglingOnline(true);
    try {
      await httpClient.patch('/auth/me', { isOnline: !user.isOnline });
      await loadUser();
    } catch (error) {
      console.error('Error toggling online status', error);
      alert('Error al actualizar estado');
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
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Search, label: 'Buscar Servicios', path: '/services', hide: isProvider },
    { icon: Briefcase, label: 'Mis Servicios', path: '/my-services', hide: !isProvider },
    { icon: Calendar, label: 'Reservas', path: '/bookings' },
    { icon: MessageSquare, label: 'Mensajes', path: '/chat' },
  ];

  const generalItems = [
    { icon: Settings, label: 'Configuración', path: '/settings' },
    { icon: HelpCircle, label: 'Ayuda', path: '/help' },
  ];

  const NavItem = ({ icon: Icon, label, path }: { icon: any; label: string; path: string }) => (
    <NavLink
      to={path}
      onClick={() => setSidebarOpen(false)}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? 'active' : ''}`
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transform transition-transform lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">HomePlus</span>
          </div>
        </div>

        {/* Menu Section */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mb-2">
            Menú
          </p>
          {menuItems
            .filter((item) => !item.hide)
            .map((item) => (
              <NavItem key={item.path} {...item} />
            ))}

          <div className="my-6 border-t border-gray-100" />

          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4 mb-2">
            General
          </p>
          {generalItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </nav>

        {/* App Download Card */}
        <div className="p-4">
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-3">
              <Home className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-1">Descarga la App</h4>
            <p className="text-sm text-gray-600 mb-3">Gestiona desde cualquier lugar</p>
            <button className="w-full btn-primary py-2 text-sm">
              Descargar
            </button>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-100 dark:bg-gray-700 dark:text-white border-none rounded-xl focus:bg-white dark:focus:bg-gray-600 focus:ring-2 focus:ring-orange-500 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-gray-400 text-sm">
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">⌘</span>
                <span className="px-1.5 py-0.5 bg-gray-200 rounded text-xs">F</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl text-gray-400 hover:text-orange-500 transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isProvider && (
              <button
                onClick={toggleOnline}
                disabled={togglingOnline}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl font-medium text-sm transition-all ${
                  user.isOnline 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                    : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                }`}
              >
                <Power className={`w-4 h-4 ${user.isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                <span className="hidden sm:inline">{user.isOnline ? 'En línea' : 'Offline'}</span>
              </button>
            )}
            {/* Notifications */}
            <NotificationsDropdown />

            {/* Messages */}
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <MessageSquare className="w-5 h-5 text-gray-600" />
            </button>

            {/* User Avatar */}
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName || 'Usuario'} {user?.lastName || ''}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'PROVIDER' ? 'Profesional' : 'Cliente'}
                </p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-medium">
                {user?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
