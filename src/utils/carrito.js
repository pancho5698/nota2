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
      precio: producto.precio,
      imagen: producto.imagen,
      cantidad,
    },
  ];
}

export function contarItems(carrito) {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}