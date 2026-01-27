import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  LogOut,
  ChevronRight,
  Camera,
  Save,
  Loader2,
  Check,
  Shield,
  Smartphone,
  Mail,
  MapPin,
  Edit3,
  Plus
} from 'lucide-react';
import { useAuthStore } from '../../app/stores';
import { httpClient } from '../../infra/http';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'payments';

export function SettingsPage() {
  const { user, logout, loadUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    zone: user?.zone || '',
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newBooking: true,
    messages: true,
    promotions: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    
    try {
      await httpClient.patch('/auth/me', formData);
      await loadUser();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error al guardar los cambios');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as const, label: 'Perfil', icon: UserIcon, description: 'Tu información personal' },
    { id: 'notifications' as const, label: 'Notificaciones', icon: Bell, description: 'Preferencias de alertas' },
    { id: 'security' as const, label: 'Seguridad', icon: Shield, description: 'Contraseña y sesiones' },
    { id: 'payments' as const, label: 'Pagos', icon: CreditCard, description: 'Métodos de pago' },
  ];

  const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: (val: boolean) => void }) => (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-primary-500' : 'bg-gray-600'
      }`}
    >
      <motion.div
        layout
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ left: enabled ? '1.75rem' : '0.25rem' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Configuración</h1>
        <p className="text-gray-400 mt-1">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="card p-3 space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-orange-500 text-white shadow-lg shadow-primary-500/20'
                      : 'text-gray-400 hover:bg-gray-800/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-white/20' : 'bg-gray-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold block">{tab.label}</span>
                    <span className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                      {tab.description}
                    </span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card overflow-hidden"
              >
                {/* Profile Header */}
                <div className="p-6 bg-gradient-to-r from-primary-500 to-orange-500 text-white">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg">
                        {formData.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <button 
                        onClick={() => alert('Carga de avatar: Próximamente')}
                        className="absolute -bottom-2 -right-2 w-8 h-8 bg-white text-primary-600 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center sm:text-left">
                      <h2 className="text-2xl font-bold">
                        {formData.firstName} {formData.lastName}
                      </h2>
                      <p className="text-white/70">{user?.email}</p>
                      <div className="flex items-center gap-2 mt-2 text-sm text-white/80">
                        <span className="px-2 py-0.5 bg-white/20 rounded-full capitalize">
                          {user?.role === 'PROVIDER' ? 'Profesional' : 'Cliente'}
                        </span>
                        {user?.role === 'PROVIDER' && user?.isOnline && (
                          <span className="px-2 py-0.5 bg-green-500/30 text-green-100 rounded-full flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                            En línea
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form */}
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Apellido</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="email"
                          value={user?.email || ''}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/30 border border-gray-700 rounded-xl text-gray-500 cursor-not-allowed"
                          disabled
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1.5">El email no puede ser modificado</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Teléfono</label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+54 11 1234-5678"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Zona</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={formData.zone}
                          onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                          placeholder="CABA, Buenos Aires"
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Biografía</label>
                      <div className="relative">
                        <Edit3 className="absolute left-4 top-4 w-5 h-5 text-gray-500" />
                        <textarea
                          value={formData.bio}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          placeholder="Cuéntanos sobre ti..."
                          rows={3}
                          className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all resize-none outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 justify-end pt-4 border-t border-gray-800">
                    <AnimatePresence>
                      {saveSuccess && (
                        <motion.span 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 text-green-400 text-sm font-medium"
                        >
                          <Check className="w-4 h-4" />
                          Cambios guardados
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all"
                    >
                      {isSaving ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Save className="w-5 h-5" />
                      )}
                      Guardar cambios
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  Preferencias de Notificaciones
                </h2>
                
                <div className="space-y-8">
                  <div>
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Bell className="w-5 h-5 text-primary-400" />
                      Canales
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'email', label: 'Notificaciones por email', desc: 'Recibí actualizaciones en tu correo' },
                        { key: 'push', label: 'Notificaciones push', desc: 'Alertas en tiempo real' },
                        { key: 'sms', label: 'Notificaciones por SMS', desc: 'Mensajes de texto importantes' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                          <div>
                            <span className="font-medium text-white">{item.label}</span>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <Toggle 
                            enabled={notifications[item.key as keyof typeof notifications] as boolean}
                            onChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-primary-400" />
                      Tipos de notificación
                    </h3>
                    <div className="space-y-3">
                      {[
                        { key: 'newBooking', label: 'Nuevas reservas', desc: 'Cuando alguien solicita un servicio' },
                        { key: 'messages', label: 'Mensajes nuevos', desc: 'Cuando recibís un mensaje' },
                        { key: 'promotions', label: 'Promociones', desc: 'Ofertas y novedades de HomePlus' },
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                          <div>
                            <span className="font-medium text-white">{item.label}</span>
                            <p className="text-sm text-gray-500">{item.desc}</p>
                          </div>
                          <Toggle 
                            enabled={notifications[item.key as keyof typeof notifications] as boolean}
                            onChange={(val) => setNotifications({ ...notifications, [item.key]: val })}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  Seguridad
                </h2>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => alert('Cambio de contraseña: Próximamente')}
                    className="w-full flex items-center justify-between p-5 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center">
                        <Lock className="w-6 h-6 text-primary-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">Cambiar contraseña</p>
                        <p className="text-sm text-gray-500">Actualizala regularmente por seguridad</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => alert('Gestión de sesiones: Próximamente')}
                    className="w-full flex items-center justify-between p-5 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                        <Globe className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white">Sesiones activas</p>
                        <p className="text-sm text-gray-500">Gestioná tus dispositivos conectados</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button 
                    onClick={() => logout()}
                    className="w-full flex items-center justify-between p-5 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                        <LogOut className="w-6 h-6 text-red-400" />
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-red-400">Cerrar sesión</p>
                        <p className="text-sm text-red-400/70">Salir de tu cuenta</p>
                      </div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card p-6"
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  Métodos de Pago
                </h2>
                
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CreditCard className="w-10 h-10 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Sin métodos de pago
                  </h3>
                  <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                    Agregá un método de pago para realizar transacciones de forma segura
                  </p>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => alert('Agregar método de pago: Próximamente')}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white font-semibold rounded-xl flex items-center gap-2 mx-auto shadow-lg shadow-primary-500/20"
                  >
                    <Plus className="w-5 h-5" />
                    Agregar método de pago
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
