import { useState } from 'react';
import { User, Building2, Save, Sparkles, CheckCircle, Shield } from 'lucide-react';
import { esAdmin } from '../utils/permisos.jsx';

export default function Configuracion({ user, setUser, empresa, setEmpresa, addToast }) {
  const admin = esAdmin(user);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    nombre: user?.nombre || '',
    email: user?.email || '',
    genero: user?.genero || '👨'
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    nombre: empresa?.nombre || 'Fábri Muebles',
    logo: empresa?.logo || '🛋️',
    direccion: empresa?.direccion || 'Av. Álvaro Obregón #123, Culiacán',
    telefono: empresa?.telefono || '667-888-9900'
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!profileForm.nombre) {
      alert('El nombre es obligatorio.');
      return;
    }

    const updatedUser = {
      ...user,
      nombre: profileForm.nombre,
      email: profileForm.email,
      genero: profileForm.genero,
      avatar: profileForm.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    };

    setUser(updatedUser);
    
    if (typeof addToast === 'function') {
      addToast('👤 ¡Perfil actualizado con éxito!', 'success');
    } else {
      alert('¡Perfil actualizado con éxito!');
    }
  };

  const handleSaveCompany = (e) => {
    e.preventDefault();
    if (!admin) {
      alert('Solo el Administrador General puede modificar la configuración de la empresa.');
      return;
    }

    setEmpresa(companyForm);
    
    if (typeof addToast === 'function') {
      addToast('🏢 ¡Configuración de la empresa guardada!', 'success');
    } else {
      alert('¡Configuración de la empresa guardada!');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title">Configuración del Sistema</h1>
        <p className="section-subtitle">Administra tu perfil de usuario y la información comercial de la empresa</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Profile Settings */}
        <div className="card">
          <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <User size={16} className="text-blue-600" /> Ajustes de Mi Perfil
          </h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-2">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-sm">
                {profileForm.genero ? (
                  <span>{profileForm.genero}</span>
                ) : (
                  <span>{profileForm.nombre.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'U'}</span>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{profileForm.nombre || 'Nombre de Usuario'}</p>
                <p className="text-xs text-slate-400 font-semibold">{user?.rol || 'Usuario'}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Completo *</label>
              <input 
                required 
                type="text" 
                value={profileForm.nombre} 
                onChange={e => setProfileForm({ ...profileForm, nombre: e.target.value })} 
                className="input-field" 
                placeholder="Tu nombre completo"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Correo Electrónico</label>
              <input 
                type="email" 
                value={profileForm.email} 
                onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} 
                className="input-field" 
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Género / Avatar</label>
              <select 
                value={profileForm.genero} 
                onChange={e => setProfileForm({ ...profileForm, genero: e.target.value })} 
                className="input-field"
              >
                <option value="👨">👨 Hombre</option>
                <option value="👩">👩 Mujer</option>
              </select>
            </div>

            <button type="submit" className="btn-primary w-full justify-center flex items-center gap-1.5 pt-2.5 pb-2.5">
              <Save size={15} /> Guardar Perfil
            </button>
          </form>
        </div>

        {/* Company Settings */}
        <div className="card">
          <h2 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Building2 size={16} className="text-emerald-600" /> Información Comercial de la Empresa
          </h2>
          {!admin && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-700 mb-4">
              <Shield size={14} className="flex-shrink-0" />
              <span>Modo consulta: Solo el Administrador General puede modificar estos datos.</span>
            </div>
          )}
          <form onSubmit={handleSaveCompany} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre Comercial de la Empresa *</label>
              <input 
                required 
                disabled={!admin}
                type="text" 
                value={companyForm.nombre} 
                onChange={e => setCompanyForm({ ...companyForm, nombre: e.target.value })} 
                className={`input-field ${!admin ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`} 
                placeholder="Ej: Fábri Muebles"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Logo (Emoji) *</label>
                <select 
                  disabled={!admin}
                  value={companyForm.logo} 
                  onChange={e => setCompanyForm({ ...companyForm, logo: e.target.value })} 
                  className={`input-field ${!admin ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`}
                >
                  <option value="🛋️">🛋️ Sofá</option>
                  <option value="🛏️">🛏️ Cama</option>
                  <option value="🪵">🪵 Tronco / Madera</option>
                  <option value="🔨">🔨 Martillo</option>
                  <option value="📦">📦 Caja / Base</option>
                  <option value="🏢">🏢 Edificio</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Teléfono Comercial *</label>
                <input 
                  required 
                  disabled={!admin}
                  type="text" 
                  value={companyForm.telefono} 
                  onChange={e => setCompanyForm({ ...companyForm, telefono: e.target.value })} 
                  className={`input-field ${!admin ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`} 
                  placeholder="667-000-0000"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Dirección Fiscal / Sucursal Principal</label>
              <input 
                disabled={!admin}
                type="text" 
                value={companyForm.direccion} 
                onChange={e => setCompanyForm({ ...companyForm, direccion: e.target.value })} 
                className={`input-field ${!admin ? 'bg-slate-50 cursor-not-allowed text-slate-500' : ''}`} 
                placeholder="Sucursal principal"
              />
            </div>

            {admin && (
              <button type="submit" className="btn-success w-full justify-center flex items-center gap-1.5 pt-2.5 pb-2.5">
                <Save size={15} /> Guardar Datos de la Empresa
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
