import { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  MessageCircle, 
  Mail, 
  Phone,
  FileText,
  Shield,
  CreditCard,
  Send,
  Loader2
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

export function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [contactForm, setContactForm] = useState({ subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);

  const categories = ['Todos', ...Array.from(new Set(FAQ_ITEMS.map(item => item.category)))];
  
  const filteredFAQ = selectedCategory === 'Todos' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter(item => item.category === selectedCategory);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSending(false);
    setContactForm({ subject: '', message: '' });
    alert('Mensaje enviado correctamente');
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Centro de Ayuda</h1>
        <p className="text-gray-500">¿En qué podemos ayudarte hoy?</p>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: FileText, label: 'Guías de uso', description: 'Aprende a usar HomePlus' },
          { icon: Shield, label: 'Seguridad', description: 'Políticas y protección' },
          { icon: CreditCard, label: 'Pagos', description: 'Facturación y transacciones' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <button
              key={i}
              onClick={() => document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="card p-6 text-left card-hover"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2" id="faq-section">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preguntas Frecuentes</h2>
          
          {/* Category Filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3">
            {filteredFAQ.map((item, index) => (
              <div key={index} className="card overflow-hidden">
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{item.question}</span>
                  {expandedIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-4 pb-4 text-gray-600 border-t border-gray-100 pt-3">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contáctanos</h2>
          
          <div className="card p-6 mb-6">
            <div className="space-y-4">
              <a href="mailto:soporte@homeplus.com" className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
                <Mail className="w-5 h-5" />
                <span>soporte@homeplus.com</span>
              </a>
              <a href="tel:+541112345678" className="flex items-center gap-3 text-gray-600 hover:text-orange-600 transition-colors">
                <Phone className="w-5 h-5" />
                <span>+54 11 1234-5678</span>
              </a>
              <div className="flex items-center gap-3 text-gray-600">
                <MessageCircle className="w-5 h-5" />
                <span>Chat en vivo (9-18hs)</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Enviar mensaje</h3>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
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
          </div>
        </div>
      </div>
    </div>
  );
}
