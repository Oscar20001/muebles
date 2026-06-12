import { useState } from 'react';
import { Lock, User, Eye, EyeOff, Sofa, ChevronDown, ChevronUp } from 'lucide-react';

// ─── CREDENCIALES REALES DEL SISTEMA ───────────────────────────────────────
export const USUARIOS_SISTEMA = [
  {
    usuario: 'admin',
    contrasena: 'Fabri2026',
    nombre: 'Administrador General',
    rol: 'Administrador',
    color: 'from-blue-500 to-blue-700',
    avatar: 'AG',
  },
  {
    usuario: 'areyes',
    contrasena: 'Ventas123',
    nombre: 'Ana Reyes Soto',
    rol: 'Vendedora',
    color: 'from-emerald-500 to-emerald-700',
    avatar: 'AR',
  },
  {
    usuario: 'lvega',
    contrasena: 'Conta456',
    nombre: 'Laura Vega Morales',
    rol: 'Contadora',
    color: 'from-violet-500 to-violet-700',
    avatar: 'LV',
  },
  {
    usuario: 'matorres',
    contrasena: 'Ruta789',
    nombre: 'Miguel Ángel Torres',
    rol: 'Repartidor',
    color: 'from-amber-500 to-amber-700',
    avatar: 'MT',
  },
  {
    usuario: 'dcruz',
    contrasena: 'Ventas456',
    nombre: 'Diana Cruz Espinoza',
    rol: 'Vendedora',
    color: 'from-pink-500 to-pink-700',
    avatar: 'DC',
  },
  {
    usuario: 'sflores',
    contrasena: 'Recep321',
    nombre: 'Sandra Flores Leal',
    rol: 'Recepcionista',
    color: 'from-cyan-500 to-cyan-700',
    avatar: 'SF',
  },
];

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreds, setShowCreds] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!usuario || !contrasena) {
      setError('Por favor ingresa usuario y contraseña.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const encontrado = USUARIOS_SISTEMA.find(
        u => u.usuario === usuario.trim().toLowerCase() && u.contrasena === contrasena
      );
      if (encontrado) {
        onLogin(encontrado);
      } else {
        setError('Usuario o contraseña incorrectos. Verifica tus datos.');
      }
    }, 1000);
  };

  const autoLogin = (u) => {
    setUsuario(u.usuario);
    setContrasena('••••••••');
    setLoading(true);
    setShowCreds(false);
    setTimeout(() => {
      setLoading(false);
      onLogin(u);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-slate-800 relative overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4 animate-slide-up">
        {/* Card */}
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-10">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-lg mb-4">
              <Sofa size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-brand-900 tracking-tight">Fábri Muebles</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Sistema Administrativo Empresarial</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              <span className="text-xs text-slate-400 font-medium">v2.4.1 — Producción</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Usuario</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={usuario}
                  onChange={e => setUsuario(e.target.value)}
                  placeholder="Ej: admin"
                  className="input-field pl-10"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={contrasena}
                  onChange={e => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-50 border border-red-200 rounded-lg p-3">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-blue-600 border-slate-300" />
                <span className="text-slate-600">Recordarme</span>
              </label>
              <button type="button" className="text-blue-600 hover:text-blue-700 font-medium">
                ¿Olvidé mi contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Verificando credenciales...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Accesos rápidos demo */}
          <div className="mt-5 border border-blue-100 rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowCreds(!showCreds)}
              className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 hover:bg-blue-100 transition-colors text-sm font-semibold text-blue-700"
            >
              <span>👥 Accesos de demostración</span>
              {showCreds ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {showCreds && (
              <div className="divide-y divide-slate-100 bg-white">
                {USUARIOS_SISTEMA.filter(u => u.usuario !== 'admin').map(u => (
                  <button
                    key={u.usuario}
                    onClick={() => autoLogin(u)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                      {u.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-700 truncate">{u.nombre}</p>
                      <p className="text-xs text-slate-400">{u.rol}</p>
                    </div>
                    <span className="text-xs text-blue-500 font-semibold flex-shrink-0">Ingresar →</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/40 text-xs mt-6">
          © 2026 Fábri Muebles · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}
