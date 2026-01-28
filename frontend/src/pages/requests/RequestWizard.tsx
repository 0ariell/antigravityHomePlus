import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, 
  Zap, 
  PaintBucket, 
  Droplet, 
  Home, 
  MapPin, 
  Camera, 
  Check,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Hammer
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { requestsService, type CreateRequestDto } from '../../services/requests.service';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function LocationPicker({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export function RequestWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const CATEGORIES = [
  { id: 'plomeria', label: 'Plomería', icon: Droplet, color: 'from-blue-500 to-cyan-500' },
  { id: 'electricidad', label: 'Electricidad', icon: Zap, color: 'from-yellow-400 to-orange-500' },
  { id: 'pintura', label: 'Pintura', icon: PaintBucket, color: 'from-pink-500 to-rose-500' },
  { id: 'construccion', label: 'Construcción', icon: Hammer, color: 'from-amber-600 to-orange-600' },
  { id: 'service', label: 'Servicio Técnico', icon: Wrench, color: 'from-gray-400 to-gray-600' },
  { id: 'hogar', label: 'Hogar', icon: Home, color: 'from-emerald-400 to-green-600' },
];

  const [formData, setFormData] = useState<CreateRequestDto>({
    category: '',
    title: '',
    description: '',
    zone: '',
    latitude: undefined,
    longitude: undefined,
    images: []
  });

  const [mapCenter, setMapCenter] = useState<[number, number]>([-34.6037, -58.3816]);

  useEffect(() => {
    // Try to get user's current position for the map
    if (step === 3 && !formData.latitude && "geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setMapCenter([latitude, longitude]);
        setFormData(prev => ({ ...prev, latitude, longitude }));
      });
    }
  }, [step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await requestsService.create(formData);
        // Success animation or redirect
        alert('¡Solicitud creada con éxito! Ahora los profesionales podrán enviarte presupuestos.');
        navigate('/my-requests');
    } catch (error) {
        console.error(error);
        alert('Error al crear la solicitud. Intenta nuevamente.');
    } finally {
        setLoading(false);
    }
  };

  const steps = [
    { title: 'Categoría', description: 'Selecciona el tipo de trabajo' },
    { title: 'Detalles', description: 'Describe el problema' },
    { title: 'Ubicación', description: '¿Dónde es el trabajo?' },
  ];

  return (
    <div className="min-h-screen pb-20">
      
      {/* Header with Steps */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mb-8 pt-6">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Nueva Solicitud</h1>
        <div className="flex items-center justify-between relative">
           <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10" />
           {steps.map((s, i) => {
             const isActive = step >= i + 1;
             const isCurrent = step === i + 1;
             return (
               <div key={i} className="flex flex-col items-center gap-2 bg-[#0a0a0f] px-2">
                 <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                   isActive 
                     ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' 
                     : 'bg-gray-800 border-gray-700 text-gray-500'
                 }`}>
                   {isActive ? <Check className="w-5 h-5" /> : <span>{i + 1}</span>}
                 </div>
                 <span className={`text-xs font-medium ${isCurrent ? 'text-white' : 'text-gray-500'}`}>
                   {s.title}
                 </span>
               </div>
             )
           })}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Category */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">¿Qué necesitas arreglar?</h2>
                <p className="text-gray-400">Elige la categoría que mejor describa tu problema.</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const selected = formData.category === cat.label;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFormData({ ...formData, category: cat.label });
                        nextStep();
                      }}
                      className={`relative group p-6 rounded-3xl border transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
                        selected
                          ? 'bg-gray-800 border-primary-500 ring-1 ring-primary-500/50'
                          : 'bg-gray-800/50 border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 text-white shadow-lg mx-auto group-hover:shadow-xl transition-shadow`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <span className={`block text-center font-bold ${selected ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                        {cat.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Detalles del trabajo</h2>
                <p className="text-gray-400">Cuéntanos más para recibir presupuestos precisos.</p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700 space-y-6 backdrop-blur-sm">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Título Breve</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({ ...formData, title: e.target.value })} 
                    placeholder="Ej: Pérdida de agua en lavamanos" 
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-600"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Descripción Detallada</label>
                  <textarea 
                    rows={5} 
                    value={formData.description} 
                    onChange={e => setFormData({ ...formData, description: e.target.value })} 
                    placeholder="Describe el problema, marca del equipo, antigüedad, etc..." 
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-600 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-2">Fotos (Opcional)</label>
                  <button className="w-full h-32 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-primary-400 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group">
                    <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                       <Camera className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium">Subir fotos (Simulado)</span>
                  </button>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={prevStep} 
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
                <button 
                  onClick={nextStep} 
                  disabled={!formData.title || !formData.description} 
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none"
                >
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Ubicación</h2>
                <p className="text-gray-400">Indica dónde se debe realizar el trabajo.</p>
              </div>

              <div className="bg-gray-800/50 p-6 rounded-3xl border border-gray-700 space-y-6">
                <div className="h-80 w-full rounded-2xl overflow-hidden border border-gray-700 relative shadow-inner">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={15} 
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationPicker onLocationSelect={(lat, lng) => setFormData({ ...formData, latitude: lat, longitude: lng })} />
                    {formData.latitude && formData.longitude && (
                      <Marker position={[formData.latitude, formData.longitude]} />
                    )}
                  </MapContainer>
                  
                  {!formData.latitude && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex flex-col items-center justify-center text-center p-4 pointer-events-none z-[1000]">
                      <MapPin className="w-12 h-12 text-white mb-2 drop-shadow-lg animate-bounce" />
                      <p className="text-white font-bold drop-shadow-md">Haz click en el mapa para marcar la ubicación exacta</p>
                    </div>
                  )}
                </div>

                <div>
                   <label className="block text-sm font-bold text-gray-300 mb-2">Dirección o Barrio</label>
                   <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                     <input 
                       type="text" 
                       value={formData.zone}
                       onChange={e => setFormData({ ...formData, zone: e.target.value })}
                       placeholder="Ej: Palermo, Av. Santa Fe 1234"
                       className="w-full bg-gray-900/50 border border-gray-700 rounded-xl pl-12 pr-4 py-3 text-white focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all placeholder-gray-600"
                     />
                   </div>
                   <p className="text-xs text-gray-500 mt-2 ml-1">Esta información será visible para los profesionales.</p>
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={prevStep} 
                  className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Atrás
                </button>
                <button 
                  onClick={handleSubmit}
                  disabled={loading || !formData.zone || !formData.latitude}
                  className="flex-1 btn-primary py-3 flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:shadow-none font-bold text-lg"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                  Finalizar Solicitud
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
