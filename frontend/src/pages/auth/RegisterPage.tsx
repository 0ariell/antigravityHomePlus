import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Loader2, Wrench, UserCircle, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuthStore } from '../../app/stores';

type UserRole = 'CLIENT' | 'PROVIDER';

export function RegisterPage() {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [role, setRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<'role' | 'details'>('role');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;
    
    try {
      await register({ ...formData, role });
      navigate('/dashboard');
    } catch {
      // Error is handled in store
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  return (
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-500 to-orange-400" />
        
        {/* Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="dots" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="1" fill="white"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#dots)"/>
          </svg>
        </div>

        {/* Floating Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-sm"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 left-16 w-24 h-24 bg-white/10 rounded-2xl backdrop-blur-sm"
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="HomePlus" className="h-10 w-auto" />
          </div>

          {/* Dynamic Content */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={role || 'default'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-md"
            >
              {role === 'PROVIDER' ? (
                <>
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <Wrench className="w-10 h-10" />
                  </div>
                  <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Crece tu negocio
                  </h1>
                  <p className="text-lg text-white/80 mb-8">
                    Únete a miles de profesionales que aumentaron sus ingresos con HomePlus.
                  </p>
                  <div className="space-y-3">
                    {['Recibe trabajos cerca de ti', 'Cobra de forma segura', 'Construye tu reputación'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : role === 'CLIENT' ? (
                <>
                  <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <UserCircle className="w-10 h-10" />
                  </div>
                  <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Tu hogar, tu tranquilidad
                  </h1>
                  <p className="text-lg text-white/80 mb-8">
                    Encuentra profesionales verificados en minutos para cualquier trabajo.
                  </p>
                  <div className="space-y-3">
                    {['Profesionales verificados', 'Precios transparentes', 'Garantía de satisfacción'].map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-300" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Únete a HomePlus
                  </h1>
                  <p className="text-lg text-white/80">
                    La plataforma que conecta hogares con profesionales de confianza.
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>

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
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <img src="/logo.png" alt="HomePlus" className="h-9 w-auto" />
          </div>

          <AnimatePresence mode="wait">
            {step === 'role' ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Role Selection */}
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Crear Cuenta
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">¿Cómo vas a usar HomePlus?</p>

                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('CLIENT')}
                    className="w-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-all group text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-primary-100 dark:bg-primary-500/20 rounded-xl flex items-center justify-center group-hover:bg-primary-200 dark:group-hover:bg-primary-500/30 transition-colors">
                        <UserCircle className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Busco Profesionales</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Necesito ayuda para trabajos en mi hogar
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 transition-colors" />
                    </div>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleSelect('PROVIDER')}
                    className="w-full p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all group text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-amber-100 dark:bg-amber-500/20 rounded-xl flex items-center justify-center group-hover:bg-amber-200 dark:group-hover:bg-amber-500/30 transition-colors">
                        <Wrench className="w-7 h-7 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Soy Profesional</h3>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          Quiero ofrecer mis servicios y conseguir trabajos
                        </p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-amber-500 transition-colors" />
                    </div>
                  </motion.button>
                </div>

                <p className="mt-8 text-center text-gray-500 dark:text-gray-400">
                  ¿Ya tienes cuenta?{' '}
                  <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-medium">
                    Iniciar Sesión
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Back Button */}
                <button
                  onClick={() => setStep('role')}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Cambiar tipo de cuenta
                </button>

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    role === 'PROVIDER' 
                      ? 'bg-amber-100 dark:bg-amber-500/20' 
                      : 'bg-primary-100 dark:bg-primary-500/20'
                  }`}>
                    {role === 'PROVIDER' 
                      ? <Wrench className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      : <UserCircle className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    }
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {role === 'CLIENT' ? 'Cuenta de Cliente' : 'Cuenta Profesional'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Completa tus datos</p>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-700 dark:text-red-400 text-sm"
                  >
                    {error}
                    <button onClick={clearError} className="ml-2 underline hover:no-underline">Cerrar</button>
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Nombre</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Juan"
                          required
                          className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Apellido</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Pérez"
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@email.com"
                        required
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Mínimo 8 caracteres"
                        required
                        minLength={8}
                        className="w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isLoading}
                    className={`w-full font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 ${
                      role === 'PROVIDER'
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/25'
                        : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-primary-500/25'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Creando cuenta...
                      </>
                    ) : (
                      <>
                        Crear mi cuenta
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Terms */}
                <p className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
                  Al registrarte, aceptas nuestros{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Términos</a>
                  {' '}y{' '}
                  <a href="#" className="text-primary-600 dark:text-primary-400 hover:underline">Privacidad</a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
