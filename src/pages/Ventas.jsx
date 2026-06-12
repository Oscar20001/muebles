import { useState } from 'react';
import { Search, Plus, Trash2, ShoppingCart, User, X, CheckCircle, Printer, FileSpreadsheet } from 'lucide-react';

const formatMXN = (n) => `$${n.toLocaleString('es-MX')}`;

export default function Ventas({ user, productos, setProductos, clientes, ventas, setVentas, creditos, setCreditos, recordatorios, setRecordatorios }) {
  const [searchCliente, setSearchCliente] = useState('');
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [searchProducto, setSearchProducto] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [formaPago, setFormaPago] = useState('Contado');
  const [enganche, setEnganche] = useState(0);
  const [ticketVisible, setTicketVisible] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [showClienteList, setShowClienteList] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const clientesFiltrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(searchCliente.toLowerCase()) ||
    c.telefono.includes(searchCliente)
  );

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchProducto.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchProducto.toLowerCase())
  ).slice(0, 8);

  const agregarAlCarrito = (prod) => {
    const existe = carrito.find(i => i.id === prod.id);
    if (existe) {
      setCarrito(carrito.map(i => i.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setCarrito([...carrito, { ...prod, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i)
    );
  };

  const eliminarItem = (id) => setCarrito(prev => prev.filter(i => i.id !== id));

  const subtotal = carrito.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const iva = 0;
  const total = subtotal + iva;
  const saldo = formaPago === 'Crédito' ? total - enganche : 0;

  const exportarVentasDiariasXLS = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const ventasHoy = ventas.filter(v => v.fecha === todayStr);

    if (ventasHoy.length === 0) {
      alert('No hay ventas registradas para el día de hoy aún.');
      return;
    }

    const headers = ['Folio/ID', 'Fecha', 'Cliente', 'Productos', 'Total (MXN)', 'Forma de Pago', 'Estado'];
    const rows = ventasHoy.map(v => [
      v.id,
      v.fecha,
      v.cliente,
      v.productos.join(', '),
      formatMXN(v.total),
      v.formaPago,
      v.estado || 'Completada'
    ]);

    const content = [headers, ...rows].map(row => row.join('\t')).join('\n');
    const blob = new Blob([content], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `ventas_diarias_${todayStr}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const finalizarVenta = () => {
    if (!clienteSeleccionado) { alert('Por favor selecciona un cliente'); return; }
    if (carrito.length === 0) { alert('Agrega al menos un producto'); return; }

    // Validar stock antes de vender
    for (const item of carrito) {
      const dbProd = productos.find(p => p.id === item.id);
      if (!dbProd || dbProd.stock < item.cantidad) {
        alert(`Stock insuficiente para "${item.nombre}". Stock actual: ${dbProd ? dbProd.stock : 0}`);
        return;
      }
    }
    
    const folio = `FM-${Date.now().toString().slice(-6)}`;
    const fecha = new Date().toISOString().split('T')[0];
    const hora = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });

    const ticket = {
      folio,
      fecha,
      hora,
      cliente: clienteSeleccionado,
      items: carrito,
      subtotal,
      total,
      formaPago,
      enganche: formaPago === 'Crédito' ? enganche : total,
      saldo,
    };

    setTicketData(ticket);

    // 1. Descontar stock
    setProductos(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = carrito.find(item => item.id === p.id);
        if (cartItem) {
          const nextStock = Math.max(0, p.stock - cartItem.cantidad);
          
          // Registrar alerta de stock bajo si aplica (solo para admin)
          if (nextStock < 3 && user?.rol === 'Administrador') {
            const id = Date.now() + p.id;
            setRecordatorios(prevAlerts => [
              {
                id,
                tipo: 'inventario_bajo',
                mensaje: `⚠️ Inventario crítico: "${p.nombre}" se está agotando. Quedan solo ${nextStock} unidades.`,
                urgencia: 'alta',
                cliente: null,
                telefono: null
              },
              ...prevAlerts
            ]);
          }
          return { ...p, stock: nextStock };
        }
        return p;
      });
    });

    // 2. Registrar venta en el maestro
    const nuevaVentaReg = {
      id: folio,
      fecha,
      cliente: clienteSeleccionado.nombre,
      productos: carrito.map(i => i.nombre),
      total,
      estado: 'Completada',
      formaPago,
    };
    setVentas(prev => [nuevaVentaReg, ...prev]);

    // 3. Registrar crédito si aplica
    if (formaPago === 'Crédito') {
      const nuevoCredito = {
        id: Date.now(),
        clienteId: clienteSeleccionado.id,
        cliente: clienteSeleccionado.nombre,
        producto: carrito.map(i => `${i.nombre} x${i.cantidad}`).join(', '),
        precio: total,
        enganche,
        saldo,
        abonos: 0,
        proximoPago: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estado: 'Al corriente',
        historial: [],
        telefono: clienteSeleccionado.telefono
      };
      setCreditos(prev => [nuevoCredito, ...prev]);
    }

    // Activar animación premium "PRODUCTO VENDIDO"
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setTicketVisible(true);
    }, 2000);
  };

  const nuevaVenta = () => {
    setCarrito([]);
    setClienteSeleccionado(null);
    setSearchCliente('');
    setSearchProducto('');
    setFormaPago('Contado');
    setEnganche(0);
    setTicketVisible(false);
    setTicketData(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Punto de Venta</h1>
          <p className="section-subtitle">Registra una nueva venta</p>
        </div>
        <div className="flex items-center gap-2">
          {user?.rol === 'Administrador' && (
            <button onClick={exportarVentasDiariasXLS} className="btn-secondary text-xs flex items-center gap-1.5 bg-white border border-slate-200 py-1.5 px-3 rounded-lg shadow-sm hover:border-emerald-300">
              <FileSpreadsheet size={15} className="text-emerald-600" /> Exportar Ventas Diarias (.xls)
            </button>
          )}
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg">
            <ShoppingCart size={14} /> Terminal Activa
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* LEFT: Cliente + Productos */}
        <div className="lg:col-span-3 space-y-4">
          {/* Cliente */}
          <div className="card">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <User size={15} className="text-blue-600" /> Cliente
            </h2>
            {clienteSeleccionado ? (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">
                    {clienteSeleccionado.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{clienteSeleccionado.nombre}</p>
                    <p className="text-xs text-slate-500">{clienteSeleccionado.telefono}</p>
                  </div>
                </div>
                <button onClick={() => setClienteSeleccionado(null)} className="text-slate-400 hover:text-red-500 p-1">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar cliente por nombre o teléfono..."
                  value={searchCliente}
                  onChange={e => { setSearchCliente(e.target.value); setShowClienteList(true); }}
                  onFocus={() => setShowClienteList(true)}
                  className="input-field pl-9"
                />
                {showClienteList && searchCliente && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-white border border-slate-200 rounded-xl shadow-xl mt-1 max-h-48 overflow-y-auto">
                    {clientesFiltrados.slice(0, 6).map(c => (
                      <button
                        key={c.id}
                        onClick={() => { setClienteSeleccionado(c); setSearchCliente(''); setShowClienteList(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-blue-50 flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                          {c.nombre.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{c.nombre}</p>
                          <p className="text-xs text-slate-400">{c.telefono}</p>
                        </div>
                      </button>
                    ))}
                    {clientesFiltrados.length === 0 && (
                      <div className="px-4 py-3 text-sm text-slate-400 text-center">No se encontraron clientes</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Productos */}
          <div className="card">
            <h2 className="font-bold text-slate-800 text-sm mb-3 flex items-center gap-2">
              <ShoppingCart size={15} className="text-blue-600" /> Agregar Productos
            </h2>
            <div className="relative mb-3">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar producto por nombre o código..."
                value={searchProducto}
                onChange={e => setSearchProducto(e.target.value)}
                className="input-field pl-9"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
              {productosFiltrados.map(p => (
                <button
                  key={p.id}
                  onClick={() => agregarAlCarrito(p)}
                  className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
                >
                  <span className="text-2xl">{p.imagen}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-xs leading-tight truncate">{p.nombre}</p>
                    <p className="text-blue-600 font-bold text-sm mt-0.5">{formatMXN(p.precio)}</p>
                    <p className="text-xs text-slate-400">Stock: {p.stock}</p>
                  </div>
                  <Plus size={16} className="text-slate-300 group-hover:text-blue-500 flex-shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Carrito */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h2 className="font-bold text-slate-800 text-sm mb-3">🛒 Carrito de Venta</h2>
            
            {carrito.length === 0 ? (
              <div className="text-center py-10 text-slate-300">
                <ShoppingCart size={40} className="mx-auto mb-2" />
                <p className="text-sm">Agrega productos al carrito</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {carrito.map(item => (
                  <div key={item.id} className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-lg">{item.imagen}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{item.nombre}</p>
                      <p className="text-xs text-blue-600 font-bold">{formatMXN(item.precio)}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => cambiarCantidad(item.id, -1)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-100 text-xs font-bold">-</button>
                      <span className="w-6 text-center text-xs font-bold">{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, 1)} className="w-6 h-6 flex items-center justify-center bg-white border border-slate-200 rounded text-slate-500 hover:bg-slate-100 text-xs font-bold">+</button>
                    </div>
                    <p className="text-xs font-bold text-slate-800 w-16 text-right">{formatMXN(item.precio * item.cantidad)}</p>
                    <button onClick={() => eliminarItem(item.id)} className="text-slate-300 hover:text-red-500 p-0.5"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            )}

            {/* Totals */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span><span className="font-semibold">{formatMXN(subtotal)}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-800 pt-1 border-t border-slate-100">
                <span>Total</span><span className="text-blue-600">{formatMXN(total)}</span>
              </div>
            </div>

            {/* Payment */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Forma de Pago</label>
                <select value={formaPago} onChange={e => setFormaPago(e.target.value)} className="input-field">
                  <option>Contado</option>
                  <option>Crédito</option>
                  <option>Transferencia</option>
                  <option>Tarjeta</option>
                </select>
              </div>
              {formaPago === 'Crédito' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Enganche ($)</label>
                  <input type="number" min="0" value={enganche} onChange={e => setEnganche(parseFloat(e.target.value))} className="input-field" />
                  <p className="text-xs text-slate-400 mt-1">Saldo a crédito: <span className="font-bold text-red-500">{formatMXN(Math.max(0, saldo))}</span></p>
                </div>
              )}
            </div>

            <button
              onClick={finalizarVenta}
              disabled={carrito.length === 0}
              className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ✓ Finalizar Venta — {formatMXN(total)}
            </button>
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {ticketVisible && ticketData && (
        <div className="modal-overlay animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-5 text-white text-center">
              <CheckCircle size={40} className="mx-auto mb-2" />
              <h2 className="text-xl font-extrabold">¡Venta Registrada!</h2>
              <p className="text-emerald-100 text-sm mt-0.5">Ticket #{ticketData.folio}</p>
            </div>
            {/* Ticket body */}
            <div className="p-6">
              <div className="text-center mb-4">
                <p className="text-lg font-extrabold text-slate-800">Fábri Muebles</p>
                <p className="text-xs text-slate-400">Sistema Administrativo</p>
                <p className="text-xs text-slate-400 mt-1">{ticketData.fecha} — {ticketData.hora}</p>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                <p className="text-xs text-slate-500 mb-0.5">Cliente</p>
                <p className="font-bold text-slate-800">{ticketData.cliente.nombre}</p>
                <p className="text-xs text-slate-400">{ticketData.cliente.telefono}</p>
              </div>

              <div className="space-y-1 mb-4">
                {ticketData.items.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-600 flex-1">{item.nombre} x{item.cantidad}</span>
                    <span className="font-semibold text-slate-800">{formatMXN(item.precio * item.cantidad)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-200 pt-3 space-y-1">
                <div className="flex justify-between text-sm font-bold text-slate-800">
                  <span>TOTAL</span><span className="text-blue-600">{formatMXN(ticketData.total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Forma de pago</span><span className="font-semibold">{ticketData.formaPago}</span>
                </div>
                {ticketData.formaPago === 'Crédito' && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Enganche</span><span className="font-semibold text-emerald-600">{formatMXN(ticketData.enganche)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Saldo a crédito</span><span className="font-bold text-red-500">{formatMXN(ticketData.saldo)}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="text-center mt-4 text-xs text-slate-400">
                <p>¡Gracias por su compra!</p>
                <p>Fábri Muebles · Calidad garantizada</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button className="btn-secondary flex-1 justify-center text-xs">
                <Printer size={14} /> Imprimir
              </button>
              <button onClick={nuevaVenta} className="btn-primary flex-1 justify-center">
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Checkout Success Animation Overlay */}
      {checkoutSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-slate-100 flex flex-col items-center justify-center text-center animate-scale-up">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-100 animate-pulse"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-emerald-500 animate-spin" style={{ animationDuration: '1.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CheckCircle size={54} className="text-emerald-500 animate-bounce" />
              </div>
            </div>
            
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">¡PRODUCTO VENDIDO!</h2>
            <p className="text-sm text-slate-400 mt-2 font-medium">Procesando folio y descontando inventario...</p>
            
            <div className="w-full mt-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2 text-xs text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Cliente:</span>
                <span className="font-bold text-slate-700">{clienteSeleccionado?.nombre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Método de pago:</span>
                <span className="font-bold text-slate-700">{formaPago}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
                <span className="text-slate-500 font-bold">Total:</span>
                <span className="font-extrabold text-blue-600">${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
