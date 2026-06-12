import { useState } from 'react';
import { Package, Plus, Search, Calendar, FileSpreadsheet, AlertTriangle, CheckCircle, BarChart3, TrendingUp, X } from 'lucide-react';
import { esAdmin, BannerSoloLectura } from '../utils/permisos.jsx';

const formatMXN = (n) => `$${n.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function Materiales({ user, materiales, setMateriales, materialesHistorial, setMaterialesHistorial }) {
  const admin = esAdmin(user);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', stock: 0, unidad: 'm²', consumoDiario: 0, precioUnidad: 0, proveedor: '' });

  if (!admin) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">Inventario de Materia Prima</h1>
        <BannerSoloLectura />
      </div>
    );
  }

  const filtered = materiales.filter(m =>
    m.nombre.toLowerCase().includes(search.toLowerCase()) ||
    m.proveedor.toLowerCase().includes(search.toLowerCase())
  );

  const totalValor = materiales.reduce((s, m) => s + (m.stock * m.precioUnidad), 0);
  const gastoDiarioTotal = materiales.reduce((s, m) => s + (m.consumoDiario * m.precioUnidad), 0);

  const handleAddMaterial = (e) => {
    e.preventDefault();
    const nuevo = {
      id: Date.now(),
      nombre: form.nombre,
      stock: parseFloat(form.stock),
      unidad: form.unidad,
      consumoDiario: parseFloat(form.consumoDiario),
      precioUnidad: parseFloat(form.precioUnidad),
      proveedor: form.proveedor
    };

    setMateriales(prev => [...prev, nuevo]);
    
    // Registrar gasto de compra en el historial
    const gasto = {
      id: Date.now() + 1,
      fecha: new Date().toISOString().split('T')[0],
      material: form.nombre,
      cantidad: parseFloat(form.stock),
      costo: parseFloat(form.stock) * parseFloat(form.precioUnidad)
    };
    setMaterialesHistorial(prev => [gasto, ...prev]);

    setShowAddModal(false);
    setForm({ nombre: '', stock: 0, unidad: 'm²', consumoDiario: 0, precioUnidad: 0, proveedor: '' });
  };

  // Exportar historial de gastos a formato XLS (TSV compatible con Excel)
  const exportarGastosXLS = () => {
    const headers = ['ID', 'Fecha', 'Material', 'Cantidad Consumida/Comprada', 'Costo Total (MXN)'];
    const rows = materialesHistorial.map(h => [
      h.id,
      h.fecha,
      h.material,
      h.cantidad,
      formatMXN(h.costo)
    ]);

    const content = [headers, ...rows].map(row => row.join('\t')).join('\n');
    const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `historial_gastos_materiales.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Control de Materia Prima y Consumos</h1>
          <p className="section-subtitle">Inventario de insumos de madera, tapicería, resortes y químicos</p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportarGastosXLS} className="btn-secondary text-xs flex items-center gap-1.5 bg-white border border-slate-200">
            <FileSpreadsheet size={15} className="text-emerald-600" /> Exportar Historial (.xls)
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary text-xs flex items-center gap-1.5">
            <Plus size={15} /> Registrar Compra
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold">Valor Total del Inventario</p>
            <p className="text-2xl font-extrabold text-blue-600 mt-1">{formatMXN(totalValor)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Costo total de materias primas</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <BarChart3 size={22} />
          </div>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold">Gasto Diario Estimado</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{formatMXN(gastoDiarioTotal)}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Basado en consumo por producción diaria</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="card flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-xs font-semibold">Alertas de Stock de Insumos</p>
            <p className="text-2xl font-extrabold text-amber-600 mt-1">
              {materiales.filter(m => m.stock < 15).length}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Materiales en nivel crítico</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertTriangle size={22} />
          </div>
        </div>
      </div>

      {/* Main Material Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-800 text-sm">Lista de Materiales en Stock</h2>
            <div className="relative w-48 sm:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar material..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field pl-9 py-1 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header text-xs">
                  <th className="text-left px-3 py-2.5 rounded-l-lg">Insumo</th>
                  <th className="text-center px-3 py-2.5">Stock</th>
                  <th className="text-left px-3 py-2.5">Consumo Diario</th>
                  <th className="text-right px-3 py-2.5">Precio Unit.</th>
                  <th className="text-right px-3 py-2.5">Valor Neto</th>
                  <th className="text-center px-3 py-2.5 rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => {
                  const bajo = m.stock < 15;
                  return (
                    <tr key={m.id} className="table-row text-xs">
                      <td className="px-3 py-3">
                        <div>
                          <p className="font-semibold text-slate-800">{m.nombre}</p>
                          <p className="text-[10px] text-slate-400">{m.proveedor}</p>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-700">
                        {m.stock} <span className="text-[10px] text-slate-400 font-normal">{m.unidad}</span>
                      </td>
                      <td className="px-3 py-3 text-slate-500">
                        {m.consumoDiario} {m.unidad}/día
                      </td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-600">
                        {formatMXN(m.precioUnidad)}
                      </td>
                      <td className="px-3 py-3 text-right font-bold text-slate-700">
                        {formatMXN(m.stock * m.precioUnidad)}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${bajo ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                          {bajo ? 'Crítico' : 'Suficiente'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expenses log */}
        <div className="card">
          <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-1.5">
            <Calendar size={16} className="text-blue-600" /> Historial de Gastos Diarios
          </h2>
          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {materialesHistorial.map(h => (
              <div key={h.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-slate-800">{h.material}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Cant: {h.cantidad} · {h.fecha}</p>
                </div>
                <span className="font-extrabold text-red-600">{formatMXN(h.costo)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setShowAddModal(false)}>
          <div className="modal-content animate-slide-up max-w-md" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-4 flex items-center justify-between text-white">
              <h3 className="font-bold text-base">Registrar Compra / Insumo</h3>
              <button onClick={() => setShowAddModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleAddMaterial} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Material *</label>
                <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" placeholder="Ej: Madera de Pino" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Cantidad Comprada *</label>
                  <input type="number" min="1" step="any" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Unidad de Medida *</label>
                  <select value={form.unidad} onChange={e => setForm({...form, unidad: e.target.value})} className="input-field">
                    <option>m²</option>
                    <option>m³</option>
                    <option>Litros</option>
                    <option>Pzas</option>
                    <option>Metros</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Precio Unitario ($) *</label>
                  <input type="number" min="0.1" step="any" required value={form.precioUnidad} onChange={e => setForm({...form, precioUnidad: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Consumo Diario *</label>
                  <input type="number" min="0" step="any" required value={form.consumoDiario} onChange={e => setForm({...form, consumoDiario: e.target.value})} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Proveedor</label>
                <input value={form.proveedor} onChange={e => setForm({...form, proveedor: e.target.value})} className="input-field" placeholder="Nombre de la distribuidora" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">Guardar y Comprar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
