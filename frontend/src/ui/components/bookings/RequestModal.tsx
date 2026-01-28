import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { httpClient } from '../../../infra/http';
import { useNavigate } from 'react-router-dom';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceId?: string; // Optional: if coming from a specific service/provider
  targetProviderId?: string; // If set, it's a DIRECT request
  initialCategory?: string;
  initialZone?: string;
}

export function RequestModal({ 
  isOpen, 
  onClose, 
  serviceId, 
  targetProviderId,
  initialCategory = '',
  initialZone = ''
}: RequestModalProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [form, setForm] = useState({
    category: initialCategory,
    title: '', // e.g. "Fix my sink"
    description: '',
    preferredDate: '',
    zone: initialZone,
    images: [] as string[],
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Determines if we are sending a Direct Request
      const payload: any = {
        category: form.category,
        title: form.title || `${form.category} Request`, // Fallback title
        description: form.description,
        zone: form.zone,
        preferredDate: form.preferredDate || null,
        images: [], // TODO: file upload
        targetProviderId: targetProviderId || null, // VITAL: This triggers the direct flow in backend
      };

      await httpClient.post('/service-requests', payload);
      setStep('SUCCESS');
      
      // Auto close after success
      setTimeout(() => {
        onClose();
        navigate('/requests'); // Redirect to My Requests
      }, 2000);
      
    } catch (error: any) {
      console.error('Error creating request:', error);
      alert(error.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gray-800 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700"
      >
        {step === 'SUCCESS' ? (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">¡Solicitud Enviada!</h2>
            <p className="text-gray-400 text-lg">
              {targetProviderId 
                ? 'El profesional ha recibido tu solicitud directa.' 
                : 'Tu solicitud es visible para los profesionales de la zona.'}
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 border-b border-gray-700 flex items-center justify-between bg-gray-800 sticky top-0 z-10">
              <h2 className="text-xl font-bold text-white">
                {targetProviderId ? 'Solicitud Directa' : 'Solicitar Servicio'}
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Category (Locked if provided) */}
              <div>
                <label className="block text-sm font-bold text-white mb-2">Categoría</label>
                <input 
                  type="text" 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  disabled={!!initialCategory}
                  className="input-field disabled:opacity-50"
                  required
                />
              </div>

               <div>
                <label className="block text-sm font-bold text-white mb-2">Título Breve</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="input-field"
                  placeholder="Ej: Pérdida agua en cocina"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-white mb-2">Descripción detallada</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input-field min-h-[100px]"
                  rows={4}
                  required
                  placeholder="Describe tu problema con el mayor detalle posible..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-white mb-2">¿Cuándo?</label>
                  <input
                    type="datetime-local"
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="input-field"
                  />
                </div>
                 <div>
                  <label className="block text-sm font-bold text-white mb-2">Zona / Dirección</label>
                  <input
                    type="text"
                    value={form.zone}
                    onChange={(e) => setForm({ ...form, zone: e.target.value })}
                    className="input-field"
                    required
                    placeholder="Barrio o dirección"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3.5 text-lg font-bold flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Enviar Solicitud'}
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
