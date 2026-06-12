import { useState } from 'react';
import { CreditCard, Plus, History, Printer, X, CheckCircle } from 'lucide-react';
import { esAdmin, BannerSoloLectura } from '../utils/permisos.jsx';

const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;
const estadoBadge = (estado) => {
  const map = { 'Al corriente': 'badge-green', Atrasado: 'badge-red', Liquidado: 'badge-gray' };
  return map[estado] || 'badge-gray';
};

export default function Creditos({ user, creditos, setCreditos }) {
  const admin = esAdmin(user);
  const [filterEstado, setFilterEstado] = useState('Todos');
  const [abonoModal, setAbonoModal] = useState(null);
  const [historialModal, setHistorialModal] = useState(null);
  const [estadoCuentaModal, setEstadoCuentaModal] = useState(null);
  const [montoAbono, setMontoAbono] = useState('');
  const [abonoSuccess, setAbonoSuccess] = useState(false);

  const filtered = creditos.filter(c =>
    filterEstado === 'Todos' || c.estado === filterEstado
  );

  const totalPendiente = creditos.filter(c => c.estado !== 'Liquidado').reduce((s, c) => s + c.saldo, 0);
  const atrasados = creditos.filter(c => c.estado === 'Atrasado').length;
  const alCorriente = creditos.filter(c => c.estado === 'Al corriente').length;

  const registrarAbono = () => {
    const monto = parseFloat(montoAbono);
    if (!monto || monto <= 0) { alert('Ingresa un monto válido'); return; }
    setCreditos(prev => prev.map(c => {
      if (c.id !== abonoModal.id) return c;
      const nuevoSaldo = Math.max(0, c.saldo - monto);
      return {
        ...c,
        saldo: nuevoSaldo,
        abonos: c.abonos + monto,
        estado: nuevoSaldo === 0 ? 'Liquidado' : c.estado,
        historial: [...c.historial, { fecha: new Date().toISOString().split('T')[0], monto, concepto: 'Abono registrado' }]
      };
    }));
    setAbonoSuccess(true);
    setTimeout(() => { setAbonoSuccess(false); setAbonoModal(null); setMontoAbono(''); }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Créditos y Abonos</h1>
          <p className="section-subtitle">Gestión de cuentas por cobrar</p>
        </div>
      </div>

      {!admin && <BannerSoloLectura />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-red-500">{formatMXN(totalPendiente)}</p>
          <p className="text-xs text-slate-500 mt-1">Total por cobrar</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-red-600">{atrasados}</p>
          <p className="text-xs text-slate-500 mt-1">Cuentas atrasadas</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-emerald-600">{alCorriente}</p>
          <p className="text-xs text-slate-500 mt-1">Al corriente</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-slate-500">{creditos.filter(c => c.estado === 'Liquidado').length}</p>
          <p className="text-xs text-slate-500 mt-1">Liquidados</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['Todos', 'Al corriente', 'Atrasado', 'Liquidado'].map(e => (
          <button key={e} onClick={() => setFilterEstado(e)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterEstado === e ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
            {e}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(credito => {
          const prog = Math.round(((credito.precio - credito.enganche - credito.saldo) / (credito.precio - credito.enganche)) * 100);
          return (
            <div key={credito.id} className={`card hover:shadow-card-hover transition-all border-l-4 ${credito.estado === 'Atrasado' ? 'border-l-red-500' : credito.estado === 'Liquidado' ? 'border-l-slate-300' : 'border-l-emerald-500'}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {credito.cliente.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{credito.cliente}</h3>
                  </div>
                  <p className="text-xs text-slate-500 pl-10">{credito.producto}</p>
                </div>
                <span className={estadoBadge(credito.estado)}>{credito.estado}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-xs text-slate-400">Precio Total</p>
                  <p className="font-bold text-slate-800 text-sm">{formatMXN(credito.precio)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-xs text-slate-400">Enganche</p>
                  <p className="font-bold text-emerald-600 text-sm">{formatMXN(credito.enganche)}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2.5">
                  <p className="text-xs text-red-400">Saldo Pendiente</p>
                  <p className="font-extrabold text-red-600 text-lg">{formatMXN(credito.saldo)}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <p className="text-xs text-slate-400">Próximo Pago</p>
                  <p className="font-bold text-slate-800 text-sm">{credito.proximoPago || '—'}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Avance de pago</span>
                  <span className="font-bold">{prog}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${credito.estado === 'Atrasado' ? 'bg-red-400' : credito.estado === 'Liquidado' ? 'bg-slate-400' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(prog, 100)}%` }} />
                </div>
              </div>
              <div className="flex gap-2">
                {/* Registrar Abono: solo admin */}
                {admin && credito.estado !== 'Liquidado' && (
                  <button onClick={() => { setAbonoModal(credito); setMontoAbono(''); }} className="btn-success flex-1 justify-center text-xs">
                    <Plus size={13} /> Registrar Abono
                  </button>
                )}
                {/* Ver historial: todos pueden */}
                <button onClick={() => setHistorialModal(credito)} className="btn-secondary text-xs px-2.5">
                  <History size={13} />
                </button>
                <button onClick={() => setEstadoCuentaModal(credito)} className="btn-secondary text-xs px-2.5">
                  <Printer size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Abono Modal — solo admin */}
      {abonoModal && admin && (
        <div className="modal-overlay animate-fade-in" onClick={() => setAbonoModal(null)}>
          <div className="modal-content animate-slide-up max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Registrar Abono</h2>
              <button onClick={() => setAbonoModal(null)} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6">
              {abonoSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle size={50} className="text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-slate-800 text-lg">¡Abono registrado!</p>
                  <p className="text-slate-500 text-sm mt-1">El pago fue guardado correctamente</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-slate-800">{abonoModal.cliente}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{abonoModal.producto}</p>
                    <div className="mt-3 flex justify-between">
                      <span className="text-xs text-slate-400">Saldo actual:</span>
                      <span className="font-extrabold text-red-600">{formatMXN(abonoModal.saldo)}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Monto del abono ($)</label>
                    <input type="number" min="1" max={abonoModal.saldo} value={montoAbono} onChange={e => setMontoAbono(e.target.value)} className="input-field text-lg font-bold" placeholder="0.00" autoFocus />
                  </div>
                  {montoAbono && (
                    <div className="bg-emerald-50 rounded-xl p-3 mb-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Nuevo saldo:</span>
                        <span className="font-bold text-emerald-600">{formatMXN(Math.max(0, abonoModal.saldo - parseFloat(montoAbono || 0)))}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => setAbonoModal(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                    <button onClick={registrarAbono} className="btn-primary flex-1 justify-center bg-emerald-600 hover:bg-emerald-700">Confirmar Abono</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Historial Modal — todos pueden ver */}
      {historialModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setHistorialModal(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <div><h2 className="text-white font-bold">Historial de Pagos</h2><p className="text-white/60 text-xs mt-0.5">{historialModal.cliente}</p></div>
              <button onClick={() => setHistorialModal(null)} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {historialModal.historial.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <div><p className="text-sm font-semibold text-slate-800">{h.concepto}</p><p className="text-xs text-slate-400">{h.fecha}</p></div>
                    </div>
                    <span className="font-bold text-emerald-600">{formatMXN(h.monto)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between font-bold">
                <span className="text-slate-700">Total abonado:</span>
                <span className="text-emerald-600">{formatMXN(historialModal.historial.reduce((s, h) => s + h.monto, 0) + historialModal.enganche)}</span>
              </div>
              <button onClick={() => setHistorialModal(null)} className="btn-primary w-full justify-center mt-4">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Estado de Cuenta — todos pueden ver */}
      {estadoCuentaModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setEstadoCuentaModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 animate-slide-up overflow-hidden">
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-4 text-center text-white">
              <h2 className="font-extrabold text-lg">ESTADO DE CUENTA</h2>
              <p className="text-white/60 text-xs">Fábri Muebles</p>
            </div>
            <div className="p-6 space-y-3 text-sm">
              <div className="text-center mb-2"><p className="text-xs text-slate-400">{new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}</p></div>
              <div className="border-b border-dashed pb-3"><p className="text-xs text-slate-400">CLIENTE</p><p className="font-bold text-slate-800">{estadoCuentaModal.cliente}</p></div>
              <div className="border-b border-dashed pb-3"><p className="text-xs text-slate-400">PRODUCTO</p><p className="font-semibold text-slate-700">{estadoCuentaModal.producto}</p></div>
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-xs text-slate-400">Precio</p><p className="font-bold">{formatMXN(estadoCuentaModal.precio)}</p></div>
                <div><p className="text-xs text-slate-400">Enganche</p><p className="font-bold text-emerald-600">{formatMXN(estadoCuentaModal.enganche)}</p></div>
                <div><p className="text-xs text-slate-400">Total abonado</p><p className="font-bold text-blue-600">{formatMXN(estadoCuentaModal.abonos)}</p></div>
                <div><p className="text-xs text-slate-400">Saldo</p><p className="font-extrabold text-red-600">{formatMXN(estadoCuentaModal.saldo)}</p></div>
              </div>
              <div className={`rounded-xl p-3 text-center font-bold ${estadoCuentaModal.estado === 'Atrasado' ? 'bg-red-50 text-red-600' : estadoCuentaModal.estado === 'Liquidado' ? 'bg-slate-50 text-slate-600' : 'bg-emerald-50 text-emerald-600'}`}>
                ESTADO: {estadoCuentaModal.estado.toUpperCase()}
              </div>
              <div className="flex gap-3">
                <button className="btn-secondary flex-1 justify-center text-xs"><Printer size={14} /> Imprimir</button>
                <button onClick={() => setEstadoCuentaModal(null)} className="btn-primary flex-1 justify-center">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
