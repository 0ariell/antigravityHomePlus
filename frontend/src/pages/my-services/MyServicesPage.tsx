import { useEffect, useState } from 'react';
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
  X
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
      const response = await httpClient.get('/services/my-services');
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mis Servicios</h1>
          <p className="text-gray-500 mt-1">Gestiona los servicios que ofreces</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nuevo Servicio
        </button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <div className="card p-12 text-center">
          <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes servicios</h3>
          <p className="text-gray-500 mb-6">Crea tu primer servicio para comenzar a recibir solicitudes</p>
          <button onClick={() => handleOpenModal()} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Crear Servicio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {services.map((service) => (
            <div key={service.id} className="card overflow-hidden">
              {/* Status Banner */}
              <div className={`px-4 py-2 text-sm font-medium ${
                service.isActive 
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {service.isActive ? '✓ Activo' : '⏸ Pausado'}
              </div>

              {/* Content */}
              <div className="p-4 lg:p-5">
                <div className="flex items-start justify-between mb-3">
                  <span className="badge bg-orange-100 text-orange-700">{service.category}</span>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm text-gray-700">
                      {service.avgRating.toFixed(1)} ({service.totalReviews})
                    </span>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{service.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{service.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{service.zone}</span>
                </div>

                {service.priceBase && (
                  <p className="text-lg font-semibold text-orange-600 mb-4">
                    ${service.priceBase} / {service.priceUnit}
                  </p>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => handleOpenModal(service)}
                    className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button 
                    onClick={() => toggleServiceStatus(service)}
                    className={`p-2 rounded-lg transition-colors ${
                      service.isActive 
                        ? 'hover:bg-gray-100 text-gray-600' 
                        : 'hover:bg-green-50 text-green-600'
                    }`}
                    title={service.isActive ? 'Pausar' : 'Activar'}
                  >
                    {service.isActive ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setDeleteConfirm(service.id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  required
                  placeholder="Describe tu servicio..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Zona de trabajo</label>
                <input
                  type="text"
                  value={formData.zone}
                  onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
                  className="input-field"
                  required
                  placeholder="Ej: CABA, Zona Norte"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Precio base</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Por</label>
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
                <button type="button" onClick={handleCloseModal} className="flex-1 btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="flex-1 btn-primary flex items-center justify-center gap-2">
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingService ? 'Guardar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">¿Eliminar servicio?</h3>
            <p className="text-gray-500 mb-6">Esta acción no se puede deshacer.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">
                Cancelar
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-medium transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
