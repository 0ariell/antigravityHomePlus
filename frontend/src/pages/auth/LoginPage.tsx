import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, Shield, Star, Users } from 'lucide-react';
import { useAuthStore } from '../../app/stores';
import { BrandLogo } from '../../components/ui/BrandLogo';

const features = [
  { icon: Shield, title: 'Profesionales verificados', desc: 'Todos pasan por un proceso de validación' },
  { icon: Star, title: 'Calidad garantizada', desc: 'Valoraciones reales de clientes' },
  { icon: Users, title: '+2,000 profesionales', desc: 'Encuentra al experto perfecto' },
];

export function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-orange-400" />
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>

        {/* Floating Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-sm"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/4 w-16 h-16 bg-orange-300/30 rounded-full blur-xl"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="mb-8">
            <BrandLogo variant="auth" className="justify-start" />
          </div>

          {/* Hero Text */}
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Tu hogar merece lo mejor
            </h1>
            <p className="text-lg text-white/80 mb-10">
              Conectamos hogares con profesionales verificados. Soluciones rápidas, 
              transparentes y sin complicaciones.
            </p>

            {/* Feature List */}
            <div className="space-y-4">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{feature.title}</p>
                    <p className="text-sm text-white/60">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <p className="text-sm text-white/50">
            © 2024 HomePlus. Todos los derechos reservados.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12 bg-white dark:bg-[#0f172a]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full mx-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10">
            <BrandLogo variant="mobile" />
          </div>

          {/* Header */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Bienvenido de vuelta
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Ingresa tus credenciales para continuar
          </p>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100 dark:bg-gray-800/50 rounded-xl p-1.5 mb-8">
            <button className="flex-1 py-2.5 px-4 rounded-lg bg-white dark:bg-gray-700 shadow-sm font-semibold text-gray-900 dark:text-white transition-all text-sm">
              Iniciar Sesión
            </button>
            <Link
              to="/register"
              className="flex-1 py-2.5 px-4 rounded-lg font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-all text-center text-sm"
            >
              Crear cuenta
            </Link>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm"
            >
              {error}
              <button onClick={clearError} className="ml-2 underline hover:no-underline">
                Cerrar
              </button>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => alert('Función próximamente')}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white dark:bg-[#0f172a] text-gray-500">O continúa con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert('Google Login: Próximamente')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => alert('Apple Login: Próximamente')}
              className="flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 dark:bg-white rounded-xl hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-white dark:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span className="text-sm font-medium text-white dark:text-gray-900">Apple</span>
            </motion.button>
          </div>

          {/* Terms */}
          <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
            Al continuar, aceptas nuestros{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Términos de Servicio</a>
            {' '}y{' '}
            <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Política de Privacidad</a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
