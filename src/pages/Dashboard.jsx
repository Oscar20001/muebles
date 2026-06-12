import { TrendingUp, TrendingDown, DollarSign, Users, Package, Truck, AlertCircle, Clock } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';
import { ventasMensuales, entregas } from '../data/demoData';

const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;

const StatCard = ({ title, value, icon: Icon, color, sub, trend }) => (
  <div className="card hover:shadow-card-hover transition-all duration-200 animate-slide-up">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-extrabold text-slate-800 mt-1">{value}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
    </div>
    {trend && (
      <div className={`flex items-center gap-1 mt-3 text-xs font-semibold ${trend > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
        {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {trend > 0 ? '+' : ''}{trend}% vs mes anterior
      </div>
    )}
  </div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {p.name}: {formatMXN(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ onNavigate, user, productos, ventas, clientes, creditos, recordatorios }) {
  const latestDate = ventas.length > 0 ? ventas[0].fecha : '2026-06-10';
  const ventasHoy = ventas.filter(v => v.fecha === latestDate).reduce((s, v) => s + v.total, 0);
  const ventasMes = ventas.reduce((s, v) => s + v.total, 0);
  const clientesAdeudo = clientes.filter(c => c.saldo > 0).length;
  const totalProductos = productos.reduce((s, p) => s + p.stock, 0);
  const entregasPendientes = entregas.filter(e => e.estado !== 'Entregado').length;

  const alertasUrgentes = recordatorios.filter(r => r.urgencia === 'alta');

  const ultimosMovimientos = ventas.slice(0, 7);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Dashboard General</h1>
          <p className="section-subtitle">Resumen operativo — Lunes 9 de junio, 2026</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Sistema en línea
        </div>
      </div>

      {/* Alert strip */}
      {alertasUrgentes.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-fade-in">
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-red-700 font-semibold text-sm">
              {alertasUrgentes.length} alertas urgentes requieren atención
            </p>
            <p className="text-red-500 text-xs mt-0.5 truncate">{alertasUrgentes[0].mensaje}</p>
          </div>
          <button onClick={() => onNavigate('recordatorios')} className="btn-danger text-xs px-3 py-1.5 flex-shrink-0">
            Ver alertas
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
        <StatCard title="Ventas del Día" value={formatMXN(ventasHoy)} icon={DollarSign} color="bg-gradient-to-br from-blue-500 to-blue-700" sub="3 transacciones hoy" trend={12.5} />
        <StatCard title="Ventas del Mes" value={formatMXN(ventasMes)} icon={TrendingUp} color="bg-gradient-to-br from-emerald-500 to-emerald-700" sub="Meta: $240,000" trend={6.3} />
        <StatCard title="Clientes con Adeudo" value={clientesAdeudo} icon={Users} color="bg-gradient-to-br from-amber-500 to-amber-600" sub="Saldo total: $104,700" />
        <StatCard title="Productos en Stock" value={totalProductos} icon={Package} color="bg-gradient-to-br from-violet-500 to-violet-700" sub="33 referencias activas" />
        <StatCard title="Entregas Pendientes" value={entregasPendientes} icon={Truck} color="bg-gradient-to-br from-rose-500 to-rose-700" sub="Próxima: 10 jun" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main chart */}
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-slate-800">Ventas Mensuales</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ene – Jun 2026</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block"></span>Real</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-slate-300 inline-block"></span>Meta</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ventasMensuales}>
              <defs>
                <linearGradient id="gradVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ventas" name="Ventas" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradVentas)" dot={{ r: 4, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="meta" name="Meta" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Notifications */}
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-4">Notificaciones</h2>
          <div className="space-y-3">
            {recordatorios.slice(0, 5).map(r => (
              <div key={r.id} className={`flex items-start gap-3 p-3 rounded-xl border ${
                r.urgencia === 'alta' ? 'bg-red-50 border-red-100' :
                r.urgencia === 'media' ? 'bg-amber-50 border-amber-100' :
                'bg-blue-50 border-blue-100'
              }`}>
                <AlertCircle size={15} className={`flex-shrink-0 mt-0.5 ${
                  r.urgencia === 'alta' ? 'text-red-500' :
                  r.urgencia === 'media' ? 'text-amber-500' : 'text-blue-500'
                }`} />
                <p className="text-xs text-slate-600 leading-relaxed">{r.mensaje}</p>
              </div>
            ))}
          </div>
          <button onClick={() => onNavigate('recordatorios')} className="btn-secondary w-full mt-4 justify-center text-xs">
            Ver todas las alertas
          </button>
        </div>
      </div>

      {/* Recent movements */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-slate-800">Últimos Movimientos</h2>
            <p className="text-xs text-slate-400 mt-0.5">Ventas más recientes registradas</p>
          </div>
          <button onClick={() => onNavigate('ventas')} className="btn-secondary text-xs">Ver todas</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="table-header">
                <th className="text-left px-3 py-3 rounded-l-lg">Fecha</th>
                <th className="text-left px-3 py-3">Cliente</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Productos</th>
                <th className="text-left px-3 py-3 hidden sm:table-cell">Forma Pago</th>
                <th className="text-right px-3 py-3 rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody>
              {ultimosMovimientos.map(v => (
                <tr key={v.id} className="table-row">
                  <td className="px-3 py-3 text-slate-500 text-xs">{v.fecha}</td>
                  <td className="px-3 py-3 font-medium text-slate-800">{v.cliente}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs hidden md:table-cell">
                    {v.productos.join(', ').substring(0, 40)}...
                  </td>
                  <td className="px-3 py-3 hidden sm:table-cell">
                    <span className={v.formaPago === 'Contado' ? 'badge-green' : 'badge-blue'}>
                      {v.formaPago}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-slate-800">{formatMXN(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
