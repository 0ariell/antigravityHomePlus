import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  MessageCircle, 
  Mail, 
  Phone,
  FileText,
  Shield,
  CreditCard,
  Send,
  Loader2,
  Search,
  Zap,
  Users,
  Clock,
  Headphones
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'General',
    question: '¿Cómo funciona HomePlus?',
    answer: 'HomePlus conecta clientes con profesionales de confianza para servicios del hogar. Puedes buscar servicios, solicitar presupuestos, reservar y pagar de forma segura a través de nuestra plataforma.',
  },
  {
    category: 'General',
    question: '¿Cómo me registro como profesional?',
    answer: 'Durante el registro, selecciona la opción "Soy Profesional". Completa tu perfil con información sobre tus servicios, zona de trabajo y experiencia. Una vez verificado, podrás publicar tus servicios.',
  },
  {
    category: 'Reservas',
    question: '¿Cómo solicito un servicio?',
    answer: 'Busca el servicio que necesitas, selecciona un profesional y describe tu problema. El profesional recibirá tu solicitud y podrá aceptarla o enviarte un presupuesto.',
  },
  {
    category: 'Reservas',
    question: '¿Puedo cancelar una reserva?',
    answer: 'Sí, puedes cancelar una reserva mientras esté en estado "Pendiente" o "Aceptada". Las cancelaciones tardías pueden estar sujetas a cargos según las políticas del profesional.',
  },
  {
    category: 'Pagos',
    question: '¿Qué métodos de pago aceptan?',
    answer: 'Aceptamos tarjetas de crédito/débito, MercadoPago y transferencias bancarias. Los pagos se procesan de forma segura a través de nuestra plataforma.',
  },
  {
    category: 'Seguridad',
    question: '¿Cómo garantizan la calidad de los profesionales?',
    answer: 'Verificamos la identidad de todos los profesionales y recopilamos reseñas de clientes reales. Nuestro sistema de ranking prioriza la calidad del servicio sobre cualquier otro factor.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Zap, color: 'from-primary-500 to-orange-500' },
  { id: 'General', label: 'General', icon: FileText, color: 'from-blue-500 to-blue-600' },
  { id: 'Reservas', label: 'Reservas', icon: Clock, color: 'from-green-500 to-green-600' },
  { id: 'Pagos', label: 'Pagos', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
  { id: 'Seguridad', label: 'Seguridad', icon: Shield, color: 'from-amber-500 to-amber-600' },
];

export function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

  const filteredFAQ = FAQ_ITEMS.filter(item => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setMessageSent(true);
    setContactForm({ subject: '', message: '' });
    setTimeout(() => setMessageSent(false), 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pb-12"
    >
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-orange-500 rounded-3xl p-8 md:p-12 mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6"
          >
            <Headphones className="w-10 h-10 text-white" />
          </motion.div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            ¿En qué podemos ayudarte?
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Encuentra respuestas rápidas o contacta a nuestro equipo de soporte
          </p>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar en preguntas frecuentes..."
              className="w-full pl-12 pr-4 py-4 bg-gray-900 rounded-2xl text-white placeholder-gray-500 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/30"
            />
          </div>
        </div>
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-12">
        {CATEGORIES.map((cat, i) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative p-4 rounded-2xl text-left transition-all duration-300 group overflow-hidden ${
                isActive 
                  ? 'bg-gradient-to-br ' + cat.color + ' text-white shadow-lg scale-[1.02]' 
                  : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-700/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                isActive ? 'bg-white/20' : 'bg-gray-700'
              }`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-white'}`}>
                {cat.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Preguntas Frecuentes</h2>
            <span className="text-sm text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
              {filteredFAQ.length} resultados
            </span>
          </div>
          
          {filteredFAQ.length === 0 ? (
            <div className="bg-gray-800/50 rounded-2xl p-12 text-center border border-gray-700">
              <HelpCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Sin resultados</h3>
              <p className="text-gray-500">Intenta con otra búsqueda o categoría</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredFAQ.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="bg-gray-800/50 rounded-2xl overflow-hidden border border-gray-700"
                  >
                    <button
                      onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <HelpCircle className="w-5 h-5 text-primary-400" />
                        </div>
                        <span className="font-medium text-white">{item.question}</span>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedIndex === index ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </button>
                    
                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-0 ml-14 text-gray-400 leading-relaxed border-t border-gray-700 pt-4">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 text-white relative overflow-hidden border border-gray-700">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold">Soporte 24/7</h3>
                  <p className="text-sm text-gray-400">Estamos para ayudarte</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <a href="mailto:soporte@homeplus.com" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">soporte@homeplus.com</span>
                </a>
                <a href="tel:+541112345678" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">+54 11 1234-5678</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Chat en vivo (9-18hs)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-800/50 rounded-3xl p-6 border border-gray-700">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary-400" />
              Enviar mensaje
            </h3>
            
            {messageSent ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="font-semibold text-white mb-1">¡Mensaje enviado!</h4>
                <p className="text-sm text-gray-500">Te responderemos pronto</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Asunto</label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    placeholder="¿En qué podemos ayudarte?"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Mensaje</label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Describe tu consulta..."
                    rows={4}
                    className="input-field resize-none"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isSending}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isSending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  Enviar mensaje
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
