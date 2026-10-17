export function formatearPrecio(numero) {
  return '$' + Number(numero).toLocaleString('es-CL');
}

export function esStockCritico(producto) {
  return producto.stock <= (producto.stockCritico || 5);
}