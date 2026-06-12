import { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, X, Phone, MapPin, CreditCard, User, FileText } from 'lucide-react';
import { esAdmin, BannerSoloLectura } from '../utils/permisos.jsx';

const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;

const estadoBadge = (estado) => {
  const map = { Activo: 'badge-green', Moroso: 'badge-red', Inactivo: 'badge-gray' };
  return map[estado] || 'badge-gray';
};

const initialForm = {
  nombre: '', telefono: '', whatsapp: '', direccion: '', ine: '', referencias: '', estado: 'Activo', saldo: 0
};

export default function Clientes({ user, clientes, setClientes }) {
  const admin = esAdmin(user);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [viewCliente, setViewCliente] = useState(null);

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.telefono.includes(search) ||
    c.estado.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(initialForm); setEditingId(null); setShowModal(true); };
  const openEdit = (c) => { if (!admin) return; setForm({ ...c }); setEditingId(c.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setForm(initialForm); setEditingId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setClientes(prev => prev.map(c => c.id === editingId ? { ...form, id: editingId } : c));
    } else {
      setClientes(prev => [...prev, { ...form, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (!admin) return;
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      setClientes(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Módulo de Clientes</h1>
          <p className="section-subtitle">{clientes.length} clientes registrados</p>
        </div>
        {/* Todos pueden agregar nuevo cliente */}
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Nuevo Cliente
        </button>
      </div>

      {/* Banner solo lectura para no admins */}
      {!admin && <BannerSoloLectura />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-blue-600">{clientes.filter(c => c.estado === 'Activo').length}</p>
          <p className="text-xs text-slate-500 mt-1">Activos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-red-500">{clientes.filter(c => c.estado === 'Moroso').length}</p>
          <p className="text-xs text-slate-500 mt-1">Morosos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-slate-500">{clientes.filter(c => c.estado === 'Inactivo').length}</p>
          <p className="text-xs text-slate-500 mt-1">Inactivos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-amber-600">
            {formatMXN(clientes.reduce((s, c) => s + c.saldo, 0))}
          </p>
          <p className="text-xs text-slate-500 mt-1">Saldo Total</p>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar por nombre, teléfono o estado..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
          <select className="input-field sm:w-40">
            <option>Todos los estados</option>
            <option>Activo</option>
            <option>Moroso</option>
            <option>Inactivo</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-3 rounded-l-lg">Cliente</th>
                <th className="text-left px-3 py-3 hidden sm:table-cell">Teléfono</th>
                <th className="text-left px-3 py-3 hidden lg:table-cell">Dirección</th>
                <th className="text-left px-3 py-3">Estado</th>
                <th className="text-right px-3 py-3 hidden sm:table-cell">Saldo</th>
                <th className="text-center px-3 py-3 rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="table-row">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {c.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800 leading-tight">{c.nombre}</p>
                        <p className="text-xs text-slate-400 sm:hidden">{c.telefono}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 hidden sm:table-cell">{c.telefono}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs hidden lg:table-cell max-w-xs truncate">{c.direccion}</td>
                  <td className="px-3 py-3"><span className={estadoBadge(c.estado)}>{c.estado}</span></td>
                  <td className="px-3 py-3 text-right font-semibold hidden sm:table-cell">
                    <span className={c.saldo > 0 ? 'text-red-600' : 'text-emerald-600'}>
                      {c.saldo > 0 ? formatMXN(c.saldo) : 'Sin adeudo'}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      {/* Ver perfil: todos pueden */}
                      <button onClick={() => setViewCliente(c)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Ver historial">
                        <Eye size={15} />
                      </button>
                      {/* Editar y Eliminar: solo admin */}
                      {admin && (
                        <>
                          <button onClick={() => openEdit(c)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors" title="Editar">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                            <Trash2 size={15} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <User size={40} className="mx-auto mb-2 opacity-30" />
              <p>No se encontraron clientes</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="modal-overlay animate-fade-in" onClick={closeModal}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{editingId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                <p className="text-white/60 text-xs mt-0.5">Fábri Muebles — Registro de clientes</p>
              </div>
              <button onClick={closeModal} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1"><User size={12} className="inline mr-1" />Nombre Completo *</label>
                  <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" placeholder="Nombre completo del cliente" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1"><Phone size={12} className="inline mr-1" />Teléfono *</label>
                  <input required value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="input-field" placeholder="667-000-0000" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">📱 WhatsApp</label>
                  <input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} className="input-field" placeholder="667-000-0000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1"><MapPin size={12} className="inline mr-1" />Dirección</label>
                  <input value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} className="input-field" placeholder="Calle, número, colonia, ciudad" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1"><CreditCard size={12} className="inline mr-1" />INE</label>
                  <input value={form.ine} onChange={e => setForm({...form, ine: e.target.value})} className="input-field" placeholder="Número de INE" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
                  {/* Solo admin puede cambiar estado */}
                  <select disabled={!admin} value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className={`input-field ${!admin ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}>
                    <option>Activo</option>
                    <option>Inactivo</option>
                    <option>Moroso</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1"><FileText size={12} className="inline mr-1" />Referencias Personales</label>
                  <textarea value={form.referencias} onChange={e => setForm({...form, referencias: e.target.value})} className="input-field h-20 resize-none" placeholder="Nombre y teléfono de referencias" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">
                  {editingId ? 'Guardar Cambios' : 'Registrar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View modal */}
      {viewCliente && (
        <div className="modal-overlay animate-fade-in" onClick={() => setViewCliente(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">Perfil del Cliente</h2>
              <button onClick={() => setViewCliente(null)} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xl">
                  {viewCliente.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{viewCliente.nombre}</h3>
                  <span className={estadoBadge(viewCliente.estado)}>{viewCliente.estado}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Teléfono</p>
                  <p className="font-semibold text-slate-700">{viewCliente.telefono}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">WhatsApp</p>
                  <p className="font-semibold text-slate-700">{viewCliente.whatsapp}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-0.5">Dirección</p>
                  <p className="font-semibold text-slate-700">{viewCliente.direccion}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">INE</p>
                  <p className="font-semibold text-slate-700 text-xs">{viewCliente.ine}</p>
                </div>
                <div className={`rounded-xl p-3 ${viewCliente.saldo > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
                  <p className="text-xs text-slate-400 mb-0.5">Saldo Pendiente</p>
                  <p className={`font-bold text-lg ${viewCliente.saldo > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {viewCliente.saldo > 0 ? formatMXN(viewCliente.saldo) : 'Sin adeudo'}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-400 mb-0.5">Referencias</p>
                  <p className="font-semibold text-slate-700 text-sm">{viewCliente.referencias}</p>
                </div>
              </div>
              <button onClick={() => setViewCliente(null)} className="btn-primary w-full justify-center">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
