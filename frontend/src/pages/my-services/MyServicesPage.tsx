import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 

  Loader2,
  Briefcase,
  Star,
  X,
  Save,
  Users,
  Wrench,
  Award,
  Truck
} from 'lucide-react';
import { httpClient } from '../../infra/http';
import { useAuthStore } from '../../app/stores';

// --- Types ---
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
  'Plomería', 'Electricidad', 'Pintura', 'Carpintería', 
  'Albañilería', 'Cerrajería', 'Limpieza', 'Jardinería',
  'Gasista', 'Técnico PC', 'Fletes'
];

const PRICE_UNITS = ['hora', 'trabajo', 'metro cuadrado', 'visita'];

// --- Components ---

const TagInput = ({ label, value, onChange, placeholder, icon: Icon }: any) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      if (!value.includes(input.trim())) {
        onChange([...value, input.trim()]);
      }
      setInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag: string) => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4 text-primary-400" />}
        {label}
      </label>
      <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-2 focus-within:ring-1 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all">
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((tag: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 flex items-center gap-1">
              {tag}
              <button onClick={() => removeTag(tag)} className="hover:text-red-400">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-gray-600"
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">Presiona Enter para agregar</p>
    </div>
  );
};

export function MyServicesPage() {
  const { user, loadUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'catalog'>('profile');
  
  // Profile State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    bio: user?.bio || '',
    zone: user?.zone || '',
    yearsExperience: user?.yearsExperience || 0,
    isTeam: user?.isTeam || false,
    teamSize: user?.teamSize || 1,
    tools: user?.tools || [],
    vehicles: user?.vehicles || [],
    languages: user?.languages || [],
    aptitudes: user?.aptitudes || ['Puntualidad', 'Limpieza'],
  });

  // Services Catalog State
  const [services, setServices] = useState<Service[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceForm, setServiceForm] = useState({
     title: '', description: '', category: '', zone: '', priceBase: '', priceUnit: 'hora'
  });
  const [isSavingService, setIsSavingService] = useState(false);

  useEffect(() => {
    loadMyServices();
  }, []);

  const loadMyServices = async () => {
    try {
      const response = await httpClient.get('/services/provider/my-services');
      setServices(response.data || []);
    } catch (error) {
      console.error(error);
    } finally {

    }
  };

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await httpClient.patch('/auth/me', profileForm);
      await loadUser(); // Refresh global state
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error(error);
      alert('Error al actualizar el perfil');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // --- Service CRUD Helpers ---
  const handleOpenServiceModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setServiceForm({
        title: service.title,
        description: service.description,
        category: service.category,
        zone: service.zone,
        priceBase: service.priceBase?.toString() || '',
        priceUnit: service.priceUnit || 'hora',
      });
    } else {
      setEditingService(null);
      setServiceForm({
        title: '', description: '', category: '', zone: user?.zone || '', priceBase: '', priceUnit: 'hora'
      });
    }
    setShowModal(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingService(true);
    try {
      const payload = {
        ...serviceForm,
        priceBase: serviceForm.priceBase ? parseFloat(serviceForm.priceBase) : null,
      };

      if (editingService) {
        const response = await httpClient.patch(`/services/${editingService.id}`, payload);
        setServices(prev => prev.map(s => s.id === editingService.id ? response.data : s));
      } else {
        const response = await httpClient.post('/services', payload);
        setServices(prev => [response.data, ...prev]);
      }
      setShowModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingService(false);
    }
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white font-display flex items-center gap-3">
             <Briefcase className="w-8 h-8 text-primary-400" />
             Perfil Profesional
          </h1>
          <p className="text-gray-400 mt-1 max-w-2xl">
            Gestiona tu información profesional y tu catálogo de servicios. Un perfil completo aumenta tus chances de ser contratado.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="bg-gray-800 p-1 rounded-xl flex gap-1">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'profile' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Mi Perfil
          </button>
          <button 
             onClick={() => setActiveTab('catalog')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
               activeTab === 'catalog' ? 'bg-primary-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
             }`}
          >
            Catálogo de Servicios
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* === PROFILE TAB === */}
        {activeTab === 'profile' && (
          <motion.div 
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Stats & Status */}
            <div className="space-y-6">
              <div className="card p-6 border-t-4 border-t-primary-500">
                 <div className="flex items-center gap-4 mb-6">
                   <div className="w-16 h-16 rounded-full bg-gray-700 overflow-hidden border-2 border-gray-600">
                     {user?.avatarUrl ? (
                       <img src={user.avatarUrl} alt="avatar" className="w-full h-full object-cover" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-xl font-bold text-gray-400">{user?.firstName?.[0]}</div>
                     )}
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-white">{user?.firstName} {user?.lastName}</h3>
                     <div className="flex items-center gap-1 text-amber-500 font-bold">
                       <Star className="w-4 h-4 fill-current" />
                       {user?.avgRating?.toFixed(1) || 'N/A'}
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                     <span className="text-gray-400">Nivel</span>
                     <span className="px-2 py-0.5 bg-primary-500/10 text-primary-400 text-xs font-bold rounded uppercase">Pro</span>
                   </div>
                   <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
                     <span className="text-gray-400">Miembro desde</span>
                     <span className="text-white text-sm">2024</span>
                   </div>
                   <div className="flex justify-between items-center py-2">
                     <span className="text-gray-400">Estado</span>
                     <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                       <span className="text-green-500 text-sm font-medium">Disponible</span>
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Right Column: Edit Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="card p-6">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-gray-500" />
                  Información Básica
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-300 mb-2">Biografía Profesional</label>
                    <textarea 
                      value={profileForm.bio}
                      onChange={e => setProfileForm({...profileForm, bio: e.target.value})}
                      className="input-field h-24 resize-none"
                      placeholder="Cuéntale a los clientes sobre tu experiencia y especialidades..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Zona de Cobertura</label>
                    <input 
                      type="text" 
                      value={profileForm.zone}
                      onChange={e => setProfileForm({...profileForm, zone: e.target.value})}
                      className="input-field"
                      placeholder="Ej: CABA, Zona Norte"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-bold text-gray-300 mb-2">Años de Experiencia</label>
                    <input 
                      type="number" 
                      value={profileForm.yearsExperience}
                      onChange={e => setProfileForm({...profileForm, yearsExperience: parseInt(e.target.value)})}
                      className="input-field"
                      min="0"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-700/50 pt-6 mb-6">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <Users className="w-5 h-5 text-gray-500" />
                     Equipo
                   </h3>
                   <div className="flex items-center gap-8">
                     <label className="flex items-center gap-3 cursor-pointer group">
                       <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${profileForm.isTeam ? 'bg-primary-600' : 'bg-gray-700'}`}>
                         <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${profileForm.isTeam ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                       <input 
                         type="checkbox" 
                         className="hidden" 
                         checked={profileForm.isTeam} 
                         onChange={e => setProfileForm({...profileForm, isTeam: e.target.checked})} 
                       />
                       <span className="text-gray-300 font-medium group-hover:text-white transition-colors">Trabajo con equipo</span>
                     </label>

                     {profileForm.isTeam && (
                       <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                         <label className="text-sm text-gray-400 mr-2">Integrantes:</label>
                         <input 
                           type="number" 
                           value={profileForm.teamSize} 
                           onChange={e => setProfileForm({...profileForm, teamSize: parseInt(e.target.value)})}
                           className="w-20 bg-gray-900 border border-gray-700 rounded-lg py-1 px-2 text-white outline-none focus:border-primary-500"
                           min="2"
                         />
                       </motion.div>
                     )}
                   </div>
                </div>

                <div className="border-t border-gray-700/50 pt-6 mb-6">
                   <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <Award className="w-5 h-5 text-gray-500" />
                     Aptitudes y Recursos
                   </h3>
                   <div className="space-y-6">
                     <TagInput 
                       label="Herramientas Especializadas" 
                       icon={Wrench}
                       value={profileForm.tools} 
                       onChange={(v: string[]) => setProfileForm({...profileForm, tools: v})} 
                       placeholder="Ej: Taladro Percutor, Escalera Extensible..."
                     />
                      <TagInput 
                       label="Aptitudes / Habilidades blandas" 
                       icon={Star}
                       value={profileForm.aptitudes} 
                       onChange={(v: string[]) => setProfileForm({...profileForm, aptitudes: v})} 
                       placeholder="Ej: Puntualidad, Limpieza posterior..."
                     />
                      <TagInput 
                       label="Vehículos" 
                       icon={Truck}
                       value={profileForm.vehicles} 
                       onChange={(v: string[]) => setProfileForm({...profileForm, vehicles: v})} 
                       placeholder="Ej: Camioneta 4x4, Furgón..."
                     />
                   </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="btn-primary py-3 px-8 flex items-center gap-2 shadow-lg shadow-primary-500/20"
                  >
                    {isSavingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                    <Save className="w-4 h-4" />
                    Guardar Perfil
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        )}

        {/* === CATALOG TAB (Legacy MyServices) === */}
        {activeTab === 'catalog' && (
          <motion.div 
            key="catalog"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
               <motion.button
                 onClick={() => handleOpenServiceModal()}
                 whileHover={{ scale: 1.02 }}
                 whileTap={{ scale: 0.98 }}
                 className="min-h-[250px] bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-700 flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-primary-400 hover:border-primary-500/50 hover:bg-gray-800/50 transition-all cursor-pointer group"
               >
                 <div className="w-16 h-16 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                   <Plus className="w-8 h-8" />
                 </div>
                 <span className="font-bold text-lg">Agregar Servicio</span>
               </motion.button>
               
               {services.map((service) => (
                  <motion.div 
                    key={service.id}
                    className="bg-gray-800 rounded-2xl overflow-hidden border border-gray-700 group hover:shadow-xl transition-all"
                  >
                     <div className="p-5">
                       <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-white text-lg">{service.title}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${service.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            {service.isActive ? 'Activo' : 'Pausado'}
                          </span>
                       </div>
                       <p className="text-gray-400 text-sm line-clamp-2 mb-4">{service.description}</p>
                       <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                         <span className="px-2 py-1 bg-gray-900 rounded-lg">{service.category}</span>
                         {service.priceBase && (
                           <span className="text-white font-medium">${service.priceBase} / {service.priceUnit}</span>
                         )}
                       </div>
                       
                       <div className="flex gap-2 border-t border-gray-700 pt-3">
                         <button onClick={() => handleOpenServiceModal(service)} className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300 text-sm hover:bg-gray-600 font-medium">Editar</button>
                         {/* More actions could go here */}
                       </div>
                     </div>
                  </motion.div>
               ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-3xl w-full max-w-lg p-6 border border-gray-700">
             <h2 className="text-xl font-bold text-white mb-6">{editingService ? 'Editar' : 'Nuevo'} Servicio</h2>
             <form onSubmit={handleSaveService} className="space-y-4">
                <input value={serviceForm.title} onChange={e => setServiceForm({...serviceForm, title: e.target.value})} placeholder="Título" className="input-field" required />
                <textarea value={serviceForm.description} onChange={e => setServiceForm({...serviceForm, description: e.target.value})} placeholder="Descripción" className="input-field" required rows={3} />
                <div className="grid grid-cols-2 gap-4">
                  <select value={serviceForm.category} onChange={e => setServiceForm({...serviceForm, category: e.target.value})} className="input-field" required>
                    <option value="">Categoría</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <input value={serviceForm.zone} onChange={e => setServiceForm({...serviceForm, zone: e.target.value})} placeholder="Zona" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <input type="number" value={serviceForm.priceBase} onChange={e => setServiceForm({...serviceForm, priceBase: e.target.value})} placeholder="Precio Base" className="input-field" />
                   <select value={serviceForm.priceUnit} onChange={e => setServiceForm({...serviceForm, priceUnit: e.target.value})} className="input-field">
                     {PRICE_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                   </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-300">Cancelar</button>
                  <button type="submit" className="btn-primary px-6 py-2">{isSavingService ? <Loader2 className="animate-spin" /> : 'Guardar'}</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
