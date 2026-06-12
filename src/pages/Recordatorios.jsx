import { useState } from 'react';
import { Bell, MessageCircle, Clock, AlertTriangle, Package, Truck, CheckCircle, X } from 'lucide-react';
const tipoConfig = {
  pago_proximo: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Pago próximo', badgeCls: 'badge-yellow' },
  pago_atrasado: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-50 border-red-200', label: 'Pago atrasado', badgeCls: 'badge-red' },
  inventario_bajo: { icon: Package, color: 'text-violet-500', bg: 'bg-violet-50 border-violet-200', label: 'Inventario bajo', badgeCls: 'badge-blue' },
  entrega_pendiente: { icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50 border-blue-200', label: 'Entrega pendiente', badgeCls: 'badge-blue' },
};

const urgenciaLabel = { alta: 'Urgente', media: 'Media', baja: 'Baja' };

export default function Recordatorios({ user, recordatorios, setRecordatorios }) {
  const [filtro, setFiltro] = useState('Todos');
  const [whatsappModal, setWhatsappModal] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const filtered = recordatorios.filter(r => {
    if (filtro === 'Todos') return true;
    if (filtro === 'Urgentes') return r.urgencia === 'alta';
    if (filtro === 'Pagos') return r.tipo.startsWith('pago');
    if (filtro === 'Inventario') return r.tipo === 'inventario_bajo';
    if (filtro === 'Entregas') return r.tipo === 'entrega_pendiente';
    return true;
  });

  const marcarLeido = (id) => setRecordatorios(prev => prev.filter(r => r.id !== id));

  const enviarWhatsapp = () => {
    setEnviando(true);
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      setTimeout(() => {
        setEnviado(false);
        setWhatsappModal(null);
      }, 2000);
    }, 1500);
  };

  const urgentes = recordatorios.filter(r => r.urgencia === 'alta').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="section-title">Centro de Recordatorios</h1>
          <p className="section-subtitle">{recordatorios.length} alertas activas — {urgentes} urgentes</p>
        </div>
        {urgentes > 0 && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2 text-sm font-semibold text-red-600">
            <AlertTriangle size={16} className="animate-pulse" />
            {urgentes} alertas urgentes
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(tipoConfig).map(([key, cfg]) => {
          const count = recordatorios.filter(r => r.tipo === key).length;
          const Icon = cfg.icon;
          return (
            <div key={key} className="card text-center hover:shadow-card-hover transition-all cursor-pointer" onClick={() => setFiltro(key === 'pago_proximo' || key === 'pago_atrasado' ? 'Pagos' : key === 'inventario_bajo' ? 'Inventario' : 'Entregas')}>
              <Icon size={24} className={`${cfg.color} mx-auto mb-2`} />
              <p className="text-2xl font-extrabold text-slate-800">{count}</p>
              <p className="text-xs text-slate-400 mt-0.5">{cfg.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['Todos', 'Urgentes', 'Pagos', 'Inventario', 'Entregas'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${filtro === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filtered.map(r => {
          const cfg = tipoConfig[r.tipo];
          const Icon = cfg.icon;
          return (
            <div key={r.id} className={`flex items-start gap-4 p-4 rounded-2xl border ${cfg.bg} animate-fade-in`}>
              <div className={`w-10 h-10 rounded-xl ${r.urgencia === 'alta' ? 'bg-red-100' : r.urgencia === 'media' ? 'bg-amber-100' : 'bg-blue-100'} flex items-center justify-center flex-shrink-0`}>
                <Icon size={18} className={cfg.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cfg.badgeCls}>{cfg.label}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.urgencia === 'alta' ? 'text-red-600 bg-red-100' : r.urgencia === 'media' ? 'text-amber-600 bg-amber-100' : 'text-blue-600 bg-blue-100'}`}>
                    {urgenciaLabel[r.urgencia]}
                  </span>
                </div>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">{r.mensaje}</p>
                {r.telefono && (
                  <p className="text-xs text-slate-400 mt-1">📞 {r.telefono}</p>
                )}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {r.telefono && (
                  <button
                    onClick={() => setWhatsappModal(r)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-all shadow-sm active:scale-95"
                  >
                    <MessageCircle size={13} /> WhatsApp
                  </button>
                )}
                <button
                  onClick={() => marcarLeido(r.id)}
                  className="p-1.5 text-slate-300 hover:text-slate-500 hover:bg-white rounded-lg transition-all"
                  title="Marcar como atendido"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-300">
            <CheckCircle size={50} className="mx-auto mb-3 text-emerald-300" />
            <p className="text-slate-500 font-semibold">¡Todo al día!</p>
            <p className="text-sm text-slate-400 mt-1">No hay alertas en esta categoría</p>
          </div>
        )}
      </div>

      {/* WhatsApp Modal */}
      {whatsappModal && (
        <div className="modal-overlay animate-fade-in" onClick={() => setWhatsappModal(null)}>
          <div className="modal-content animate-slide-up max-w-sm" onClick={e => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-5 flex items-center gap-3">
              <MessageCircle size={24} className="text-white" />
              <div>
                <h2 className="text-white font-bold text-lg">Enviar por WhatsApp</h2>
                <p className="text-emerald-100 text-xs">Simulación de mensaje</p>
              </div>
            </div>
            <div className="p-6">
              {enviado ? (
                <div className="text-center py-6">
                  <CheckCircle size={50} className="text-emerald-500 mx-auto mb-3" />
                  <p className="font-bold text-slate-800">¡Mensaje enviado!</p>
                  <p className="text-slate-500 text-sm mt-1">El cliente fue notificado</p>
                </div>
              ) : (
                <>
                  <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Para:</p>
                    <p className="font-bold text-slate-800">{whatsappModal.cliente}</p>
                    <p className="text-sm text-slate-500">{whatsappModal.telefono}</p>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-emerald-600 mb-2">📱 Vista previa del mensaje:</p>
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <p className="text-sm text-slate-700 leading-relaxed">
                        Hola <strong>{whatsappModal.cliente?.split(' ')[0]}</strong>, le saluda <strong>Fábri Muebles</strong>. 🪑
                        <br /><br />
                        {whatsappModal.mensaje}
                        <br /><br />
                        Para mayor información contáctenos. ¡Gracias por su preferencia!
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setWhatsappModal(null)} className="btn-secondary flex-1 justify-center">Cancelar</button>
                    <button
                      onClick={enviarWhatsapp}
                      disabled={enviando}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                    >
                      {enviando ? (
                        <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Enviando...</>
                      ) : (
                        <><MessageCircle size={16} /> Enviar</>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
