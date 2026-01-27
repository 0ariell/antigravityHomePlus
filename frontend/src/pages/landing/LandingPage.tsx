import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wrench, 
  Hammer, 
  Paintbrush, 
  Zap, 
  Droplets,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Search,
  Briefcase,
  Star,
  Shield,
  Clock,
  MessageSquare,
  Users,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { cn } from '../../lib/utils';

// Floating tools with organic positioning
const floatingTools = [
  { Icon: Wrench, x: '8%', y: '25%', size: 28, delay: 0, rotate: -15 },
  { Icon: Hammer, x: '88%', y: '18%', size: 24, delay: 0.3, rotate: 20 },
  { Icon: Paintbrush, x: '78%', y: '55%', size: 32, delay: 0.6, rotate: -25 },
  { Icon: Zap, x: '12%', y: '65%', size: 22, delay: 0.9, rotate: 10 },
  { Icon: Droplets, x: '92%', y: '75%', size: 26, delay: 1.2, rotate: -5 },
];

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, start: () => setStarted(true) };
}

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeRole, setActiveRole] = useState<'client' | 'provider'>('client');
  
  const professionalsCounter = useCounter(127, 1500);
  const servicesCounter = useCounter(534, 1800);
  const ratingCounter = useCounter(48, 1200); // 4.8 rating

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Start counters when stats section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          professionalsCounter.start();
          servicesCounter.start();
          ratingCounter.start();
        }
      },
      { threshold: 0.5 }
    );
    const statsEl = document.getElementById('stats-section');
    if (statsEl) observer.observe(statsEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Floating Tools Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingTools.map((tool, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.07]"
            style={{ left: tool.x, top: tool.y }}
            animate={{
              y: [0, -15, 0],
              rotate: [tool.rotate, tool.rotate + 8, tool.rotate],
            }}
            transition={{
              duration: 5 + i,
              delay: tool.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <tool.Icon size={tool.size} className="text-primary-400" />
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-[#0a0a0f]/90 backdrop-blur-2xl py-3 shadow-lg shadow-black/20" : "bg-transparent py-5"
      )}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="relative z-10">
            <BrandLogo variant="mobile" className="filter brightness-0 invert" />
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cómo funciona
            </a>
            <a href="#para-quien" className="text-sm text-gray-400 hover:text-white transition-colors">
              ¿Para quién?
            </a>
            <div className="w-px h-4 bg-gray-800" />
            <Link to="/login" className="text-sm text-gray-300 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              to="/register" 
              className="text-sm bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-all hover:scale-105"
            >
              Comenzar gratis
            </Link>
          </div>

          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#0a0a0f] border-t border-white/5 overflow-hidden"
            >
              <div className="px-6 py-4 space-y-3">
                <a href="#como-funciona" className="block py-2 text-gray-400">Cómo funciona</a>
                <a href="#para-quien" className="block py-2 text-gray-400">¿Para quién?</a>
                <div className="pt-3 border-t border-white/5 space-y-3">
                  <Link to="/login" className="block py-2 text-gray-300">Entrar</Link>
                  <Link to="/register" className="block text-center bg-white text-black py-3 rounded-full font-medium">
                    Comenzar gratis
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative px-6 pt-20">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/15 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/3 right-1/5 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Eyebrow */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-primary-400 text-sm font-medium tracking-wide">
              El marketplace de servicios para el hogar
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl mb-6"
          >
            Profesionales{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
              verificados
            </span>
            .
            <br />
            Soluciones{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-primary-400">
              reales
            </span>
            .
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed mb-10"
          >
            Conectamos tu hogar con los mejores electricistas, plomeros, pintores y más. 
            Sin vueltas. Sin sorpresas.
          </motion.p>

          {/* Dual CTA - Interactive */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 mb-16"
          >
            <Link 
              to="/register?role=client"
              className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-[1.02] shadow-lg shadow-white/10"
            >
              <Search className="w-5 h-5" />
              Busco un profesional
              <ArrowRight className="w-5 h-5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Link>
            <Link 
              to="/register?role=provider"
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all hover:scale-[1.02]"
            >
              <Briefcase className="w-5 h-5" />
              Soy profesional
              <ArrowRight className="w-5 h-5 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Link>
          </motion.div>

          {/* Stats - Animated counters */}
          <motion.div 
            id="stats-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="flex flex-wrap gap-8 md:gap-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{professionalsCounter.count}+</div>
                <div className="text-xs text-gray-500">Profesionales</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{servicesCounter.count}+</div>
                <div className="text-xs text-gray-500">Trabajos completados</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-2xl font-bold">{(ratingCounter.count / 10).toFixed(1)}</div>
                <div className="text-xs text-gray-500">Rating promedio</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-gray-600"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Interactive Role Switcher Section */}
      <section id="para-quien" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          {/* Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-16"
          >
            <div className="inline-flex bg-gray-900 rounded-full p-1">
              <button
                onClick={() => setActiveRole('client')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all",
                  activeRole === 'client' 
                    ? "bg-white text-black" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                Soy Cliente
              </button>
              <button
                onClick={() => setActiveRole('provider')}
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium transition-all",
                  activeRole === 'provider' 
                    ? "bg-gradient-to-r from-primary-500 to-orange-500 text-white" 
                    : "text-gray-400 hover:text-white"
                )}
              >
                Soy Profesional
              </button>
            </div>
          </motion.div>

          {/* Content based on role */}
          <AnimatePresence mode="wait">
            {activeRole === 'client' ? (
              <motion.div
                key="client"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Encontrá la solución perfecta en minutos.
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Describí tu problema</h3>
                        <p className="text-sm text-gray-400">"Se rompió el caño", "Necesito pintar". Así de simple.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Recibí propuestas</h3>
                        <p className="text-sm text-gray-400">Profesionales de tu zona te envían sus presupuestos.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Elegí con confianza</h3>
                        <p className="text-sm text-gray-400">Reviews reales, perfiles verificados, sin sorpresas.</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/register?role=client"
                    className="inline-flex items-center gap-2 mt-8 text-primary-400 font-medium hover:text-primary-300 transition-colors"
                  >
                    Empezar a buscar
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="relative">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-800">
                    <div className="h-full flex flex-col justify-center items-center text-center">
                      <Search className="w-16 h-16 text-primary-400 mb-6" />
                      <p className="text-xl font-semibold mb-2">¿Qué necesitás arreglar?</p>
                      <p className="text-sm text-gray-500">Publicá gratis y recibí ofertas</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="provider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="order-2 md:order-1 relative">
                  <div className="aspect-square bg-gradient-to-br from-primary-900/20 to-orange-900/20 rounded-3xl p-8 border border-primary-800/30">
                    <div className="h-full flex flex-col justify-center items-center text-center">
                      <Briefcase className="w-16 h-16 text-orange-400 mb-6" />
                      <p className="text-xl font-semibold mb-2">Hacé crecer tu negocio</p>
                      <p className="text-sm text-gray-500">Clientes que buscan lo que ofrecés</p>
                    </div>
                  </div>
                </div>
                <div className="order-1 md:order-2">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Más clientes. Sin pagar por visibilidad.
                  </h2>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Star className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Ranking por calidad</h3>
                        <p className="text-sm text-gray-400">Tu trabajo te posiciona, no tu billetera.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Solicitações en tu zona</h3>
                        <p className="text-sm text-gray-400">Clientes cercanos que necesitan tu servicio ahora.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-orange-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Chat directo</h3>
                        <p className="text-sm text-gray-400">Sin intermediarios. Comunicación real con tus clientes.</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    to="/register?role=provider"
                    className="inline-flex items-center gap-2 mt-8 text-orange-400 font-medium hover:text-orange-300 transition-colors"
                  >
                    Registrarme como profesional
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* How it works - Timeline */}
      <section id="como-funciona" className="py-24 px-6 bg-gradient-to-b from-transparent via-gray-900/30 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-xs text-gray-500 tracking-widest uppercase">El proceso</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Así de simple funciona</h2>
          </motion.div>

          {/* Horizontal timeline for desktop */}
          <div className="hidden md:flex justify-between items-start relative">
            {/* Connection line */}
            <div className="absolute top-6 left-[10%] right-[10%] h-px bg-gradient-to-r from-primary-500/50 via-orange-500/50 to-green-500/50" />
            
            {[
              { num: 1, title: 'Publicá', desc: 'Describí qué necesitás resolver', color: 'primary' },
              { num: 2, title: 'Recibí', desc: 'Profesionales te envían ofertas', color: 'orange' },
              { num: 3, title: 'Elegí', desc: 'Compará perfiles y contratá', color: 'green' },
            ].map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex-1 flex flex-col items-center text-center px-4"
              >
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold mb-4 z-10",
                  step.color === 'primary' && "bg-primary-500/20 text-primary-400 border border-primary-500/30",
                  step.color === 'orange' && "bg-orange-500/20 text-orange-400 border border-orange-500/30",
                  step.color === 'green' && "bg-green-500/20 text-green-400 border border-green-500/30",
                )}>
                  {step.num}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Vertical timeline for mobile */}
          <div className="md:hidden space-y-8">
            {[
              { num: 1, title: 'Publicá', desc: 'Describí qué necesitás resolver', color: 'primary' },
              { num: 2, title: 'Recibí', desc: 'Profesionales te envían ofertas', color: 'orange' },
              { num: 3, title: 'Elegí', desc: 'Compará perfiles y contratá', color: 'green' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
                  step.color === 'primary' && "bg-primary-500/20 text-primary-400",
                  step.color === 'orange' && "bg-orange-500/20 text-orange-400",
                  step.color === 'green' && "bg-green-500/20 text-green-400",
                )}>
                  {step.num}
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            Unite a la comunidad de HomePlus y transformá la forma en que gestionás tu hogar o tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register?role=client" 
              className="group flex items-center justify-center gap-3 bg-white text-black px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              <Search className="w-5 h-5" />
              Busco un profesional
            </Link>
            <Link 
              to="/register?role=provider" 
              className="group flex items-center justify-center gap-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all"
            >
              <Briefcase className="w-5 h-5" />
              Ofrecer mis servicios
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo variant="mobile" className="filter brightness-0 invert opacity-40" />
          <div className="flex gap-6 text-xs text-gray-600">
            <a href="#" className="hover:text-gray-400 transition-colors">Términos</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-gray-400 transition-colors">Contacto</a>
          </div>
          <p className="text-xs text-gray-700">© 2026 HomePlus</p>
        </div>
      </footer>
    </div>
  );
}
