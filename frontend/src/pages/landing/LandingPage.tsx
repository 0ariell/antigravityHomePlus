import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Wrench, 
  Hammer, 
  Paintbrush, 
  Zap, 
  Droplets, 
  Home as HomeIcon,
  Shield,
  Star,
  Clock,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Users,
  Briefcase,
  Menu,
  X
} from 'lucide-react';
import { BrandLogo } from '../../components/ui/BrandLogo';
import { cn } from '../../lib/utils';

// Floating tool icons configuration
const floatingIcons = [
  { Icon: Wrench, delay: 0, size: 'lg', angle: 0 },
  { Icon: Hammer, delay: 0.5, size: 'md', angle: 45 },
  { Icon: Paintbrush, delay: 1, size: 'lg', angle: 90 },
  { Icon: Zap, delay: 1.5, size: 'sm', angle: 135 },
  { Icon: Droplets, delay: 2, size: 'md', angle: 180 },
  { Icon: HomeIcon, delay: 2.5, size: 'lg', angle: 225 },
  { Icon: Shield, delay: 3, size: 'sm', angle: 270 },
  { Icon: Star, delay: 3.5, size: 'md', angle: 315 },
];

// Stats
const stats = [
  { value: '100+', label: 'Profesionales Verificados' },
  { value: '500+', label: 'Servicios Completados' },
  { value: '4.8', label: 'Calificación Promedio' },
];

// How it works for clients
const clientSteps = [
  { icon: MessageSquare, title: 'Describe tu problema', desc: 'Cuéntanos qué necesitas arreglar o mejorar en tu hogar.' },
  { icon: Users, title: 'Recibe propuestas', desc: 'Profesionales verificados te contactan con presupuestos.' },
  { icon: CheckCircle, title: 'Elige y coordina', desc: 'Selecciona al mejor, agenda y listo.' },
];

// How it works for providers
const providerSteps = [
  { icon: Briefcase, title: 'Crea tu perfil', desc: 'Muestra tus habilidades, experiencia y portfolio.' },
  { icon: Clock, title: 'Recibe solicitudes', desc: 'Clientes en tu zona te encuentran y contactan.' },
  { icon: Star, title: 'Crece tu reputación', desc: 'Acumula reviews y destaca orgánicamente.' },
];

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-gray-950/90 backdrop-blur-xl shadow-lg" : "bg-transparent"
      )}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <BrandLogo variant="mobile" className="filter brightness-0 invert" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#como-funciona" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Cómo Funciona
              </a>
              <a href="#clientes" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Clientes
              </a>
              <a href="#profesionales" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                Profesionales
              </a>
            </div>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/register" 
                className="bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
              >
                Únete Ahora
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-gray-900/95 backdrop-blur-xl border-t border-gray-800"
          >
            <div className="px-6 py-4 space-y-4">
              <a href="#como-funciona" className="block text-gray-300 hover:text-white py-2">Cómo Funciona</a>
              <a href="#clientes" className="block text-gray-300 hover:text-white py-2">Clientes</a>
              <a href="#profesionales" className="block text-gray-300 hover:text-white py-2">Profesionales</a>
              <div className="pt-4 border-t border-gray-800 space-y-3">
                <Link to="/login" className="block text-center text-gray-300 hover:text-white py-2">
                  Iniciar Sesión
                </Link>
                <Link 
                  to="/register" 
                  className="block text-center bg-gradient-to-r from-primary-500 to-orange-500 text-white px-5 py-3 rounded-full font-semibold"
                >
                  Únete Ahora
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/30 via-gray-950 to-orange-900/20" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tu hogar merece{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-orange-400">
                lo mejor
              </span>
              {' '}— Ahora a un click
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-lg">
              Conectamos hogares con profesionales verificados.
              Soluciones rápidas, transparentes y con garantía de calidad.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/register" 
                className="group bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 flex items-center gap-2"
              >
                Comenzar Ahora
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a 
                href="#como-funciona"
                className="border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white px-8 py-4 rounded-full text-lg font-medium transition-all"
              >
                Ver Cómo Funciona
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: Floating Icons Orbit */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative hidden lg:flex items-center justify-center"
          >
            {/* Center Circle */}
            <div className="relative w-80 h-80">
              {/* Orbit Ring */}
              <div className="absolute inset-0 rounded-full border border-gray-800/50" />
              <div className="absolute inset-8 rounded-full border border-gray-700/30" />
              
              {/* Center Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-700/50">
                  <div className="text-4xl font-bold text-white">100+</div>
                  <div className="text-sm text-gray-400">Profesionales</div>
                </div>
              </div>

              {/* Floating Icons */}
              {floatingIcons.map((item, index) => {
                const radius = 160;
                const angleRad = (item.angle * Math.PI) / 180;
                const x = Math.cos(angleRad) * radius;
                const y = Math.sin(angleRad) * radius;
                
                const sizeClasses = {
                  sm: 'w-10 h-10',
                  md: 'w-12 h-12',
                  lg: 'w-14 h-14',
                };
                const iconSizes = { sm: 20, md: 24, lg: 28 };

                return (
                  <motion.div
                    key={index}
                    className={cn(
                      "absolute rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center shadow-xl border border-gray-700/50",
                      sizeClasses[item.size as keyof typeof sizeClasses]
                    )}
                    style={{
                      left: `calc(50% + ${x}px - ${item.size === 'lg' ? 28 : item.size === 'md' ? 24 : 20}px)`,
                      top: `calc(50% + ${y}px - ${item.size === 'lg' ? 28 : item.size === 'md' ? 24 : 20}px)`,
                    }}
                    animate={{
                      y: [0, -8, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      delay: item.delay,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <item.Icon 
                      className="text-primary-400" 
                      size={iconSizes[item.size as keyof typeof iconSizes]} 
                    />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Clients */}
      <section id="clientes" className="py-24 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-primary-400 text-sm font-semibold uppercase tracking-wider">Para Clientes</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Encuentra la solución perfecta para tu hogar
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              En 3 simples pasos, conecta con el profesional ideal para tu proyecto.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {clientSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-primary-500/30 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="w-14 h-14 bg-primary-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary-500/20 transition-colors">
                  <step.icon className="w-7 h-7 text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Providers */}
      <section id="profesionales" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-orange-400 text-sm font-semibold uppercase tracking-wider">Para Profesionales</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4">
              Haz crecer tu negocio sin límites
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Únete a nuestra red y accede a clientes que buscan exactamente lo que ofreces.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {providerSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-800 hover:border-orange-500/30 transition-all group"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <div className="w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                  <step.icon className="w-7 h-7 text-orange-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-orange-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              ¿Listo para empezar?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Únete a la comunidad de HomePlus y transforma la manera en que gestionas tu hogar o tu negocio.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/register?role=client" 
                className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all"
              >
                Soy Cliente
              </Link>
              <Link 
                to="/register?role=provider" 
                className="bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all"
              >
                Soy Profesional
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <BrandLogo variant="mobile" className="filter brightness-0 invert opacity-60" />
            <div className="flex gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Términos</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Contacto</a>
            </div>
            <div className="text-sm text-gray-600">
              © 2026 HomePlus. Todos los derechos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
