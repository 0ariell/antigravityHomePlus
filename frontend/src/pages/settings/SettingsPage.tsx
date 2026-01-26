import { useState } from 'react';
import { 
  User, 
  Bell, 
  Lock, 
  CreditCard, 
  Globe, 
  LogOut,
  ChevronRight,
  Camera,
  Save,
  Loader2,
  Check
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
    { id: 'profile' as const, label: 'Perfil', icon: User },
    { id: 'notifications' as const, label: 'Notificaciones', icon: Bell },
    { id: 'security' as const, label: 'Seguridad', icon: Lock },
    { id: 'payments' as const, label: 'Pagos', icon: CreditCard },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500 mt-1">Gestiona tu cuenta y preferencias</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Horizontal on mobile */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="card p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-orange-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="card p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Información Personal</h2>
              
              {/* Avatar */}
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {formData.firstName?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <button className="btn-secondary flex items-center gap-2">
                  <Camera className="w-4 h-4" />
                  Cambiar foto
                </button>
              </div>

              {/* Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    className="input-field bg-gray-50"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">El email no puede ser modificado</p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+54 11 1234-5678"
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Zona</label>
                  <input
                    type="text"
                    value={formData.zone}
                    onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                    placeholder="CABA, Buenos Aires"
                    className="input-field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Biografía</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Cuéntanos sobre ti..."
                    rows={3}
                    className="input-field resize-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-end">
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-4 h-4" />
                    Cambios guardados
                  </span>
                )}
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto btn-primary flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Guardar cambios
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferencias de Notificaciones</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Canales</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'email', label: 'Notificaciones por email' },
                      { key: 'push', label: 'Notificaciones push' },
                      { key: 'sms', label: 'Notificaciones por SMS' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Tipos de notificación</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'newBooking', label: 'Nuevas reservas' },
                      { key: 'messages', label: 'Mensajes nuevos' },
                      { key: 'promotions', label: 'Promociones y novedades' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                        <span className="text-gray-700">{item.label}</span>
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="w-5 h-5 text-orange-500 rounded focus:ring-orange-500"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Seguridad</h2>
              
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Cambiar contraseña</p>
                      <p className="text-sm text-gray-500">Actualiza tu contraseña regularmente</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-500" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Sesiones activas</p>
                      <p className="text-sm text-gray-500">Gestiona tus dispositivos conectados</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>

                <button 
                  onClick={() => logout()}
                  className="w-full flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-red-600" />
                    <div className="text-left">
                      <p className="font-medium text-red-600">Cerrar sesión</p>
                      <p className="text-sm text-red-500">Salir de tu cuenta</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card p-4 lg:p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Métodos de Pago</h2>
              
              <div className="text-center py-8 lg:py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No hay métodos de pago</h3>
                <p className="text-gray-500 mb-6">Agrega un método de pago para realizar transacciones</p>
                <button className="btn-primary">Agregar método de pago</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
