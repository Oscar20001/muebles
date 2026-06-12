import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clientes from './pages/Clientes';
import Inventario from './pages/Inventario';
import Ventas from './pages/Ventas';
import Creditos from './pages/Creditos';
import Recordatorios from './pages/Recordatorios';
import Reportes from './pages/Reportes';
import Entregas from './pages/Entregas';
import Trabajadores from './pages/Trabajadores';
import Usuarios from './pages/Usuarios';
import Materiales from './pages/Materiales';
import Configuracion from './pages/Configuracion';
import Sidebar from './components/Sidebar';
import { X } from 'lucide-react';

import {
  productos as initialProductos,
  ventas as initialVentas,
  clientes as initialClientes,
  creditos as initialCreditos,
  entregas as initialEntregas,
  recordatorios as initialRecordatorios
} from './data/demoData';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  // Master States
  const [productos, setProductos] = useState(initialProductos);
  const [ventas, setVentas] = useState(initialVentas);
  const [clientes, setClientes] = useState(initialClientes);
  const [creditos, setCreditos] = useState(initialCreditos);
  const [recordatorios, setRecordatorios] = useState(initialRecordatorios);
  const [entregas, setEntregas] = useState(initialEntregas);

  // Materials State (Admin-only)
  const [materiales, setMateriales] = useState([
    { id: 1, nombre: 'Madera de Pino (Tablas)', stock: 120, unidad: 'm²', consumoDiario: 12, precioUnidad: 350, proveedor: 'Maderera del Pacífico' },
    { id: 2, nombre: 'Barniz Poliuretano', stock: 45, unidad: 'Litros', consumoDiario: 4, precioUnidad: 180, proveedor: 'Químicos del Norte' },
    { id: 3, nombre: 'Resortes Bonnell', stock: 350, unidad: 'Pzas', consumoDiario: 30, precioUnidad: 45, proveedor: 'Aceros del Humaya' },
    { id: 4, nombre: 'Espuma de Poliuretano', stock: 80, unidad: 'm³', consumoDiario: 8, precioUnidad: 220, proveedor: 'Espumas del Noroeste' },
    { id: 5, nombre: 'Telas y Tapices Premium', stock: 95, unidad: 'Metros', consumoDiario: 10, precioUnidad: 150, proveedor: 'Textiles Sinaloa' },
    { id: 6, nombre: 'Pegamento de Madera', stock: 25, unidad: 'Litros', consumoDiario: 2.5, precioUnidad: 90, proveedor: 'Distribuidora F' }
  ]);

  const [materialesHistorial, setMaterialesHistorial] = useState([
    { id: 1, fecha: '2026-06-09', material: 'Madera de Pino (Tablas)', cantidad: 12, costo: 4200 },
    { id: 2, fecha: '2026-06-09', material: 'Barniz Poliuretano', cantidad: 4, costo: 720 },
    { id: 3, fecha: '2026-06-09', material: 'Resortes Bonnell', cantidad: 30, costo: 1350 },
    { id: 4, fecha: '2026-06-08', material: 'Espuma de Poliuretano', cantidad: 8, costo: 1760 },
    { id: 5, fecha: '2026-06-08', material: 'Telas y Tapices Premium', cantidad: 10, costo: 1500 },
    { id: 6, fecha: '2026-06-07', material: 'Pegamento de Madera', cantidad: 2.5, costo: 225 }
  ]);

  const [empresa, setEmpresa] = useState({
    nombre: 'Fábri Muebles',
    logo: '🛋️',
    direccion: 'Av. Álvaro Obregón #123, Culiacán',
    telefono: '667-888-9900'
  });

  // Notifications
  const [toasts, setToasts] = useState([]);
  const [showCobranzaModal, setShowCobranzaModal] = useState(false);

  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  };

  // Trigger alerts on login for administrator
  useEffect(() => {
    if (user?.rol === 'Administrador') {
      setShowCobranzaModal(true);
      addToast("📅 Alerta: Tienes abonos vencidos que se cierran hoy.", "warning");
    }
  }, [user]);

  // Silent simulation of stock changes in real-time (every 12 seconds)
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      // 1. Simular decremento de stock silencioso
      setProductos(prevProducts => {
        const activeProducts = prevProducts.filter(p => p.stock > 0);
        if (activeProducts.length === 0) return prevProducts;
        
        const randomProduct = activeProducts[Math.floor(Math.random() * activeProducts.length)];
        const updatedStock = randomProduct.stock - 1;
        
        // Alerta de stock bajo para el admin
        if (updatedStock < 3 && user.rol === 'Administrador') {
          addToast(`⚠️ Stock bajo: El producto "${randomProduct.nombre}" tiene solo ${updatedStock} unidades en stock.`, 'warning');
        }
        
        return prevProducts.map(p => p.id === randomProduct.id ? { ...p, stock: updatedStock } : p);
      });

      // 2. Simular consumo diario de materiales (solo admin)
      if (user.rol === 'Administrador') {
        setMateriales(prevMaterials => {
          return prevMaterials.map(m => {
            const consumed = m.consumoDiario * 0.1; // simular consumo fraccionado
            const nextStock = Math.max(0, parseFloat((m.stock - consumed).toFixed(1)));
            if (nextStock < 15 && m.stock >= 15) {
              addToast(`🪵 Insumo bajo: El material "${m.nombre}" tiene solo ${nextStock} ${m.unidad} restantes.`, 'warning');
            }
            return { ...m, stock: nextStock };
          });
        });
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [user]);

  const alertCount = recordatorios.filter(r => r.urgencia === 'alta').length;

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  // Enforce access control
  const isUserAdmin = user?.rol === 'Administrador';
  const allowedPage = ((currentPage === 'usuarios' || currentPage === 'materiales') && !isUserAdmin) ? 'dashboard' : currentPage;

  // Map allowed page and inject states as props
  const renderPage = () => {
    switch (allowedPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} user={user} productos={productos} ventas={ventas} clientes={clientes} creditos={creditos} recordatorios={recordatorios} />;
      case 'clientes':
        return <Clientes user={user} clientes={clientes} setClientes={setClientes} />;
      case 'inventario':
        return <Inventario user={user} productos={productos} setProductos={setProductos} />;
      case 'materiales':
        return <Materiales user={user} materiales={materiales} setMateriales={setMateriales} materialesHistorial={materialesHistorial} setMaterialesHistorial={setMaterialesHistorial} />;
      case 'ventas':
        return <Ventas user={user} productos={productos} setProductos={setProductos} clientes={clientes} ventas={ventas} setVentas={setVentas} creditos={creditos} setCreditos={setCreditos} recordatorios={recordatorios} setRecordatorios={setRecordatorios} />;
      case 'creditos':
        return <Creditos user={user} creditos={creditos} setCreditos={setCreditos} />;
      case 'recordatorios':
        return <Recordatorios user={user} recordatorios={recordatorios} setRecordatorios={setRecordatorios} />;
      case 'reportes':
        return <Reportes user={user} ventas={ventas} productos={productos} clientes={clientes} />;
      case 'entregas':
        return <Entregas user={user} entregas={entregas} setEntregas={setEntregas} />;
      case 'trabajadores':
        return <Trabajadores user={user} />;
      case 'usuarios':
        return <Usuarios user={user} />;
      case 'configuracion':
        return <Configuracion user={user} setUser={setUser} empresa={empresa} setEmpresa={setEmpresa} addToast={addToast} />;
      default:
        return <Dashboard onNavigate={setCurrentPage} user={user} productos={productos} ventas={ventas} clientes={clientes} creditos={creditos} recordatorios={recordatorios} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 relative">
      <Sidebar
        currentPage={allowedPage}
        onNavigate={setCurrentPage}
        user={user}
        empresa={empresa}
        onLogout={() => setUser(null)}
        alertCount={alertCount}
      />
      {/* Main content */}
      <main className="flex-1 min-w-0 lg:overflow-auto">
        <div className="pt-14 lg:pt-0 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {renderPage()}
          </div>
        </div>
      </main>

      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-lg text-white text-xs font-semibold flex items-center gap-2.5 transition-all duration-300 transform translate-x-0 pointer-events-auto ${
              t.type === 'warning' ? 'bg-amber-600 border border-amber-500' :
              t.type === 'error' ? 'bg-red-600 border border-red-500' :
              t.type === 'success' ? 'bg-emerald-600 border border-emerald-500' : 'bg-blue-600 border border-blue-500'
            }`}
          >
            <span>{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="ml-auto text-white/80 hover:text-white font-bold pl-2">✕</button>
          </div>
        ))}
      </div>

      {/* Cobranza Alert Modal */}
      {showCobranzaModal && user?.rol === 'Administrador' && (
        <div className="modal-overlay animate-fade-in z-50" onClick={() => setShowCobranzaModal(false)}>
          <div className="modal-content animate-slide-up max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-red-600 to-amber-600 px-6 py-5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <div>
                  <h3 className="font-extrabold text-base leading-tight">Cobros Críticos de Hoy</h3>
                  <p className="text-red-100 text-[10px] mt-0.5">Vencimiento del 10 de junio, 2026</p>
                </div>
              </div>
              <button onClick={() => setShowCobranzaModal(false)} className="text-white/85 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Los siguientes clientes tienen un abono que se cierra hoy o presentan saldo vencido. Requiere acción inmediata:
              </p>
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {creditos
                  .filter(c => c.estado === 'Atrasado' || c.proximoPago === '2026-06-05')
                  .map(c => (
                    <div key={c.id} className="p-3 bg-red-50/60 border border-red-100 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800">{c.cliente}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Producto: {c.producto.substring(0, 30)}...</p>
                        <p className="text-[10px] text-red-500 font-semibold mt-0.5">Próximo pago: {c.proximoPago}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-red-600 text-sm">Saldo: ${c.saldo.toLocaleString('es-MX')}</p>
                        <button 
                          onClick={() => {
                            window.open(`https://wa.me/52${c.telefono?.replace(/-/g,'')}?text=Hola%20${encodeURIComponent(c.cliente)}%2C%20le%20recordamos%20que%20su%20pago%20de%20abono%20en%20F%C3%A1bri%20Muebles%20se%20cierra%20hoy.`, '_blank');
                          }}
                          className="mt-1 px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-[10px] font-bold inline-block"
                        >
                          WhatsApp
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex pt-2">
                <button onClick={() => setShowCobranzaModal(false)} className="btn-primary w-full justify-center">Entendido, proceder a cobranza</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
