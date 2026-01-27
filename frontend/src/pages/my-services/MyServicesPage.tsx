import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Loader2,
  Briefcase,
  Star,
  MapPin,
  X,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle,
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { httpClient } from '../../infra/http';

interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  zone: string;
  priceBase: number | null;
  priceUnit: string | null;
  isActive: boolean;
  avgRating: number;
  totalReviews: number;
  images?: string[];
  createdAt: string;
}

const CATEGORIES = [
  'Plomería',
  'Electricidad',
  'Pintura',
  'Carpintería',
  'Albañilería',
  'Cerrajería',
  'Limpieza',
  'Jardinería',
];

const PRICE_UNITS = ['hora', 'trabajo', 'metro cuadrado'];

const emptyService = {
  title: '',
  description: '',
  category: '',
  zone: '',
  priceBase: '',
  priceUnit: 'hora',
};

export function MyServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState(emptyService);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadMyServices();
  }, []);

  const loadMyServices = async () => {
    try {
      const response = await httpClient.get('/services/provider/my-services');
      setServices(response.data || []);
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title,
        description: service.description,
        category: service.category,
        zone: service.zone,
        priceBase: service.priceBase?.toString() || '',
        priceUnit: service.priceUnit || 'hora',
      });
    } else {
      setEditingService(null);
      setFormData(emptyService);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingService(null);
    setFormData(emptyService);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        priceBase: formData.priceBase ? parseFloat(formData.priceBase) : null,
      };

      if (editingService) {
        const response = await httpClient.patch(`/services/${editingService.id}`, payload);
        setServices((prev) =>
          prev.map((s) => (s.id === editingService.id ? response.data : s))
        );
      } else {
        const response = await httpClient.post('/services', payload);
        setServices((prev) => [response.data, ...prev]);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving service:', error);
      alert('Error al guardar el servicio');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleServiceStatus = async (service: Service) => {
    try {
      await httpClient.patch(`/services/${service.id}`, { isActive: !service.isActive });
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: !s.isActive } : s))
      );
    } catch (error) {
      console.error('Error toggling service:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await httpClient.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Error al eliminar el servicio');
    }
  };

  // Stats
  const totalServices = services.length;
  const activeServices = services.filter(s => s.isActive).length;
  const avgRating = services.length > 0 
    ? services.reduce((acc, s) => acc + s.avgRating, 0) / services.length 
    : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-display">Mis Servicios</h1>
          <p className="text-gray-400 mt-1">Gestiona y optimiza tu catálogo de servicios</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()} 
          className="btn-primary flex items-center gap-2 shadow-lg shadow-primary-500/25"
        >
          <Plus className="w-5 h-5" />
          Nuevo Servicio
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-900/30 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Servicios</p>
              <p className="text-2xl font-bold text-white">{totalServices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Activos</p>
              <p className="text-2xl font-bold text-white">{activeServices}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-400">Rating Promedio</p>
              <p className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gray-800 rounded-3xl p-12 text-center border border-gray-700"
        >
          <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tienes servicios</h3>
          <p className="text-gray-400 mb-8 max-w-sm mx-auto">
            Crea tu primer servicio para comenzar a recibir solicitudes de clientes
          </p>
          <button 
            onClick={() => handleOpenModal()} 
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Crear mi primer servicio
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {services.map((service, i) => (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-300"
              >
                {/* Image / Placeholder */}
                <div className="relative h-40 bg-gradient-to-br from-gray-700 to-gray-600">
                  {service.images && service.images[0] ? (
                    <img src={service.images[0]} alt={service.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                    service.isActive 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-900/80 text-white'
                  }`}>
                    {service.isActive ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Activo
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3" />
                        Pausado
                      </>
                    )}
                  </div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 bg-gray-800/90 backdrop-blur-sm rounded-full text-xs font-bold text-gray-200">
                    {service.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-white line-clamp-1 group-hover:text-primary-400 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{service.avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1.5 text-sm text-gray-400">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-[120px]">{service.zone}</span>
                    </div>
                    
                    {service.priceBase && (
                      <div className="flex items-center gap-1 text-primary-400 font-bold">
                        <DollarSign className="w-4 h-4" />
                        <span>{service.priceBase}/{service.priceUnit}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-4 border-t border-gray-700">
                    <button 
                      onClick={() => handleOpenModal(service)}
                      className="flex-1 py-2.5 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Editar
                    </button>
                    <button 
                      onClick={() => toggleServiceStatus(service)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        service.isActive 
                          ? 'bg-gray-700 hover:bg-amber-900/20 text-gray-300 hover:text-amber-500' 
                          : 'bg-green-900/20 hover:bg-green-900/30 text-green-500'
                      }`}
                      title={service.isActive ? 'Pausar' : 'Activar'}
                    >
                      {service.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(service.id)}
                      className="p-2.5 bg-gray-700 hover:bg-red-900/20 text-gray-300 hover:text-red-500 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700"
            >
              <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-primary-400" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
                  </h2>
                </div>
                <button onClick={handleCloseModal} className="p-2 hover:bg-gray-700 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    required
                    placeholder="Ej: Instalación de cañerías"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-white mb-2">Descripción</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="input-field resize-none"
                    rows={3}
                    required
                    placeholder="Describe tu servicio en detalle..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Categoría</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="input-field"
                      required
                    >
                      <option value="">Seleccionar</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Zona</label>
                    <input
                      type="text"
                      value={formData.zone}
                      onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                      className="input-field"
                      required
                      placeholder="Ej: CABA"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Precio base</label>
                    <input
                      type="number"
                      value={formData.priceBase}
                      onChange={(e) => setFormData({ ...formData, priceBase: e.target.value })}
                      className="input-field"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">Por</label>
                    <select
                      value={formData.priceUnit}
                      onChange={(e) => setFormData({ ...formData, priceUnit: e.target.value })}
                      className="input-field"
                    >
                      {PRICE_UNITS.map((unit) => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    {editingService ? 'Guardar cambios' : 'Crear servicio'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-gray-700"
            >
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-white text-center mb-2">¿Eliminar servicio?</h3>
              <p className="text-gray-400 text-center mb-6">Esta acción no se puede deshacer.</p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)} 
                  className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  onClick={() => handleDelete(deleteConfirm)} 
                  className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
