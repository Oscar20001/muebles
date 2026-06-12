import { useState } from 'react';
import { Search, Plus, Package, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { esAdmin, BannerSoloLectura } from '../utils/permisos.jsx';

const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;
const categorias = ['Todas', 'Colchones', 'Camas', 'Bases', 'Salas', 'Comedores', 'Clósets', 'Cocinas', 'Escritorios', 'Cajoneras'];
const stockStatus = (stock) => {
  if (stock === 0) return { label: 'Sin stock', cls: 'badge-red', dot: 'bg-red-500' };
  if (stock <= 3) return { label: 'Stock bajo', cls: 'badge-yellow', dot: 'bg-amber-500' };
  return { label: 'Disponible', cls: 'badge-green', dot: 'bg-emerald-500' };
};
const emojiCategory = { Colchones: '🛏️', Camas: '🪵', Bases: '📦', Salas: '🛋️', Comedores: '🍽️', Clósets: '🚪', Cocinas: '🍳', Escritorios: '💼', Cajoneras: '🗄️' };
const initialForm = { codigo: '', nombre: '', categoria: 'Colchones', stock: 0, precio: 0, descripcion: '' };

export default function Inventario({ user, productos, setProductos }) {
  const admin = esAdmin(user);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Todas');
  const [vista, setVista] = useState('grid');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);

  const filtered = productos.filter(p => {
    const matchSearch = p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === 'Todas' || p.categoria === catFilter;
    return matchSearch && matchCat;
  });

  const sinStock = productos.filter(p => p.stock === 0).length;
  const stockBajo = productos.filter(p => p.stock > 0 && p.stock <= 3).length;

  const openEdit = (p) => { if (!admin) return; setForm({ ...p }); setEditingId(p.id); setShowModal(true); };
  const openNew = () => { setForm(initialForm); setEditingId(null); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(initialForm); setEditingId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setProductos(prev => prev.map(p => p.id === editingId ? { ...form, id: editingId } : p));
    } else {
      setProductos(prev => [...prev, { ...form, id: Date.now(), imagen: emojiCategory[form.categoria] || '📦' }]);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Módulo de Inventario</h1>
          <p className="section-subtitle">{productos.length} productos registrados</p>
        </div>
        {/* Solo admin puede agregar productos */}
        {admin && (
          <button onClick={openNew} className="btn-primary">
            <Plus size={16} /> Nuevo Producto
          </button>
        )}
      </div>

      {!admin && <BannerSoloLectura />}

      {(sinStock > 0 || stockBajo > 0) && (
        <div className="flex flex-wrap gap-3">
          {sinStock > 0 && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle size={16} className="text-red-500" />
              <span className="font-semibold text-red-700">{sinStock} producto(s) sin stock</span>
            </div>
          )}
          {stockBajo > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle size={16} className="text-amber-500" />
              <span className="font-semibold text-amber-700">{stockBajo} producto(s) con stock bajo</span>
            </div>
          )}
        </div>
      )}

      {/* Stats por categoría */}
      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
        {categorias.filter(c => c !== 'Todas').map(cat => {
          const count = productos.filter(p => p.categoria === cat).length;
          return (
            <button key={cat} onClick={() => setCatFilter(cat === catFilter ? 'Todas' : cat)}
              className={`card text-center p-3 cursor-pointer hover:shadow-card-hover transition-all ${catFilter === cat ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <div className="text-xl mb-1">{emojiCategory[cat]}</div>
              <p className="text-xs font-bold text-slate-800">{count}</p>
              <p className="text-xs text-slate-400 leading-tight">{cat}</p>
            </button>
          );
        })}
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar producto o código..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="input-field sm:w-44">
            {categorias.map(c => <option key={c}>{c}</option>)}
          </select>
          <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
            <button onClick={() => setVista('grid')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${vista === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>⊞ Tarjetas</button>
            <button onClick={() => setVista('list')} className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${vista === 'list' ? 'bg-white shadow text-blue-600' : 'text-slate-500'}`}>☰ Lista</button>
          </div>
        </div>

        {vista === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(p => {
              const status = stockStatus(p.stock);
              return (
                <div key={p.id} className={`border border-slate-100 rounded-xl p-4 hover:shadow-card-hover transition-all bg-white group ${admin ? 'cursor-pointer' : ''}`}
                  onClick={() => admin && openEdit(p)}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl flex items-center justify-center text-3xl border border-slate-100">{p.imagen}</div>
                    <span className={status.cls}>{status.label}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mb-1">{p.codigo}</p>
                  <h3 className="font-bold text-slate-800 text-sm leading-tight mb-1">{p.nombre}</h3>
                  <p className="text-xs text-slate-500 mb-3 line-clamp-2">{p.descripcion}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-lg font-extrabold text-blue-600">{formatMXN(p.precio)}</p>
                      <p className="text-xs text-slate-400">Stock: <span className={`font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 3 ? 'text-amber-500' : 'text-emerald-600'}`}>{p.stock} uds.</span></p>
                    </div>
                    {admin && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={e => { e.stopPropagation(); openEdit(p); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="table-header">
                  <th className="text-left px-3 py-3 rounded-l-lg">Producto</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Código</th>
                  <th className="text-left px-3 py-3">Categoría</th>
                  <th className="text-center px-3 py-3">Stock</th>
                  <th className="text-right px-3 py-3">Precio</th>
                  <th className="text-center px-3 py-3 rounded-r-lg">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const status = stockStatus(p.stock);
                  return (
                    <tr key={p.id} className={`table-row ${admin ? 'cursor-pointer' : ''}`} onClick={() => admin && openEdit(p)}>
                      <td className="px-3 py-3"><div className="flex items-center gap-3"><span className="text-xl">{p.imagen}</span><span className="font-medium text-slate-800">{p.nombre}</span></div></td>
                      <td className="px-3 py-3 text-slate-400 font-mono text-xs hidden sm:table-cell">{p.codigo}</td>
                      <td className="px-3 py-3 text-slate-600">{p.categoria}</td>
                      <td className="px-3 py-3 text-center"><span className={`font-bold ${p.stock === 0 ? 'text-red-500' : p.stock <= 3 ? 'text-amber-500' : 'text-emerald-600'}`}>{p.stock}</span></td>
                      <td className="px-3 py-3 text-right font-bold text-blue-600">{formatMXN(p.precio)}</td>
                      <td className="px-3 py-3 text-center"><span className={status.cls}>{status.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <Package size={40} className="mx-auto mb-2 opacity-30" />
            <p>No se encontraron productos</p>
          </div>
        )}
      </div>

      {/* Modal — solo admin llega aquí */}
      {showModal && admin && (
        <div className="modal-overlay animate-fade-in" onClick={closeModal}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={closeModal} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Código *</label>
                  <input required value={form.codigo} onChange={e => setForm({...form, codigo: e.target.value})} className="input-field" placeholder="CAT-001" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Categoría</label>
                  <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})} className="input-field">
                    {categorias.filter(c => c !== 'Todas').map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre del Producto *</label>
                  <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" placeholder="Nombre descriptivo del producto" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Stock</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm({...form, stock: parseInt(e.target.value)})} className="input-field" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Precio (MXN) *</label>
                  <input required type="number" min="0" value={form.precio} onChange={e => setForm({...form, precio: parseInt(e.target.value)})} className="input-field" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción</label>
                  <textarea value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} className="input-field h-20 resize-none" placeholder="Descripción breve del producto" />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editingId ? 'Guardar Cambios' : 'Agregar Producto'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
