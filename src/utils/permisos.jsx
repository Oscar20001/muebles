// ─── SISTEMA DE PERMISOS ────────────────────────────────────────────────────
// Solo el Administrador puede editar, eliminar y modificar registros.

/**
 * Retorna true si el usuario actual es Administrador.
 */
export function esAdmin(user) {
  return user?.rol === 'Administrador';
}

/**
 * Banner de aviso para usuarios sin permisos de edición.
 */
export function BannerSoloLectura() {
  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm animate-fade-in">
      <span className="text-amber-500 text-lg">🔒</span>
      <div>
        <p className="font-semibold text-amber-700">Modo de solo consulta</p>
        <p className="text-amber-600 text-xs mt-0.5">
          Solo el Administrador puede editar, eliminar o modificar registros.
        </p>
      </div>
    </div>
  );
}
