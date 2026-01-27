import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  Loader2, 
  Wrench, 
  UserCircle, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Search,
  Briefcase,
  Hammer,
  Paintbrush,
  Zap
} from 'lucide-react';
import { useAuthStore } from '../../app/stores';
import { BrandLogo } from '../../components/ui/BrandLogo';

type UserRole = 'CLIENT' | 'PROVIDER';

// Floating tools for background
const floatingTools = [
  { Icon: Wrench, x: '10%', y: '20%', size: 24, delay: 0 },
  { Icon: Hammer, x: '85%', y: '15%', size: 20, delay: 0.3 },
  { Icon: Paintbrush, x: '80%', y: '70%', size: 26, delay: 0.6 },
  { Icon: Zap, x: '15%', y: '75%', size: 18, delay: 0.9 },
];

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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

  // Check for role in URL params
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'client') {
      setRole('CLIENT');
      setStep('details');
    } else if (roleParam === 'provider') {
      setRole('PROVIDER');
      setStep('details');
    }
  }, [searchParams]);

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
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[120px]" />
        
        {/* Floating Tools */}
        {floatingTools.map((tool, i) => (
          <motion.div
            key={i}
            className="absolute opacity-[0.05]"
            style={{ left: tool.x, top: tool.y }}
            animate={{
              y: [0, -15, 0],
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

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver</span>
          </Link>
          <BrandLogo variant="mobile" className="filter brightness-0 invert" />
          <div className="w-20" />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {step === 'role' ? (
              <motion.div
                key="role"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Role Selection Card */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Crear Cuenta</h1>
                    <p className="text-gray-400 text-sm">
                      ¿Cómo vas a usar HomePlus?
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Client Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect('CLIENT')}
                      className="w-full p-5 rounded-2xl border border-gray-800 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                          <Search className="w-6 h-6 text-primary-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-0.5">Busco Profesionales</h3>
                          <p className="text-gray-500 text-sm">
                            Necesito ayuda para mi hogar
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-primary-400 transition-colors" />
                      </div>
                    </motion.button>

                    {/* Provider Option */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect('PROVIDER')}
                      className="w-full p-5 rounded-2xl border border-gray-800 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
                          <Briefcase className="w-6 h-6 text-orange-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-0.5">Soy Profesional</h3>
                          <p className="text-gray-500 text-sm">
                            Quiero ofrecer mis servicios
                          </p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-orange-400 transition-colors" />
                      </div>
                    </motion.button>
                  </div>

                  {/* Tab Switcher */}
                  <div className="flex bg-gray-800/50 rounded-xl p-1 mt-8">
                    <Link
                      to="/login"
                      className="flex-1 py-2.5 px-4 rounded-lg text-gray-400 hover:text-white font-medium text-center text-sm transition-all"
                    >
                      Iniciar Sesión
                    </Link>
                    <button className="flex-1 py-2.5 px-4 rounded-lg bg-white text-black font-medium text-sm transition-all">
                      Crear cuenta
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Details Form Card */}
                <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl p-8">
                  {/* Back Button */}
                  <button
                    onClick={() => setStep('role')}
                    className="flex items-center gap-2 text-gray-500 hover:text-white mb-6 text-sm font-medium transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Cambiar tipo de cuenta
                  </button>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      role === 'PROVIDER' 
                        ? 'bg-orange-500/10' 
                        : 'bg-primary-500/10'
                    }`}>
                      {role === 'PROVIDER' 
                        ? <Briefcase className="w-5 h-5 text-orange-400" />
                        : <UserCircle className="w-5 h-5 text-primary-400" />
                      }
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">
                        {role === 'CLIENT' ? 'Cuenta de Cliente' : 'Cuenta Profesional'}
                      </h1>
                      <p className="text-sm text-gray-500">Completá tus datos</p>
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="mb-6 p-4 bg-gray-800/30 rounded-xl">
                    <div className="space-y-2">
                      {(role === 'PROVIDER' 
                        ? ['Recibí trabajos cerca tuyo', 'Cobrá de forma segura', 'Construí tu reputación']
                        : ['Profesionales verificados', 'Precios transparentes', 'Garantía de satisfacción']
                      ).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className={`w-4 h-4 ${role === 'PROVIDER' ? 'text-orange-400' : 'text-primary-400'}`} />
                          <span className="text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
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
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Nombre</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            placeholder="Juan"
                            required
                            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1.5">Apellido</label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Pérez"
                          required
                          className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@email.com"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-sm"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Contraseña</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Mínimo 8 caracteres"
                          required
                          minLength={8}
                          className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
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
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange-500/20'
                          : 'bg-gradient-to-r from-primary-500 to-orange-500 hover:from-primary-600 hover:to-orange-600 text-white shadow-primary-500/20'
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
                </div>

                {/* Terms */}
                <p className="mt-6 text-center text-xs text-gray-600">
                  Al registrarte, aceptas nuestros{' '}
                  <a href="#" className="text-primary-400 hover:underline">Términos</a>
                  {' '}y{' '}
                  <a href="#" className="text-primary-400 hover:underline">Privacidad</a>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
}
