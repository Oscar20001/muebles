import { useState } from 'react';
import { Truck, MapPin, Phone, Package, Clock, CheckCircle, ChevronRight, X, Navigation } from 'lucide-react';
import { entregas as entregasData } from '../data/demoData';

const estadoConfig = {
  'Pendiente': { color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400', badge: 'badge-gray', step: 0 },
  'En preparación': { color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500', badge: 'badge-yellow', step: 1 },
  'En ruta': { color: 'text-blue-600', bg: 'bg-blue-100', dot: 'bg-blue-500', badge: 'badge-blue', step: 2 },
  'Entregado': { color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500', badge: 'badge-green', step: 3 },
};

const estados = ['Pendiente', 'En preparación', 'En ruta', 'Entregado'];

export default function Entregas() {
  const [entregas, setEntregas] = useState(entregasData);
  const [filtro, setFiltro] = useState('Todos');
  const [detalleModal, setDetalleModal] = useState(null);

  const filtered = entregas.filter(e =>
    filtro === 'Todos' ? true : e.estado === filtro
  );

  const cambiarEstado = (id, nuevoEstado) => {
    setEntregas(prev => prev.map(e => e.id === id ? { ...e, estado: nuevoEstado } : e));
    if (detalleModal?.id === id) setDetalleModal(prev => ({ ...prev, estado: nuevoEstado }));
  };

  const avanzarEstado = (entrega) => {
    const idx = estados.indexOf(entrega.estado);
    if (idx < estados.length - 1) {
      cambiarEstado(entrega.id, estados[idx + 1]);
    }
  };

  const counts = estados.reduce((acc, e) => ({ ...acc, [e]: entregas.filter(x => x.estado === e).length }), {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Módulo de Entregas</h1>
          <p className="section-subtitle">{entregas.length} entregas registradas</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg">
          <Truck size={14} className="animate-bounce" />
          {counts['En ruta'] || 0} en ruta ahora
        </div>
      </div>

      {/* Pipeline */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {estados.map((estado, i) => {
          const cfg = estadoConfig[estado];
          return (
            <div
              key={estado}
              onClick={() => setFiltro(filtro === estado ? 'Todos' : estado)}
              className={`card cursor-pointer hover:shadow-card-hover transition-all text-center ${filtro === estado ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`w-12 h-12 rounded-full ${cfg.bg} flex items-center justify-center mx-auto mb-2`}>
                {i === 0 && <Clock size={20} className={cfg.color} />}
                {i === 1 && <Package size={20} className={cfg.color} />}
                {i === 2 && <Truck size={20} className={cfg.color} />}
                {i === 3 && <CheckCircle size={20} className={cfg.color} />}
              </div>
              <p className="text-2xl font-extrabold text-slate-800">{counts[estado] || 0}</p>
              <p className="text-xs text-slate-500 mt-0.5">{estado}</p>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {['Todos', ...estados].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${filtro === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
          >
            {f} {f !== 'Todos' && `(${counts[f] || 0})`}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-3 rounded-l-lg">#</th>
                <th className="text-left px-3 py-3">Cliente</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Producto</th>
                <th className="text-left px-3 py-3 hidden lg:table-cell">Dirección</th>
                <th className="text-left px-3 py-3 hidden sm:table-cell">Fecha</th>
                <th className="text-center px-3 py-3">Estado</th>
                <th className="text-center px-3 py-3 rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => {
                const cfg = estadoConfig[e.estado];
                const idx = estados.indexOf(e.estado);
                return (
                  <tr key={e.id} className="table-row">
                    <td className="px-3 py-3 text-slate-400 font-mono text-xs">#{e.id.toString().padStart(3, '0')}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`}></div>
                        <div>
                          <p className="font-semibold text-slate-800">{e.cliente}</p>
                          <p className="text-xs text-slate-400 sm:hidden">{e.fecha}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs hidden md:table-cell max-w-xs">
                      <p className="truncate">{e.producto}</p>
                    </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-1 text-slate-500 text-xs">
                        <MapPin size={11} className="flex-shrink-0" />
                        <span className="truncate max-w-xs">{e.direccion}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-slate-500 text-xs hidden sm:table-cell">{e.fecha}</td>
                    <td className="px-3 py-3 text-center">
                      <span className={cfg.badge}>{e.estado}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setDetalleModal(e)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver detalle"
                        >
                          <ChevronRight size={15} />
                        </button>
                        {idx < estados.length - 1 && (
                          <button
                            onClick={() => avanzarEstado(e)}
                            className="px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold rounded-lg transition-colors"
                          >
                            Avanzar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Truck size={40} className="mx-auto mb-2 opacity-30" />
              <p>No hay entregas en este estado</p>
            </div>
          )}
        </div>
      </div>

      {/* Detalle Modal */}
      {detalleModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setDetalleModal(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">Detalle de Entrega</h2>
                <p className="text-white/60 text-xs mt-0.5">Pedido #{detalleModal.id.toString().padStart(3, '0')}</p>
              </div>
              <button onClick={() => setDetalleModal(null)} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Progress stepper */}
              <div className="flex items-center justify-between relative mb-6">
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-200 -z-0"></div>
                {estados.map((e, i) => {
                  const currentIdx = estados.indexOf(detalleModal.estado);
                  const done = i <= currentIdx;
                  const cfg = estadoConfig[e];
                  return (
                    <div key={e} className="flex flex-col items-center gap-1 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${done ? `${cfg.bg} border-transparent` : 'bg-white border-slate-200'}`}>
                        {done ? (
                          i === currentIdx ? (
                            <div className={`w-3 h-3 rounded-full ${cfg.dot}`}></div>
                          ) : (
                            <CheckCircle size={16} className="text-emerald-500" />
                          )
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        )}
                      </div>
                      <p className={`text-xs font-semibold text-center leading-tight w-16 ${done ? 'text-slate-700' : 'text-slate-300'}`}>{e}</p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-0.5">Cliente</p>
                  <p className="font-bold text-slate-800">{detalleModal.cliente}</p>
                  <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                    <Phone size={11} />{detalleModal.telefono}
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-0.5">Producto</p>
                  <p className="font-semibold text-slate-800">{detalleModal.producto}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-1">Dirección de entrega</p>
                  <div className="flex items-start gap-1.5 text-slate-700">
                    <MapPin size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{detalleModal.direccion}</p>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Fecha programada</p>
                  <p className="font-bold text-slate-800">{detalleModal.fecha}</p>
                </div>
                <div className={`rounded-xl p-3 ${estadoConfig[detalleModal.estado].bg}`}>
                  <p className="text-xs text-slate-400 mb-0.5">Estado actual</p>
                  <p className={`font-bold ${estadoConfig[detalleModal.estado].color}`}>{detalleModal.estado}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {estados.indexOf(detalleModal.estado) < estados.length - 1 && (
                  <button
                    onClick={() => avanzarEstado(detalleModal)}
                    className="btn-primary flex-1 justify-center"
                  >
                    <Navigation size={15} />
                    Avanzar a "{estados[estados.indexOf(detalleModal.estado) + 1]}"
                  </button>
                )}
                <button onClick={() => setDetalleModal(null)} className="btn-secondary flex-1 justify-center">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
