import { useState } from 'react';
import {
  Sofa, LayoutDashboard, Users, Package, ShoppingCart,
  CreditCard, Bell, BarChart3, Truck, LogOut, Menu, X,
  ChevronRight, Settings, UserCheck, ShieldCheck, Hammer
} from 'lucide-react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'inventario', label: 'Inventario', icon: Package },
  { id: 'materiales', label: 'Inventario de Materiales', icon: Hammer },
  { id: 'ventas', label: 'Ventas / POS', icon: ShoppingCart },
  { id: 'creditos', label: 'Créditos y Abonos', icon: CreditCard },
  { id: 'recordatorios', label: 'Recordatorios', icon: Bell },
  { id: 'reportes', label: 'Reportes', icon: BarChart3 },
  { id: 'entregas', label: 'Entregas', icon: Truck },
  { id: 'trabajadores', label: 'Trabajadores', icon: UserCheck },
  { id: 'usuarios', label: 'Usuarios del Sistema', icon: ShieldCheck },
];

export default function Sidebar({ currentPage, onNavigate, user, empresa, onLogout, alertCount }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 text-xl shadow-inner shadow-white/10">
            {empresa?.logo || '🛋️'}
          </div>
          <div className="min-w-0">
            <h2 className="text-white font-extrabold text-base leading-tight truncate">{empresa?.nombre || 'Fábri Muebles'}</h2>
            <p className="text-white/40 text-xs">Sistema Admin</p>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-4 py-4 border-b border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
            {user?.genero ? (
              <span className="text-base">{user.genero}</span>
            ) : (
              <span>{user?.avatar || user?.nombre?.charAt(0) || 'A'}</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.nombre || 'Administrador'}</p>
            <p className="text-white/40 text-xs">{user?.rol || 'Admin'}</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems
          .filter(({ id }) => !['usuarios', 'materiales'].includes(id) || user?.rol === 'Administrador')
          .map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { onNavigate(id); setMobileOpen(false); }}
              className={`sidebar-link w-full text-left ${currentPage === id ? 'active' : ''}`}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {id === 'recordatorios' && alertCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {alertCount}
                </span>
              )}
              {currentPage === id && <ChevronRight size={14} className="opacity-60" />}
            </button>
          ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <button 
          onClick={() => { onNavigate('configuracion'); setMobileOpen(false); }}
          className={`sidebar-link w-full text-left ${currentPage === 'configuracion' ? 'active' : ''}`}
        >
          <Settings size={18} />
          <span>Configuración</span>
        </button>
        <button onClick={onLogout} className="sidebar-link w-full text-left hover:bg-red-500/20 hover:text-red-400">
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar h-screen sticky top-0 flex-shrink-0">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-sidebar flex items-center justify-between px-4 h-14 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-sm shadow-sm">
            {empresa?.logo || '🛋️'}
          </div>
          <span className="text-white font-bold text-sm">{empresa?.nombre || 'Fábri Muebles'}</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white p-1">
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 flex">
          <div className="w-72 bg-sidebar h-full flex flex-col pt-14 shadow-2xl">
            <NavContent />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
