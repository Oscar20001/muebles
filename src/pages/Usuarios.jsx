import { useState } from 'react';
import {
  Shield, Plus, Edit2, Trash2, Eye, EyeOff,
  X, Search, Key, CheckCircle, ToggleLeft, ToggleRight, Copy
} from 'lucide-react';
import { USUARIOS_SISTEMA } from './Login';

// ─── USUARIOS CON CREDENCIALES VISIBLES ──────────────────────────────────────
const usuariosData = [
  {
    id: 1,
    nombre: 'Administrador General',
    usuario: 'admin',
    contrasena: 'Fabri2026',
    email: 'admin@fabrimuebles.mx',
    rol: 'Administrador',
    genero: '👨',
    estado: true,
    ultimoAcceso: '2026-06-09 19:45',
    permisos: ['Dashboard','Clientes','Inventario','Ventas','Créditos','Reportes','Entregas','Recordatorios','Trabajadores','Usuarios'],
    avatar: 'AG',
    color: 'from-blue-500 to-blue-700',
  },
  {
    id: 2,
    nombre: 'Ana Reyes Soto',
    usuario: 'areyes',
    contrasena: 'Ventas123',
    email: 'areyes@fabrimuebles.mx',
    rol: 'Vendedora',
    genero: '👩',
    estado: true,
    ultimoAcceso: '2026-06-09 18:30',
    permisos: ['Clientes','Ventas','Inventario'],
    avatar: 'AR',
    color: 'from-emerald-500 to-emerald-700',
  },
  {
    id: 3,
    nombre: 'Laura Vega Morales',
    usuario: 'lvega',
    contrasena: 'Conta456',
    email: 'lvega@fabrimuebles.mx',
    rol: 'Contadora',
    genero: '👩',
    estado: true,
    ultimoAcceso: '2026-06-09 17:00',
    permisos: ['Dashboard','Créditos','Reportes','Clientes'],
    avatar: 'LV',
    color: 'from-violet-500 to-violet-700',
  },
  {
    id: 4,
    nombre: 'Miguel Ángel Torres',
    usuario: 'matorres',
    contrasena: 'Ruta789',
    email: 'matorres@fabrimuebles.mx',
    rol: 'Repartidor',
    genero: '👨',
    estado: true,
    ultimoAcceso: '2026-06-09 15:20',
    permisos: ['Entregas'],
    avatar: 'MT',
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 5,
    nombre: 'Diana Cruz Espinoza',
    usuario: 'dcruz',
    contrasena: 'Ventas456',
    email: 'dcruz@fabrimuebles.mx',
    rol: 'Vendedora',
    genero: '👩',
    estado: true,
    ultimoAcceso: '2026-06-09 14:10',
    permisos: ['Clientes','Ventas','Inventario'],
    avatar: 'DC',
    color: 'from-pink-500 to-pink-700',
  },
  {
    id: 6,
    nombre: 'Sandra Flores Leal',
    usuario: 'sflores',
    contrasena: 'Recep321',
    email: 'sflores@fabrimuebles.mx',
    rol: 'Recepcionista',
    genero: '👩',
    estado: true,
    ultimoAcceso: '2026-06-09 12:00',
    permisos: ['Clientes','Entregas','Recordatorios'],
    avatar: 'SF',
    color: 'from-cyan-500 to-cyan-700',
  },
];

const rolesDisponibles = ['Administrador','Vendedor','Vendedora','Contadora','Recepcionista','Repartidor','Producción','Almacén'];
const todosPermisos = ['Dashboard','Clientes','Inventario','Ventas','Créditos','Reportes','Entregas','Recordatorios','Trabajadores','Usuarios'];

const rolColor = {
  Administrador: 'bg-blue-100 text-blue-700',
  Vendedor: 'bg-emerald-100 text-emerald-700',
  Vendedora: 'bg-emerald-100 text-emerald-700',
  Contadora: 'bg-violet-100 text-violet-700',
  Recepcionista: 'bg-amber-100 text-amber-700',
  Repartidor: 'bg-cyan-100 text-cyan-700',
  Producción: 'bg-slate-100 text-slate-700',
  Almacén: 'bg-orange-100 text-orange-700',
};

const initialForm = {
  nombre: '', usuario: '', contrasena: '', email: '', rol: 'Vendedor',
  genero: '👨', estado: true, permisos: [], avatar: '', color: 'from-blue-500 to-blue-700',
};

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(usuariosData);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [viewUsuario, setViewUsuario] = useState(null);
  const [showPass, setShowPass] = useState(false);
  const [passVisibleId, setPassVisibleId] = useState(null);
  const [copiadoId, setCopiadoId] = useState(null);

  const filtered = usuarios.filter(u =>
    u.nombre.toLowerCase().includes(search.toLowerCase()) ||
    u.usuario.toLowerCase().includes(search.toLowerCase()) ||
    u.rol.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setForm(initialForm); setEditingId(null); setShowModal(true); };
  const openEdit = (u) => { setForm({ ...u, contrasena: '' }); setEditingId(u.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingId(null); setForm(initialForm); };

  const togglePermiso = (p) => {
    setForm(prev => ({
      ...prev,
      permisos: prev.permisos.includes(p) ? prev.permisos.filter(x => x !== p) : [...prev.permisos, p],
    }));
  };

  const toggleEstado = (id) => {
    if (id === 1) return;
    setUsuarios(prev => prev.map(u => u.id === id ? { ...u, estado: !u.estado } : u));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const originalUser = usuarios.find(u => u.id === editingId);
    const contrasenaFinal = editingId && !form.contrasena ? originalUser.contrasena : form.contrasena;
    const nuevo = {
      ...form,
      contrasena: contrasenaFinal,
      avatar: form.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(),
      ultimoAcceso: editingId ? form.ultimoAcceso : 'Nunca',
    };
    if (editingId) {
      setUsuarios(prev => prev.map(u => u.id === editingId ? { ...nuevo, id: editingId } : u));
    } else {
      setUsuarios(prev => [...prev, { ...nuevo, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (id === 1) { alert('No puedes eliminar al administrador principal.'); return; }
    if (window.confirm('¿Eliminar este usuario?')) setUsuarios(prev => prev.filter(u => u.id !== id));
  };

  const copiar = (texto, id) => {
    navigator.clipboard.writeText(texto).catch(() => {});
    setCopiadoId(id);
    setTimeout(() => setCopiadoId(null), 1500);
  };

  const activos = usuarios.filter(u => u.estado).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Gestión de Usuarios</h1>
          <p className="section-subtitle">{usuarios.length} usuarios — {activos} activos</p>
        </div>
        <button onClick={openNew} className="btn-primary">
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-blue-600">{activos}</p>
          <p className="text-xs text-slate-500 mt-1">Activos</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-slate-400">{usuarios.filter(u => !u.estado).length}</p>
          <p className="text-xs text-slate-500 mt-1">Desactivados</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-violet-600">{usuarios.filter(u => u.rol === 'Administrador').length}</p>
          <p className="text-xs text-slate-500 mt-1">Administradores</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-extrabold text-emerald-600">
            {usuarios.filter(u => u.rol === 'Vendedor' || u.rol === 'Vendedora').length}
          </p>
          <p className="text-xs text-slate-500 mt-1">Vendedores</p>
        </div>
      </div>

      {/* Tabla */}
      <div className="card">
        <div className="relative mb-4">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Buscar por nombre, usuario o rol..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-3 rounded-l-lg">Usuario</th>
                <th className="text-left px-3 py-3 hidden sm:table-cell">Login</th>
                <th className="text-left px-3 py-3">Rol</th>
                <th className="text-left px-3 py-3 hidden lg:table-cell">Último acceso</th>
                <th className="text-center px-3 py-3">Activo</th>
                <th className="text-center px-3 py-3 rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="table-row">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${u.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${!u.estado ? 'opacity-40 grayscale' : ''}`}>
                        {u.avatar}
                      </div>
                      <div>
                        <p className={`font-semibold leading-tight ${u.estado ? 'text-slate-800' : 'text-slate-400'}`}>
                          {u.genero} {u.nombre}
                        </p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <code className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-mono">{u.usuario}</code>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${rolColor[u.rol] || 'bg-slate-100 text-slate-600'}`}>{u.rol}</span>
                  </td>
                  <td className="px-3 py-3 text-slate-400 text-xs hidden lg:table-cell">{u.ultimoAcceso}</td>
                  <td className="px-3 py-3 text-center">
                    <button onClick={() => toggleEstado(u.id)} title={u.id === 1 ? 'Admin protegido' : ''}>
                      {u.estado
                        ? <ToggleRight size={26} className="text-emerald-500 hover:text-emerald-600 transition-colors" />
                        : <ToggleLeft size={26} className="text-slate-300 hover:text-slate-400 transition-colors" />}
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewUsuario(u)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Ver permisos">
                        <Eye size={15} />
                      </button>
                      <button onClick={() => openEdit(u)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg" title="Editar">
                        <Edit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(u.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Eliminar">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className="modal-overlay animate-fade-in" onClick={closeModal}>
          <div className="modal-content animate-slide-up max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <div>
                <h2 className="text-white font-bold text-lg">{editingId ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
                <p className="text-white/60 text-xs mt-0.5">Control de acceso al sistema</p>
              </div>
              <button onClick={closeModal} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 flex gap-3">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo *</label>
                    <input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" placeholder="Nombre del usuario" />
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-semibold text-slate-600 mb-1">Género</label>
                    <select value={form.genero} onChange={e => setForm({...form, genero: e.target.value})} className="input-field">
                      <option value="👨">👨 Hombre</option>
                      <option value="👩">👩 Mujer</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Usuario (login) *</label>
                  <input required value={form.usuario} onChange={e => setForm({...form, usuario: e.target.value.toLowerCase().replace(/\s/g,'')})} className="input-field font-mono" placeholder="nombre.apellido" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Correo electrónico *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="correo@fabrimuebles.mx" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Contraseña {editingId ? '' : '*'}</label>
                  <div className="relative">
                    <input type={showPass ? 'text' : 'password'} value={form.contrasena} onChange={e => setForm({...form, contrasena: e.target.value})} required={!editingId} className="input-field pr-10 font-mono" placeholder={editingId ? "Dejar en blanco para no cambiar" : "Mínimo 6 caracteres"} />
                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Rol *</label>
                  <select required value={form.rol} onChange={e => setForm({...form, rol: e.target.value})} className="input-field">
                    {rolesDisponibles.map(r => <option key={r}>{r}</option>)}
                  </select>
                </div>
              </div>

              {/* Permisos */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-2">
                  <Shield size={11} className="inline mr-1" />Permisos de acceso
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {todosPermisos.map(p => (
                    <label key={p} className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${form.permisos.includes(p) ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                      <input type="checkbox" checked={form.permisos.includes(p)} onChange={() => togglePermiso(p)} className="rounded text-blue-600 w-3.5 h-3.5 flex-shrink-0" />
                      <span className="text-xs font-semibold">{p}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={() => setForm({...form, permisos:[...todosPermisos]})} className="text-xs text-blue-600 font-semibold">Seleccionar todos</button>
                  <span className="text-slate-300">|</span>
                  <button type="button" onClick={() => setForm({...form, permisos:[]})} className="text-xs text-slate-500 font-semibold">Limpiar</button>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editingId ? 'Guardar Cambios' : 'Crear Usuario'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Permisos Modal */}
      {viewUsuario && (
        <div className="modal-overlay animate-fade-in" onClick={() => setViewUsuario(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className={`bg-gradient-to-r ${viewUsuario.color} px-6 py-5 flex items-center gap-4`}>
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white font-extrabold text-xl">
                {viewUsuario.avatar}
              </div>
              <div className="flex-1">
                <h2 className="text-white font-bold text-lg">{viewUsuario.genero} {viewUsuario.nombre}</h2>
                <p className="text-white/70 text-sm">@{viewUsuario.usuario} · {viewUsuario.rol}</p>
              </div>
              <button onClick={() => setViewUsuario(null)} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Email</p>
                  <p className="font-semibold text-slate-700 text-xs">{viewUsuario.email}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Último acceso</p>
                  <p className="font-semibold text-slate-700 text-xs">{viewUsuario.ultimoAcceso}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">Usuario</p>
                  <code className="font-bold text-blue-700">{viewUsuario.usuario}</code>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-1.5">
                  <Shield size={12} className="text-blue-600" /> Módulos con acceso ({viewUsuario.permisos.length}/{todosPermisos.length})
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {todosPermisos.map(p => (
                    <div key={p} className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold ${viewUsuario.permisos.includes(p) ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-slate-50 border-slate-100 text-slate-300'}`}>
                      {viewUsuario.permisos.includes(p) ? <CheckCircle size={13} /> : <X size={13} />}
                      {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setViewUsuario(null); openEdit(viewUsuario); }} className="btn-secondary flex-1 justify-center text-xs"><Edit2 size={13} /> Editar</button>
                <button onClick={() => setViewUsuario(null)} className="btn-primary flex-1 justify-center">Cerrar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
