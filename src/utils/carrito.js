export function agregarItem(carrito, producto, cantidad = 1) {
  const existe = carrito.find((item) => item.id === producto.id);

  if (existe) {
    return carrito.map((item) =>
      item.id === producto.id ? { ...item, cantidad: item.cantidad + cantidad } : item,
    );
  }

  return [
    ...carrito,
    {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precioOferta ?? producto.precio,
      imagen: producto.imagen,
      cantidad,
    },
  ];
}

export function cambiarCantidad(carrito, id, cantidad) {
  return carrito.map((item) =>
    item.id === id ? { ...item, cantidad: Math.max(1, cantidad) } : item,
  );
}

export function quitarItem(carrito, id) {
  return carrito.filter((item) => item.id !== id);
}

export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

export function calcularTotal(carrito) {
  return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
}