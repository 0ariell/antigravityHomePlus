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
  Loader2
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { requestsService, type CreateRequestDto } from '../../services/requests.service';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
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
  { id: 'plomeria', label: 'Plomería', icon: Droplet, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'electricidad', label: 'Electricidad', icon: Zap, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'pintura', label: 'Pintura', icon: PaintBucket, iconComponent: PaintBucket, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { id: 'construccion', label: 'Construcción', icon: Home, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'service', label: 'Servicio Técnico', icon: Wrench, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
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

  // ... (rest of the logic same until Step 3)

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
        await requestsService.create(formData);
        // Success animation or redirect
        alert('¡Solicitud enviada! Los profesionales te contactarán pronto.');
        navigate('/my-requests'); // We need to create this page
    } catch (error) {
        console.error(error);
        alert('Error al crear la solicitud');
    } finally {
        setLoading(false);
    }
  };

  // Sub-render helpers for better readability
  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">¿Qué necesitas arreglar?</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Selecciona la categoría más adecuada</p>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => {
                setFormData({ ...formData, category: cat.label });
                nextStep();
              }}
              className={`p-4 rounded-xl border-2 text-left transition-all hover:scale-105 ${
                formData.category === cat.label
                  ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10'
                  : 'border-transparent bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${cat.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-medium text-gray-900 dark:text-white">{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ubicación</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">Indica dónde se realizará el trabajo en el mapa</p>
      
      <div className="space-y-4">
        {/* Map Picker */}
        <div className="h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 relative">
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
            <div className="absolute inset-0 z-[1000] bg-black/20 flex items-center justify-center pointer-events-none">
              <span className="bg-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">Haz click para marcar ubicación</span>
            </div>
          )}
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Dirección / Barrio (Visible para el profesional)</label>
           <div className="relative">
             <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
             <input 
               type="text" 
               value={formData.zone}
               onChange={e => setFormData({ ...formData, zone: e.target.value })}
               placeholder="Ej: Palermo, CABA"
               className="input-field pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
             />
           </div>
         </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button onClick={prevStep} className="btn-secondary flex-1 dark:bg-gray-700 dark:text-white">
          Atrás
        </button>
        <button 
          onClick={handleSubmit}
          disabled={loading || !formData.zone || !formData.latitude}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
          Enviar Solicitud
        </button>
      </div>
    </div>
  );

  return (
    <div className="card p-6 max-w-2xl mx-auto dark:bg-gray-800 dark:border-gray-700">
      {/* Progress Bar */}
      <div className="flex gap-2 mb-8">
        {[1, 2, 3].map(i => (
          <div 
            key={i} 
            className={`h-2 flex-1 rounded-full transition-colors ${
              step >= i ? 'bg-orange-500' : 'bg-gray-100 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>

      {step === 1 && renderStep1()}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Detalles del problema</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Describe lo que sucede</p>
          <div className="space-y-4">
            <input type="text" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Título" className="input-field dark:bg-gray-700 dark:text-white" />
            <textarea rows={4} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Descripción" className="input-field dark:bg-gray-700 dark:text-white resize-none" />
            <button className="w-full h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:text-orange-500 transition-colors">
              <Camera className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Fotos</span>
            </button>
          </div>
          <div className="flex gap-3 mt-8">
            <button onClick={prevStep} className="btn-secondary flex-1 dark:bg-gray-700 dark:text-white">Atrás</button>
            <button onClick={nextStep} disabled={!formData.title || !formData.description} className="btn-primary flex-1">Siguiente</button>
          </div>
        </div>
      )}

      {step === 3 && renderStep3()}
    </div>
  );
}
