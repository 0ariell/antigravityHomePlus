import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Home, Mail, Lock, User, Eye, EyeOff, Loader2, Wrench, UserCircle } from 'lucide-react';
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
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16 py-12">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">HomePlus</span>
          </div>

          {step === 'role' ? (
            <>
              {/* Role Selection */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h1>
              <p className="text-gray-500 mb-8">¿Cómo quieres usar HomePlus?</p>

              <div className="space-y-4">
                <button
                  onClick={() => handleRoleSelect('CLIENT')}
                  className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                      <UserCircle className="w-7 h-7 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Soy Cliente</h3>
                      <p className="text-gray-500 text-sm">
                        Busco profesionales para trabajos en mi hogar
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('PROVIDER')}
                  className="w-full p-6 rounded-2xl border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50 transition-all group text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <Wrench className="w-7 h-7 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Soy Profesional</h3>
                      <p className="text-gray-500 text-sm">
                        Ofrezco servicios de plomería, electricidad, pintura, etc.
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              <p className="mt-8 text-center text-gray-500">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium">
                  Iniciar Sesión
                </Link>
              </p>
            </>
          ) : (
            <>
              {/* Details Form */}
              <button
                onClick={() => setStep('role')}
                className="text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1"
              >
                ← Cambiar rol
              </button>

              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {role === 'CLIENT' ? 'Registro de Cliente' : 'Registro de Profesional'}
              </h1>
              <p className="text-gray-500 mb-8">Completa tus datos para continuar</p>

              {/* Tab Switcher */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
                <Link
                  to="/login"
                  className="flex-1 py-2.5 px-4 rounded-lg font-medium text-gray-500 hover:text-gray-700 transition-all text-center"
                >
                  Iniciar Sesión
                </Link>
                <button className="flex-1 py-2.5 px-4 rounded-lg bg-white shadow-sm font-medium text-gray-900 transition-all">
                  Registrarse
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in">
                  {error}
                  <button onClick={clearError} className="ml-2 underline hover:no-underline">Cerrar</button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Nombre"
                      className="input-field pl-12"
                    />
                  </div>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Apellido"
                    className="input-field"
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Correo electrónico"
                    required
                    className="input-field pl-12"
                  />
                </div>

                {/* Password Field */}
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contraseña (mínimo 8 caracteres)"
                    required
                    minLength={8}
                    className="input-field pl-12 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creando cuenta...
                    </>
                  ) : (
                    'Crear Cuenta'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-xs text-gray-500">
                Al registrarte, aceptas nuestros{' '}
                <a href="#" className="text-orange-600 hover:underline">Términos de Servicio</a>
                {' '}y{' '}
                <a href="#" className="text-orange-600 hover:underline">Política de Privacidad</a>
              </p>
            </>
          )}
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-100 via-orange-50 to-white items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-orange-200/50 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-orange-300/40 rounded-full blur-3xl"></div>
        
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-600 rounded-3xl shadow-2xl mx-auto mb-8 flex items-center justify-center">
            <Home className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {role === 'PROVIDER' ? 'Conecta con clientes' : 'Encuentra profesionales'}
          </h2>
          <p className="text-gray-600 max-w-xs mx-auto">
            {role === 'PROVIDER' 
              ? 'Publica tus servicios y recibe solicitudes de trabajo'
              : 'Miles de profesionales certificados listos para ayudarte'
            }
          </p>
        </div>
      </div>
    </div>
  );
}
