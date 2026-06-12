import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { ventasMensuales } from '../data/demoData';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Package } from 'lucide-react';

const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

const ventasSemanales = [
  { dia: 'Lun', ventas: 32000 },
  { dia: 'Mar', ventas: 48000 },
  { dia: 'Mié', ventas: 28000 },
  { dia: 'Jue', ventas: 55000 },
  { dia: 'Vie', ventas: 71000 },
  { dia: 'Sáb', ventas: 89000 },
  { dia: 'Dom', ventas: 22000 },
];

const categoriaVentas = [
  { name: 'Recámaras', value: 35 },
  { name: 'Colchones', value: 22 },
  { name: 'Salas', value: 18 },
  { name: 'Comedores', value: 13 },
  { name: 'Clósets', value: 8 },
  { name: 'Otros', value: 4 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-3 text-sm">
        <p className="font-bold text-slate-700 mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="font-semibold">
            {formatMXN(p.value)}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reportes({ user, ventas, productos, clientes }) {
  // Calcular productos más vendidos dinámicamente de la lista de ventas
  const computeProductosMasVendidos = () => {
    const counts = {};
    ventas.forEach(v => {
      v.productos.forEach(pName => {
        if (!counts[pName]) {
          counts[pName] = { nombre: pName, ventas: 0, ingresos: 0 };
        }
        counts[pName].ventas += 1;
        const prod = productos.find(p => p.nombre === pName);
        const price = prod ? prod.precio : 12000;
        counts[pName].ingresos += price;
      });
    });
    
    const result = Object.values(counts)
      .sort((a, b) => b.ventas - a.ventas)
      .slice(0, 6);
      
    if (result.length === 0) {
      return productos.slice(0, 6).map(p => ({ nombre: p.nombre, ventas: 2, ingresos: p.precio * 2 }));
    }
    return result;
  };

  const dynamicProductosMasVendidos = computeProductosMasVendidos();

  // Calcular ventas por categoría dinámicamente
  const computeCategoriaVentas = () => {
    const catCounts = {};
    let totalItems = 0;
    ventas.forEach(v => {
      v.productos.forEach(pName => {
        const prod = productos.find(p => p.nombre === pName);
        const cat = prod ? prod.categoria : 'Otros';
        catCounts[cat] = (catCounts[cat] || 0) + 1;
        totalItems += 1;
      });
    });

    if (totalItems === 0) {
      return [
        { name: 'Recámaras', value: 35 },
        { name: 'Colchones', value: 22 },
        { name: 'Salas', value: 18 },
        { name: 'Comedores', value: 13 },
        { name: 'Clósets', value: 8 },
        { name: 'Otros', value: 4 },
      ];
    }
    
    return Object.entries(catCounts).map(([name, count]) => ({
      name,
      value: Math.round((count / totalItems) * 100)
    })).sort((a, b) => b.value - a.value);
  };

  const dynamicCategoriaVentas = computeCategoriaVentas();

  const topClientes = clientes
    ? [...clientes]
        .filter(c => c.saldo > 0)
        .sort((a, b) => b.saldo - a.saldo)
        .slice(0, 5)
    : [];

  const ventasTotales = ventas.reduce((s, v) => s + v.total, 0);
  const promedioMensual = Math.round(ventasTotales / (ventasMensuales.length || 1));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Módulo de Reportes</h1>
        <p className="section-subtitle">Análisis de rendimiento — Enero a Junio 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Ventas Totales</p>
              <p className="font-extrabold text-slate-800 text-lg">{formatMXN(ventasTotales)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={12} /> +6.3% vs 2025
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Promedio Mensual</p>
              <p className="font-extrabold text-slate-800 text-lg">{formatMXN(promedioMensual)}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={12} /> Meta: $220,000
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center">
              <ShoppingCart size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Ventas realizadas</p>
              <p className="font-extrabold text-slate-800 text-lg">{ventas.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={12} /> +12 vs mes anterior
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Users size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Clientes activos</p>
              <p className="font-extrabold text-slate-800 text-lg">{clientes.filter(c => c.estado === 'Activo').length}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp size={12} /> +3 nuevos este mes
          </div>
        </div>
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly */}
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-1">Ventas Mensuales</h2>
          <p className="text-xs text-slate-400 mb-4">Enero – Junio 2026</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ventasMensuales}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2.5} fill="url(#g1)" name="Ventas" dot={{ r: 4, fill: '#3b82f6' }} />
              <Area type="monotone" dataKey="meta" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="4 4" fill="none" name="Meta" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly */}
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-1">Ventas Semanales</h2>
          <p className="text-xs text-slate-400 mb-4">Semana del 3-9 de junio, 2026</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ventasSemanales} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="dia" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ventas" name="Ventas" radius={[6, 6, 0, 0]}>
                {ventasSemanales.map((_, i) => (
                  <Cell key={i} fill={i === 5 ? '#3b82f6' : '#bfdbfe'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie */}
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-1">Ventas por Categoría</h2>
          <p className="text-xs text-slate-400 mb-4">Distribución porcentual</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={dynamicCategoriaVentas} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" paddingAngle={3}>
                {dynamicCategoriaVentas.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Participación']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-1 mt-2">
            {dynamicCategoriaVentas.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                <span className="text-slate-600 truncate">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Productos más vendidos */}
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            {dynamicProductosMasVendidos.map((p, i) => (
              <div key={p.nombre}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">{i + 1}</span>
                    <span className="font-semibold text-slate-700 truncate max-w-28">{p.nombre}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-600">{p.ventas} uds</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400" style={{ width: `${(p.ventas / (dynamicProductosMasVendidos[0]?.ventas || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top clientes */}
        <div className="card">
          <h2 className="font-bold text-slate-800 mb-4">Clientes con Mayor Saldo</h2>
          <div className="space-y-3">
            {topClientes.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                  {c.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{c.nombre}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full mt-1">
                    <div className="h-full rounded-full bg-gradient-to-r from-red-400 to-red-300" style={{ width: `${(c.saldo / topClientes[0].saldo) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-red-500 flex-shrink-0">{formatMXN(c.saldo)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
