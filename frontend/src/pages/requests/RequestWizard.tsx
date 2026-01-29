import { 
  Camera, 
  Check,
  Loader2,
  ArrowLeft,
  AlertTriangle,
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import { DIAGNOSIS_DATA } from '../../data/diagnosisData';
import { useRequestWizard } from './hooks/useRequestWizard';

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
  const {
    step,
    steps,
    loading,
    selectedTrade,
    selectedProblem,
    answers,
    extraInfo,
    images,
    zone,
    location,
    mapCenter,
    nextStep,
    prevStep,
    setSelectedTrade,
    setSelectedProblem,
    setAnswers,
    setExtraInfo,
    setImages,
    setZone,
    handleSimulateUpload,
    handleLocationSelect, // Make sure this is exposed from hook
    handleSubmit
  } = useRequestWizard();

  return (
    <div className="min-h-screen pb-20 bg-[#0a0a0f]">
      
      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto px-4 pt-8 mb-12">
        <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-800 -z-10" />
            <div 
              className="absolute top-1/2 left-0 h-0.5 bg-primary-500 -z-10 transition-all duration-500" 
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            />
            {steps.map((_, i) => {
                const isActive = step >= i + 1;
                return (
                    <div key={i} className="flex flex-col items-center gap-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                            isActive ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-gray-800 border-gray-700 text-gray-500'
                        }`}>
                            {isActive && step > i + 1 ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{i + 1}</span>}
                        </div>
                    </div>
                )
            })}
        </div>
        <div className="mt-4 text-center">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-primary-500">Paso {step} de {steps.length}</span>
            <h1 className="text-xl font-bold text-white mt-1">{steps[step-1].title}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <AnimatePresence mode="wait">
          
          {/* Step 1: Trade */}
          {step === 1 && (
            <motion.div key="st1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
               <h2 className="text-2xl font-bold text-white text-center">¿Qué rubro necesitas?</h2>
               <div className="grid grid-cols-2 gap-4">
                  {DIAGNOSIS_DATA.map(trade => {
                      const Icon = trade.icon;
                      return (
                          <button
                            key={trade.id}
                            onClick={() => { setSelectedTrade(trade); nextStep(); }}
                            className="p-6 rounded-[2rem] bg-gray-900/50 border border-gray-800 hover:border-primary-500/50 transition-all group"
                          >
                            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${trade.color} flex items-center justify-center mb-4 text-white shadow-lg mx-auto`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <span className="block text-center font-bold text-gray-300 group-hover:text-white">{trade.label}</span>
                          </button>
                      )
                  })}
               </div>
            </motion.div>
          )}

          {/* Step 2: Problem */}
          {step === 2 && (
            <motion.div key="st2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
                <button onClick={prevStep} className="text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold mb-4">
                    <ArrowLeft className="w-4 h-4" /> VOLVER A OFICIOS
                </button>
                <h2 className="text-2xl font-bold text-white">¿Cuál es el problema?</h2>
                <div className="space-y-2">
                    {selectedTrade?.problems.map(prob => (
                        <button
                          key={prob.id}
                          onClick={() => { setSelectedProblem(prob); nextStep(); }}
                          className="w-full p-4 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-between hover:bg-gray-800/50 hover:border-primary-500/30 transition-all group"
                        >
                            <span className="text-gray-300 group-hover:text-white font-medium">{prob.label}</span>
                            <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-primary-500" />
                        </button>
                    ))}
                </div>
            </motion.div>
          )}

          {/* Step 3: QA */}
          {step === 3 && (
            <motion.div key="st3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <h2 className="text-2xl font-bold text-white text-center">Danos más detalle</h2>
                <div className="space-y-10 pb-10">
                    {selectedProblem?.questions.map((q, idx) => (
                        <div key={q.id} className="space-y-4">
                            <div className="space-y-1">
                                <h3 className="text-lg font-bold text-white flex gap-3">
                                    <span className="text-primary-500/40">0{idx+1}</span>
                                    {q.text}
                                    {!q.required && q.required !== undefined && (
                                        <span className="text-[10px] font-medium text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full self-center">OPCIONAL</span>
                                    )}
                                </h3>
                                {q.help && (
                                    <p className="text-xs text-gray-500 pl-8">{q.help}</p>
                                )}
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                {q.options.map(opt => (
                                    <button
                                      key={opt}
                                      onClick={() => setAnswers({...answers, [q.id]: opt})}
                                      className={`p-4 rounded-xl border text-left text-sm transition-all ${
                                          answers[q.id] === opt 
                                          ? 'bg-primary-500/10 border-primary-500 text-white font-bold' 
                                          : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700'
                                      }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-4 pt-8 bg-[#0a0a0f] sticky bottom-0 py-4 border-t border-gray-900">
                    <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:text-white">Atrás</button>
                    <button 
                      onClick={nextStep} 
                      disabled={selectedProblem?.questions.some(q => (q.required !== false) && !answers[q.id])}
                      className="flex-[2] btn-primary py-4 disabled:opacity-50"
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
          )}

          {/* Step 4: Extra Info */}
          {step === 4 && (
            <motion.div key="st4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white">¿Algo más que debamos saber?</h2>
                
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex gap-4">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0" />
                    <div>
                        <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-1">Importante</p>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            No compartas datos de contacto (teléfono, email, redes sociales). La comunicación y el pago deben ser a través de la app para tu seguridad.
                        </p>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-black text-gray-500 uppercase tracking-widest pl-1">Información Adicional</label>
                    <textarea 
                        value={extraInfo}
                        onChange={e => setExtraInfo(e.target.value)}
                        placeholder="Escribe aquí cualquier detalle extra, marca de artefactos, etc..."
                        className="w-full h-48 bg-gray-900 border border-gray-800 rounded-3xl p-6 text-white text-sm focus:border-primary-500 outline-none resize-none transition-all"
                    />
                </div>

                <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:text-white">Atrás</button>
                    <button onClick={nextStep} className="flex-[2] btn-primary py-4">Continuar</button>
                </div>
            </motion.div>
          )}

          {/* Step 5: Images */}
          {step === 5 && (
            <motion.div key="st5" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white text-center">Fotos obligatorias</h2>
                
                {selectedProblem?.photoGuide && (
                    <div className="space-y-3">
                        <div className="p-4 bg-primary-500/10 border border-primary-500/10 rounded-2xl flex items-center gap-3">
                            <Info className="w-5 h-5 text-primary-400" />
                            <p className="text-[11px] text-primary-300">Sube al menos {selectedProblem.minPhotos} fotos siguiendo esta guía:</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                            {selectedProblem.photoGuide.map(item => (
                                <div key={item.id} className="flex items-center gap-3 bg-gray-900/40 p-3 rounded-xl border border-gray-800/50">
                                    <div className="w-5 h-5 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
                                        <Camera className="w-2.5 h-2.5 text-gray-400" />
                                    </div>
                                    <span className="text-[11px] text-gray-400 font-medium">{item.label}</span>
                                </div>
                            ))}
                        </div>
                        {images.length < (selectedProblem.minPhotos || 3) && (
                            <p className="text-[10px] text-center text-amber-500/80 font-bold uppercase tracking-widest mt-2 animate-pulse">
                                Faltan {(selectedProblem.minPhotos || 3) - images.length} {(selectedProblem.minPhotos || 3) - images.length === 1 ? 'foto' : 'fotos'} para continuar
                            </p>
                        )}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    {images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-[2rem] overflow-hidden border border-gray-800">
                            <img src={img} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => setImages(images.filter((_, i) => i !== idx))}
                              className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    
                    {images.length < 5 && (
                        <button 
                          onClick={handleSimulateUpload}
                          className="aspect-square rounded-[2rem] border-2 border-dashed border-gray-800 flex flex-col items-center justify-center gap-2 text-gray-500 hover:border-primary-500/50 hover:text-primary-400 transition-all bg-gray-900/20"
                        >
                            <Camera className="w-6 h-6" />
                            <span className="text-[10px] font-bold">AGREGAR FOTO</span>
                        </button>
                    )}
                </div>

                <div className="flex gap-4 pt-4">
                    <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:text-white">Atrás</button>
                    <button 
                      onClick={nextStep} 
                      disabled={images.length < (selectedProblem?.minPhotos || 3)}
                      className="flex-[2] btn-primary py-4 disabled:opacity-30"
                    >
                        {images.length < (selectedProblem?.minPhotos || 3) ? `Subir fotos (${images.length}/${selectedProblem?.minPhotos})` : 'Continuar'}
                    </button>
                </div>
            </motion.div>
          )}

          {/* Step 6: Location */}
          {step === 6 && (
            <motion.div key="st6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-white">¿Dónde es el trabajo?</h2>
                <div className="space-y-4">
                    <div className="h-72 rounded-[2rem] overflow-hidden border border-gray-800 relative">
                        <MapContainer center={mapCenter} zoom={15} style={{ height: '100%', width: '100%' }}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <LocationPicker onLocationSelect={handleLocationSelect} />
                            {location && <Marker position={[location.lat, location.lng]} />}
                        </MapContainer>
                        {!location && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center z-[1000] pointer-events-none">
                                <p className="text-white font-bold">Haz click en el mapa para marcar la ubicación</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <input 
                            type="text"
                            value={zone}
                            onChange={e => setZone(e.target.value)}
                            placeholder="Barrio / Dirección aproximada"
                            className="w-full p-4 bg-gray-900 border border-gray-800 rounded-2xl text-white outline-none focus:border-primary-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:text-white">Atrás</button>
                    <button 
                      onClick={nextStep} 
                      disabled={!location || !zone}
                      className="flex-[2] btn-primary py-4 disabled:opacity-50"
                    >
                        Continuar
                    </button>
                </div>
            </motion.div>
          )}

          {/* Step 7: Review */}
          {step === 7 && (
             <motion.div key="st7" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pb-20">
                <h2 className="text-2xl font-bold text-white text-center">Resumen de solicitud</h2>
                
                <div className="bg-gray-900 rounded-[2.5rem] border border-gray-800 p-8 space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${selectedTrade?.color} flex items-center justify-center text-white`}>
                           {selectedTrade && <selectedTrade.icon className="w-6 h-6" />}
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{selectedTrade?.label}</p>
                            <h3 className="text-lg font-bold text-white">{selectedProblem?.label}</h3>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-primary-500 uppercase tracking-tight">DETALLE DEL DIAGNÓSTICO</h4>
                        <div className="grid grid-cols-1 gap-3">
                            {selectedProblem?.questions.map(q => (
                                <div key={q.id} className="flex justify-between items-start gap-4">
                                    <span className="text-xs text-gray-500 font-medium">{q.text}</span>
                                    <span className="text-xs text-white font-bold text-right">{answers[q.id]}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {extraInfo && (
                        <div className="space-y-2 pt-2">
                             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-tight">INFO EXTRA</h4>
                             <p className="text-xs text-gray-400 italic leading-relaxed">"{extraInfo}"</p>
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-4 text-gray-500 font-bold hover:text-white">Atrás</button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={loading}
                      className="flex-[2] btn-primary py-4 flex items-center justify-center gap-3 text-lg"
                    >
                        {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                        Publicar Solicitud
                    </button>
                </div>
             </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
