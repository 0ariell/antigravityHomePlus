import { useState } from 'react';
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
import { requestsService, type CreateRequestDto } from '../../services/requests.service';

const CATEGORIES = [
  { id: 'plomeria', label: 'Plomería', icon: Droplet, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'electricidad', label: 'Electricidad', icon: Zap, color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'pintura', label: 'Pintura', icon: PaintBucket, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
  { id: 'construccion', label: 'Construcción', icon: Home, color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
  { id: 'service', label: 'Servicio Técnico', icon: Wrench, color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300' },
];

export function RequestWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateRequestDto>({
    category: '',
    title: '',
    description: '',
    zone: '',
    images: [] // TODO: Image upload logic
  });

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

      {step === 1 && (
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
                    setFormData({ ...formData, category: cat.label }); // Using label as value for simple match
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
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Detalles del problema</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Describe lo que sucede para recibir mejores presupuestos</p>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Título breve</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Gotera en canilla de cocina"
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descripción detallada</label>
              <textarea 
                rows={4}
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explica el problema..."
                className="input-field dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500 resize-none"
              />
            </div>

            <div>
              <button className="w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-orange-500 dark:hover:border-orange-500 hover:text-orange-500 transition-colors">
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-sm">Agregar fotos (Opcional)</span>
              </button>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={prevStep} className="btn-secondary flex-1 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Atrás
            </button>
            <button 
              onClick={nextStep}
              disabled={!formData.title || !formData.description}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ubicación</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">¿Dónde se realizará el trabajo?</p>
          
          <div className="space-y-4">
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Zona / Barrio</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={formData.zone}
                  onChange={e => setFormData({ ...formData, zone: e.target.value })}
                  placeholder="Ej: Palermo, CABA"
                  className="input-field pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                />
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/30">
               <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Resumen</h4>
               <p className="text-sm text-gray-600 dark:text-gray-300">
                 <span className="font-semibold">Categoría:</span> {formData.category}
               </p>
               <p className="text-sm text-gray-600 dark:text-gray-300">
                 <span className="font-semibold">Problema:</span> {formData.title}
               </p>
            </div>
          </div>

          <div className="flex gap-3 mt-8">
            <button onClick={prevStep} className="btn-secondary flex-1 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              Atrás
            </button>
            <button 
              onClick={handleSubmit}
              disabled={loading || !formData.zone}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              Enviar Solicitud
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
