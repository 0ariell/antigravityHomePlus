import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Wrench, 
  Hammer, 
  Paintbrush, 
  Zap, 
  Droplets,
  ArrowRight,
  Play,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { cn } from '../../lib/utils';

// Scattered floating tools with more organic positioning
const floatingTools = [
  { Icon: Wrench, x: '10%', y: '20%', size: 32, delay: 0, rotate: -15 },
  { Icon: Hammer, x: '85%', y: '15%', size: 28, delay: 0.3, rotate: 20 },
  { Icon: Paintbrush, x: '75%', y: '60%', size: 36, delay: 0.6, rotate: -25 },
  { Icon: Zap, x: '15%', y: '70%', size: 24, delay: 0.9, rotate: 10 },
  { Icon: Droplets, x: '90%', y: '80%', size: 26, delay: 1.2, rotate: -5 },
];

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();
  
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroY = useTransform(scrollY, [0, 400], [0, 100]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">
      {/* Floating Tools - Scattered organically */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingTools.map((tool, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            style={{ left: tool.x, top: tool.y }}
            animate={{
              y: [0, -20, 0],
              rotate: [tool.rotate, tool.rotate + 10, tool.rotate],
            }}
            transition={{
              duration: 6 + i,
              delay: tool.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <tool.Icon size={tool.size} className="text-primary-400" />
          </motion.div>
        ))}
      </div>

      {/* Navigation - Minimal */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled ? "bg-[#0a0a0f]/80 backdrop-blur-2xl py-4" : "bg-transparent py-6"
      )}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="relative z-10">
            <BrandLogo variant="mobile" className="filter brightness-0 invert" />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Entrar
            </Link>
            <Link 
              to="/register" 
              className="text-sm bg-white text-black px-5 py-2.5 rounded-full font-medium hover:bg-gray-100 transition-colors"
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
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden absolute top-full left-0 right-0 bg-[#0a0a0f] border-t border-white/5 p-6"
          >
            <Link to="/login" className="block py-3 text-gray-400">Entrar</Link>
            <Link to="/register" className="block py-3 text-white font-medium">Comenzar gratis</Link>
          </motion.div>
        )}
      </nav>

      {/* Hero - Full screen, editorial style */}
      <motion.section 
        className="min-h-screen flex flex-col justify-center relative px-6"
        style={{ opacity: heroOpacity, y: heroY }}
      >
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/15 rounded-full blur-[100px]" />
        
        <div className="max-w-6xl mx-auto relative z-10 pt-24">
          {/* Eyebrow */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-primary-400 text-sm font-medium tracking-widest uppercase mb-6"
          >
            La nueva forma de cuidar tu hogar
          </motion.p>

          {/* Main Headline - Large, impactful */}
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tight max-w-4xl"
          >
            Profesionales
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-orange-400 to-primary-400">
              reales
            </span>
            <br />
            para problemas reales.
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
          >
            Conectamos tu hogar con electricistas, plomeros, pintores y más. 
            Sin intermediarios innecesarios. Sin sorpresas.
          </motion.p>

          {/* CTA */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-6"
          >
            <Link 
              to="/register" 
              className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all"
            >
              Empezar ahora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="inline-flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
              <div className="w-12 h-12 rounded-full border border-gray-700 flex items-center justify-center hover:border-gray-500 transition-colors">
                <Play className="w-4 h-4 ml-0.5" />
              </div>
              <span className="text-sm">Ver cómo funciona</span>
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ChevronDown className="w-6 h-6 text-gray-600" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* The Problem - Narrative section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <div>
              <span className="text-xs text-gray-500 tracking-widest uppercase">El problema</span>
              <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight">
                Encontrar un buen profesional no debería ser un trabajo en sí mismo.
              </h2>
            </div>
            <div className="space-y-6 text-gray-400">
              <p className="text-lg leading-relaxed">
                Llamadas que no contestan. Presupuestos que nunca llegan. 
                Trabajos a medias. Desconocidos sin referencias.
              </p>
              <p className="text-lg leading-relaxed">
                <span className="text-white font-medium">HomePlus cambia eso.</span> 
                {' '}Cada profesional es verificado. Cada trabajo tiene seguimiento. 
                Cada cliente deja su review real.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How it works - Vertical timeline, not cards */}
      <section className="py-32 px-6 bg-gradient-to-b from-transparent via-gray-900/50 to-transparent">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-xs text-gray-500 tracking-widest uppercase">Cómo funciona</span>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold">Simple. Directo. Efectivo.</h2>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-primary-500/20 to-transparent" />
            
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative flex items-start gap-8 mb-20"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-primary-500/10 border border-primary-500/30 flex items-center justify-center z-10">
                <span className="text-primary-400 font-bold text-xl">1</span>
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-xl font-semibold mb-2">Describí tu problema</h3>
                <p className="text-gray-400">
                  "Se rompió el caño del baño", "Necesito pintar el living". 
                  Nada técnico. Solo contanos qué pasa.
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="relative flex items-start gap-8 mb-20"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center z-10">
                <span className="text-orange-400 font-bold text-xl">2</span>
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-xl font-semibold mb-2">Te llegan propuestas</h3>
                <p className="text-gray-400">
                  Profesionales de tu zona ven tu solicitud y te envían su presupuesto. 
                  Ves su perfil, rating y trabajos anteriores.
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative flex items-start gap-8"
            >
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center z-10">
                <span className="text-green-400 font-bold text-xl">3</span>
              </div>
              <div className="flex-1 pt-3">
                <h3 className="text-xl font-semibold mb-2">Elegí y coordiná</h3>
                <p className="text-gray-400">
                  Chateás directo, acordás fecha y precio. Sin comisiones ocultas. 
                  El trabajo queda registrado y dejás tu review.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* For Providers - Different layout */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10 md:p-16 relative overflow-hidden"
          >
            {/* Background accent */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary-500/5 to-transparent" />
            
            <div className="relative z-10 grid md:grid-cols-2 gap-12">
              <div>
                <span className="text-xs text-orange-400 tracking-widest uppercase">Para profesionales</span>
                <h2 className="mt-4 text-3xl md:text-4xl font-bold leading-tight mb-6">
                  Hacé crecer tu negocio sin depender de nadie.
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Clientes que buscan exactamente lo que ofrecés. 
                  Sin pagar por aparecer primero. Tu reputación te posiciona.
                </p>
                <Link 
                  to="/register?role=provider"
                  className="inline-flex items-center gap-2 text-orange-400 font-medium hover:text-orange-300 transition-colors"
                >
                  Empezar como profesional
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Perfil profesional completo</p>
                    <p className="text-sm text-gray-500">Portfolio, certificaciones, zona de trabajo</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Ranking por calidad, no por pago</p>
                    <p className="text-sm text-gray-500">Mejor trabajo = más visibilidad</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-orange-400 mt-2 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Chat directo con clientes</p>
                    <p className="text-sm text-gray-500">Sin intermediarios, comunicación real</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA - Minimal */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            Tu próximo proyecto empieza acá.
          </h2>
          <Link 
            to="/register" 
            className="inline-flex items-center gap-3 bg-gradient-to-r from-primary-500 to-orange-500 text-white px-10 py-5 rounded-full font-semibold text-lg hover:shadow-lg hover:shadow-primary-500/25 transition-all"
          >
            Crear cuenta gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer - Ultra minimal */}
      <footer className="py-12 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <BrandLogo variant="mobile" className="filter brightness-0 invert opacity-40" />
          <div className="flex gap-8 text-xs text-gray-600">
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
