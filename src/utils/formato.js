export function formatearPrecio(numero) {
  return '$' + Number(numero).toLocaleString('es-CL');
}

export function esStockCritico(producto) {
  return producto.stock <= (producto.stockCritico || 5);
}

export function normalizarRol(rol) {
  return (rol || '').toUpperCase();
}

export function formatearFecha(fechaIso) {
  if (!fechaIso) return '—';
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) return String(fechaIso);
  return fecha.toLocaleString('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}