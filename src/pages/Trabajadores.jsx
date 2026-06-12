import { useState } from 'react';
import {
  UserCheck, Phone, Mail, MapPin, Briefcase, Calendar,
  Plus, Edit2, Trash2, Eye, X, Search, Clock, DollarSign, Star
} from 'lucide-react';
import { esAdmin, BannerSoloLectura } from '../utils/permisos.jsx';

const trabajadoresData = [
  { id: 1, nombre: 'Carlos Mendoza López', puesto: 'Carpintero Senior', departamento: 'Producción', telefono: '667-111-2233', email: 'cmendoza@fabrimuebles.mx', direccion: 'Calle Pino #12, Col. Las Huertas, Culiacán', salario: 14500, turno: 'Mañana', fechaIngreso: '2019-03-15', estado: 'Activo', avatar: 'CM', calificacion: 5, habilidades: ['Carpintería', 'Tapizado', 'Lacado'] },
  { id: 2, nombre: 'Ana Reyes Soto', puesto: 'Vendedora', departamento: 'Ventas', telefono: '667-222-3344', email: 'areyes@fabrimuebles.mx', direccion: 'Av. Insurgentes #456, Col. Centro, Culiacán', salario: 9800, turno: 'Mañana', fechaIngreso: '2021-07-01', estado: 'Activo', avatar: 'AR', calificacion: 4, habilidades: ['Atención al cliente', 'CRM', 'Ventas'] },
  { id: 3, nombre: 'Roberto Gutiérrez Paz', puesto: 'Tapicero', departamento: 'Producción', telefono: '667-333-4455', email: 'rgutierrez@fabrimuebles.mx', direccion: 'Blvd. Zapata #789, Col. Primavera, Culiacán', salario: 12000, turno: 'Mañana', fechaIngreso: '2020-01-10', estado: 'Activo', avatar: 'RG', calificacion: 5, habilidades: ['Tapizado', 'Costura', 'Diseño'] },
  { id: 4, nombre: 'Laura Vega Morales', puesto: 'Contadora', departamento: 'Administración', telefono: '667-444-5566', email: 'lvega@fabrimuebles.mx', direccion: 'Priv. Laurel #34, Col. Jardines, Culiacán', salario: 16000, turno: 'Mañana', fechaIngreso: '2018-05-20', estado: 'Activo', avatar: 'LV', calificacion: 5, habilidades: ['Contabilidad', 'Nómina', 'Impuestos'] },
  { id: 5, nombre: 'Miguel Ángel Torres', puesto: 'Repartidor / Chofer', departamento: 'Logística', telefono: '667-555-6677', email: 'matorres@fabrimuebles.mx', direccion: 'Calle Encino #56, Col. Encinos, Culiacán', salario: 8500, turno: 'Mañana', fechaIngreso: '2022-02-14', estado: 'Activo', avatar: 'MT', calificacion: 4, habilidades: ['Manejo', 'Logística', 'Instalación'] },
  { id: 6, nombre: 'Patricia Ríos Castillo', puesto: 'Diseñadora', departamento: 'Diseño', telefono: '667-666-7788', email: 'prios@fabrimuebles.mx', direccion: 'Av. Universitaria #678, Col. Universitaria, Culiacán', salario: 13500, turno: 'Mañana', fechaIngreso: '2021-09-01', estado: 'Activo', avatar: 'PR', calificacion: 5, habilidades: ['AutoCAD', 'SketchUp', 'Diseño de interiores'] },
  { id: 7, nombre: 'Jorge Ramírez Ibarra', puesto: 'Carpintero Junior', departamento: 'Producción', telefono: '667-777-8899', email: 'jramirez@fabrimuebles.mx', direccion: 'Calle Olivo #90, Col. Mezquites, Culiacán', salario: 8000, turno: 'Tarde', fechaIngreso: '2023-01-16', estado: 'Activo', avatar: 'JR', calificacion: 3, habilidades: ['Carpintería básica', 'Lijado', 'Pintura'] },
  { id: 8, nombre: 'Sandra Flores Leal', puesto: 'Recepcionista', departamento: 'Administración', telefono: '667-888-9900', email: 'sflores@fabrimuebles.mx', direccion: 'Av. Álvaro Obregón #123, Col. Obregón, Culiacán', salario: 7500, turno: 'Mañana', fechaIngreso: '2022-11-07', estado: 'Activo', avatar: 'SF', calificacion: 4, habilidades: ['Atención al cliente', 'Caja', 'Agenda'] },
  { id: 9, nombre: 'Héctor Salazar Noriega', puesto: 'Instalador', departamento: 'Logística', telefono: '667-999-0011', email: 'hsalazar@fabrimuebles.mx', direccion: 'Priv. Mezquite #45, Col. Las Quintas, Culiacán', salario: 9200, turno: 'Mañana', fechaIngreso: '2020-08-03', estado: 'Permiso', avatar: 'HS', calificacion: 4, habilidades: ['Instalación', 'Herrería', 'Albañilería básica'] },
  { id: 10, nombre: 'Diana Cruz Espinoza', puesto: 'Vendedora', departamento: 'Ventas', telefono: '667-101-2233', email: 'dcruz@fabrimuebles.mx', direccion: 'Calle Rosa #67, Col. Rosales, Culiacán', salario: 9800, turno: 'Tarde', fechaIngreso: '2023-04-01', estado: 'Activo', avatar: 'DC', calificacion: 4, habilidades: ['Ventas', 'Redes sociales', 'Cobros'] },
  { id: 11, nombre: 'Ernesto Valdez Monge', puesto: 'Carpintero Senior', departamento: 'Producción', telefono: '667-112-3344', email: 'evaldez@fabrimuebles.mx', direccion: 'Av. Rafael Buelna #890, Col. Vallarta, Culiacán', salario: 14000, turno: 'Mañana', fechaIngreso: '2017-10-22', estado: 'Activo', avatar: 'EV', calificacion: 5, habilidades: ['Carpintería', 'CNC', 'Torno'] },
  { id: 12, nombre: 'Mónica Herrera Dávalos', puesto: 'Almacenista', departamento: 'Almacén', telefono: '667-223-4455', email: 'mherrera@fabrimuebles.mx', direccion: 'Calle Álamo #234, Col. Las Flores, Culiacán', salario: 8200, turno: 'Mañana', fechaIngreso: '2021-03-15', estado: 'Baja', avatar: 'MH', calificacion: 3, habilidades: ['Inventario', 'Recepción', 'Control de stock'] },
];

const departamentos = ['Todos', 'Producción', 'Ventas', 'Administración', 'Logística', 'Diseño', 'Almacén'];
const estadoBadge = { Activo: 'badge-green', Permiso: 'badge-yellow', Baja: 'badge-red' };
const deptColor = { Producción: 'bg-blue-100 text-blue-700', Ventas: 'bg-emerald-100 text-emerald-700', Administración: 'bg-violet-100 text-violet-700', Logística: 'bg-amber-100 text-amber-700', Diseño: 'bg-pink-100 text-pink-700', Almacén: 'bg-slate-100 text-slate-700' };
const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;
const Stars = ({ n }) => (
  <div className="flex gap-0.5">{[1,2,3,4,5].map(i => <Star key={i} size={11} className={i <= n ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />)}</div>
);
const initialForm = { nombre: '', puesto: '', departamento: 'Producción', telefono: '', email: '', direccion: '', salario: 0, turno: 'Mañana', fechaIngreso: '', estado: 'Activo', habilidades: '' };

export default function Trabajadores({ user }) {
  const admin = esAdmin(user);
  const [trabajadores, setTrabajadores] = useState(trabajadoresData);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [viewTrabajador, setViewTrabajador] = useState(null);

  const filtered = trabajadores.filter(t => {
    const matchSearch = t.nombre.toLowerCase().includes(search.toLowerCase()) || t.puesto.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === 'Todos' || t.departamento === deptFilter;
    return matchSearch && matchDept;
  });

  const openNew = () => { if (!admin) return; setForm(initialForm); setEditingId(null); setShowModal(true); };
  const openEdit = (t) => { if (!admin) return; setForm({ ...t, habilidades: t.habilidades?.join(', ') || '' }); setEditingId(t.id); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = { ...form, salario: parseFloat(form.salario), habilidades: form.habilidades.split(',').map(h => h.trim()).filter(Boolean), avatar: form.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase(), calificacion: 3 };
    if (editingId) {
      setTrabajadores(prev => prev.map(t => t.id === editingId ? { ...nuevo, id: editingId } : t));
    } else {
      setTrabajadores(prev => [...prev, { ...nuevo, id: Date.now() }]);
    }
    closeModal();
  };

  const handleDelete = (id) => {
    if (!admin) return;
    if (window.confirm('¿Eliminar este trabajador?')) setTrabajadores(prev => prev.filter(t => t.id !== id));
  };

  const totalNomina = trabajadores.filter(t => t.estado === 'Activo').reduce((s, t) => s + t.salario, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Módulo de Trabajadores</h1>
          <p className="section-subtitle">{trabajadores.length} empleados registrados</p>
        </div>
        {admin && (
          <button onClick={openNew} className="btn-primary">
            <Plus size={16} /> Nuevo Trabajador
          </button>
        )}
      </div>

      {!admin && <BannerSoloLectura />}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card text-center"><p className="text-2xl font-extrabold text-emerald-600">{trabajadores.filter(t => t.estado === 'Activo').length}</p><p className="text-xs text-slate-500 mt-1">Activos</p></div>
        <div className="card text-center"><p className="text-2xl font-extrabold text-amber-500">{trabajadores.filter(t => t.estado === 'Permiso').length}</p><p className="text-xs text-slate-500 mt-1">Con permiso</p></div>
        <div className="card text-center"><p className="text-2xl font-extrabold text-red-500">{trabajadores.filter(t => t.estado === 'Baja').length}</p><p className="text-xs text-slate-500 mt-1">Bajas</p></div>
        {/* Salario solo lo ve el admin */}
        <div className="card text-center">
          {admin
            ? <><p className="text-2xl font-extrabold text-blue-600">{formatMXN(totalNomina)}</p><p className="text-xs text-slate-500 mt-1">Nómina mensual</p></>
            : <><p className="text-2xl font-extrabold text-slate-300">••••••</p><p className="text-xs text-slate-400 mt-1">Nómina (restringido)</p></>
          }
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {departamentos.map(d => (
          <button key={d} onClick={() => setDeptFilter(d)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${deptFilter === d ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar por nombre o puesto..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-3 rounded-l-lg">Empleado</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Puesto</th>
                <th className="text-left px-3 py-3 hidden sm:table-cell">Departamento</th>
                <th className="text-left px-3 py-3 hidden lg:table-cell">Turno</th>
                {/* Salario solo visible al admin */}
                {admin && <th className="text-right px-3 py-3 hidden sm:table-cell">Salario</th>}
                <th className="text-center px-3 py-3">Estado</th>
                <th className="text-center px-3 py-3 rounded-r-lg">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id} className="table-row">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{t.avatar}</div>
                      <div><p className="font-semibold text-slate-800 leading-tight">{t.nombre}</p><Stars n={t.calificacion} /></div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600 hidden md:table-cell">{t.puesto}</td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${deptColor[t.departamento] || 'bg-slate-100 text-slate-600'}`}>{t.departamento}</span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-slate-500 text-xs"><Clock size={12} />{t.turno}</span>
                  </td>
                  {admin && <td className="px-3 py-3 text-right font-bold text-slate-700 hidden sm:table-cell">{formatMXN(t.salario)}</td>}
                  <td className="px-3 py-3 text-center"><span className={estadoBadge[t.estado] || 'badge-gray'}>{t.estado}</span></td>
                  <td className="px-3 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewTrabajador(t)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={15} /></button>
                      {admin && (
                        <>
                          <button onClick={() => openEdit(t)} className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"><Edit2 size={15} /></button>
                          <button onClick={() => handleDelete(t.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-slate-400"><UserCheck size={40} className="mx-auto mb-2 opacity-30" /><p>No se encontraron trabajadores</p></div>
          )}
        </div>
      </div>

      {/* Form Modal — solo admin */}
      {showModal && admin && (
        <div className="modal-overlay animate-fade-in" onClick={closeModal}>
          <div className="modal-content animate-slide-up max-w-xl" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-5 flex items-center justify-between">
              <div><h2 className="text-white font-bold text-lg">{editingId ? 'Editar Trabajador' : 'Nuevo Trabajador'}</h2><p className="text-white/60 text-xs mt-0.5">Fábri Muebles — Recursos Humanos</p></div>
              <button onClick={closeModal} className="text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo *</label><input required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="input-field" placeholder="Nombre completo del empleado" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Puesto *</label><input required value={form.puesto} onChange={e => setForm({...form, puesto: e.target.value})} className="input-field" placeholder="Carpintero, Vendedor, etc." /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Departamento</label>
                  <select value={form.departamento} onChange={e => setForm({...form, departamento: e.target.value})} className="input-field">
                    {departamentos.filter(d => d !== 'Todos').map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1"><Phone size={11} className="inline mr-1" />Teléfono *</label><input required value={form.telefono} onChange={e => setForm({...form, telefono: e.target.value})} className="input-field" placeholder="667-000-0000" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1"><Mail size={11} className="inline mr-1" />Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="input-field" placeholder="email@fabrimuebles.mx" /></div>
                <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1"><MapPin size={11} className="inline mr-1" />Dirección</label><input value={form.direccion} onChange={e => setForm({...form, direccion: e.target.value})} className="input-field" placeholder="Calle, número, colonia, ciudad" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1"><DollarSign size={11} className="inline mr-1" />Salario Mensual ($)</label><input type="number" min="0" value={form.salario} onChange={e => setForm({...form, salario: e.target.value})} className="input-field" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1"><Clock size={11} className="inline mr-1" />Turno</label>
                  <select value={form.turno} onChange={e => setForm({...form, turno: e.target.value})} className="input-field"><option>Mañana</option><option>Tarde</option><option>Nocturno</option></select>
                </div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1"><Calendar size={11} className="inline mr-1" />Fecha de Ingreso</label><input type="date" value={form.fechaIngreso} onChange={e => setForm({...form, fechaIngreso: e.target.value})} className="input-field" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Estado</label>
                  <select value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} className="input-field"><option>Activo</option><option>Permiso</option><option>Baja</option></select>
                </div>
                <div className="sm:col-span-2"><label className="block text-xs font-semibold text-slate-600 mb-1"><Briefcase size={11} className="inline mr-1" />Habilidades (separadas por coma)</label><input value={form.habilidades} onChange={e => setForm({...form, habilidades: e.target.value})} className="input-field" placeholder="Carpintería, Tapizado, Diseño..." /></div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-secondary flex-1 justify-center">Cancelar</button>
                <button type="submit" className="btn-primary flex-1 justify-center">{editingId ? 'Guardar Cambios' : 'Registrar Empleado'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal — todos pueden ver */}
      {viewTrabajador && (
        <div className="modal-overlay animate-fade-in" onClick={() => setViewTrabajador(null)}>
          <div className="modal-content animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-brand-900 to-blue-800 px-6 py-6 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-extrabold text-2xl flex-shrink-0">{viewTrabajador.avatar}</div>
              <div>
                <h2 className="text-white font-bold text-xl leading-tight">{viewTrabajador.nombre}</h2>
                <p className="text-white/70 text-sm mt-0.5">{viewTrabajador.puesto} — {viewTrabajador.departamento}</p>
                <div className="flex items-center gap-2 mt-1"><Stars n={viewTrabajador.calificacion} /><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${viewTrabajador.estado === 'Activo' ? 'bg-emerald-400/30 text-emerald-200' : viewTrabajador.estado === 'Permiso' ? 'bg-amber-400/30 text-amber-200' : 'bg-red-400/30 text-red-200'}`}>{viewTrabajador.estado}</span></div>
              </div>
              <button onClick={() => setViewTrabajador(null)} className="ml-auto text-white/60 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Teléfono</p><p className="font-semibold text-slate-700">{viewTrabajador.telefono}</p></div>
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Turno</p><p className="font-semibold text-slate-700">{viewTrabajador.turno}</p></div>
              <div className="bg-slate-50 rounded-xl p-3 col-span-2"><p className="text-xs text-slate-400 mb-0.5">Email</p><p className="font-semibold text-slate-700">{viewTrabajador.email}</p></div>
              <div className="bg-slate-50 rounded-xl p-3 col-span-2"><p className="text-xs text-slate-400 mb-0.5">Dirección</p><p className="font-semibold text-slate-700">{viewTrabajador.direccion}</p></div>
              {/* Salario solo visible para admin */}
              {admin
                ? <div className="bg-blue-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Salario Mensual</p><p className="font-extrabold text-blue-600 text-lg">{formatMXN(viewTrabajador.salario)}</p></div>
                : <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Salario Mensual</p><p className="font-bold text-slate-300 text-lg">••••••</p></div>
              }
              <div className="bg-slate-50 rounded-xl p-3"><p className="text-xs text-slate-400 mb-0.5">Fecha de Ingreso</p><p className="font-semibold text-slate-700">{viewTrabajador.fechaIngreso}</p></div>
              {viewTrabajador.habilidades?.length > 0 && (
                <div className="bg-slate-50 rounded-xl p-3 col-span-2"><p className="text-xs text-slate-400 mb-2">Habilidades</p>
                  <div className="flex flex-wrap gap-1.5">{viewTrabajador.habilidades.map(h => <span key={h} className="bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full">{h}</span>)}</div>
                </div>
              )}
            </div>
            <div className="px-6 pb-6 flex gap-3">
              {admin && <button onClick={() => { setViewTrabajador(null); openEdit(viewTrabajador); }} className="btn-secondary flex-1 justify-center"><Edit2 size={14}/> Editar</button>}
              <button onClick={() => setViewTrabajador(null)} className="btn-primary flex-1 justify-center">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
