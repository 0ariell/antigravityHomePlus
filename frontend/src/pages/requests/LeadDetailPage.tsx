import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Camera, 
  DollarSign, 
  Calendar, 
  Loader2, 
  CheckCircle2, 
  Info,
  ChevronRight,
  User,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { requestsService, type ServiceRequest } from '../../services/requests.service';
import { quotesService } from '../../services/quotes.service';

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ServiceRequest | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Quote State
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [isAsap, setIsAsap] = useState(false);
  const [estimatedDate, setEstimatedDate] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (id) loadRequest();
  }, [id]);

  const loadRequest = async () => {
    try {
      const data = await requestsService.getOne(id!);
      setRequest(data);
    } catch (error) {
      console.error('Error loading lead', error);
      navigate('/leads');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!price || sending || (!isAsap && !estimatedDate)) return;

    setSending(true);
    try {
      await quotesService.create({
        requestId: id!,
        price: parseFloat(price),
        description,
        isAsap,
        estimatedDate: isAsap ? undefined : estimatedDate
      });
      setSuccess(true);
      setTimeout(() => navigate('/leads'), 2000);
    } catch (error) {
      console.error('Error sending quote', error);
      alert('Error al enviar presupuesto');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">Cargando detalles...</p>
      </div>
    );
  }

  if (!request) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20 animate-fade-in">
      {/* Header */}
      <header className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/leads')}
          className="p-2 bg-gray-900 border border-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">{request.title}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
             <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {request.zone}</span>
             <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(request.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Photos */}
          <section className="space-y-4">
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Camera className="w-4 h-4" /> Fotos del problema
             </h3>
             {request.images && request.images.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                 {request.images.map((img, idx) => (
                   <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 group relative">
                      <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                   </div>
                 ))}
               </div>
             ) : (
               <div className="p-10 border border-dashed border-gray-800 rounded-2xl text-center bg-gray-900/20">
                  <p className="text-gray-600 text-sm">El cliente no adjuntó imágenes.</p>
               </div>
             )}
          </section>

          {/* Description */}
          <section className="space-y-4">
             <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Descripción General</h3>
             <div className="bg-gray-900/40 border border-gray-800 p-6 rounded-3xl">
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{request.description}</p>
             </div>
          </section>

          {/* Diagnosis Results */}
          {request.diagnosis && (
            <section className="space-y-4">
               <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Diagnóstico Guiado</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(request.diagnosis as any).answers?.map((ans: any, idx: number) => (
                    <div key={idx} className="bg-gray-900/40 border border-gray-800 p-4 rounded-2xl flex flex-col gap-1">
                       <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{ans.question}</span>
                       <span className="text-sm font-bold text-white">{ans.answer}</span>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {request.extraInfo && (
            <section className="space-y-4">
               <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest">Información Extra</h3>
               <div className="bg-primary-500/5 border border-primary-500/10 p-5 rounded-2xl italic text-gray-400 text-sm leading-relaxed">
                  "{request.extraInfo}"
               </div>
            </section>
          )}
        </div>

        {/* Right Column: Quoting Form */}
        <div className="space-y-6">
          <div className="bg-gray-900 border border-primary-500/20 rounded-[2.5rem] p-8 shadow-2xl sticky top-8">
             {success ? (
               <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
                     <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white">¡Presupuesto Enviado!</h3>
                  <p className="text-gray-500 text-sm">Redirigiendo a tus oportunidades...</p>
               </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <h3 className="text-xl font-bold text-white">Enviar Presupuesto</h3>
                     <p className="text-gray-500 text-sm">Propone tu precio y disponibilidad para ganar este trabajo.</p>
                  </div>

                  <div className="space-y-4">
                     <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Precio estimado ($)</label>
                        <div className="relative">
                           <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                           <input 
                             type="number" 
                             required
                             value={price}
                             onChange={e => setPrice(e.target.value)}
                             className="w-full bg-gray-800 border border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-white font-bold text-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                             placeholder="0.00"
                           />
                        </div>
                     </div>

                     <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Cuando podés ir?</label>
                        <div className="grid grid-cols-2 gap-2">
                           <button 
                             type="button"
                             onClick={() => setIsAsap(true)}
                             className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all ${isAsap ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                           >
                             <Zap className="w-4 h-4" /> Ya mismo
                           </button>
                           <button 
                             type="button"
                             onClick={() => setIsAsap(false)}
                             className={`flex items-center justify-center gap-2 py-3 rounded-xl border font-bold text-xs transition-all ${!isAsap ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'}`}
                           >
                             <Calendar className="w-4 h-4" /> Programar
                           </button>
                        </div>
                     </div>

                     <AnimatePresence>
                        {!isAsap && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-gray-800 p-4 rounded-2xl border border-gray-700"
                          >
                             <label className="text-[10px] font-black text-gray-500 uppercase mb-2 block">Fecha y Hora Propuesta</label>
                             <input 
                               type="datetime-local" 
                               required={!isAsap}
                               value={estimatedDate}
                               onChange={e => setEstimatedDate(e.target.value)}
                               className="w-full bg-transparent text-white font-bold outline-none"
                             />
                          </motion.div>
                        )}
                     </AnimatePresence>

                     <div>
                        <label className="text-xs font-black text-gray-500 uppercase tracking-widest mb-2 block">Notas adicionales</label>
                        <textarea 
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all h-32 resize-none"
                          placeholder="Hola! Puedo pasar a revisar..."
                        />
                     </div>
                  </div>

                  <button 
                    disabled={sending || !price || (!isAsap && !estimatedDate)}
                    className="w-full bg-primary-500 text-white font-black py-5 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    {sending ? <Loader2 className="w-6 h-6 animate-spin" /> : 'ENVIAR PRESUPUESTO'}
                  </button>

                  <div className="flex items-start gap-2 text-[10px] text-gray-500 uppercase font-bold leading-tight bg-gray-900/50 p-3 rounded-xl border border-gray-800">
                     <Info className="w-4 h-4 shrink-0" />
                     Si el cliente acepta, se creará un chat directo y se reservará el horario.
                  </div>
               </form>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
