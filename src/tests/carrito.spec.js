import { agregarItem, calcularTotal } from '../utils/carrito';

describe('carrito', () => {
  const conOferta = { id: 1, nombre: 'Prostar', precio: 90000, precioOferta: 79990, imagen: '/img/a.jpg' };

  // Test 1
  it('agrega un producto nuevo usando el precio de oferta si existe', () => {
    const resultado = agregarItem([], conOferta);

    expect(resultado.length).toBe(1);
    expect(resultado[0].precio).toBe(79990);
    expect(resultado[0].cantidad).toBe(1);
  });

  // Test 2
  it('si el producto ya esta en el carrito suma la cantidad sin duplicarlo', () => {
    const carrito = agregarItem([], conOferta, 2);
    const resultado = agregarItem(carrito, conOferta, 3);

    expect(resultado.length).toBe(1);
    expect(resultado[0].cantidad).toBe(5);
  });

  // Test 3
  it('calcula el total como suma de precio por cantidad', () => {
    const carrito = [
      { id: 1, precio: 1000, cantidad: 3 },
      { id: 2, precio: 500, cantidad: 2 },
    ];

    expect(calcularTotal(carrito)).toBe(4000);
  });
});
