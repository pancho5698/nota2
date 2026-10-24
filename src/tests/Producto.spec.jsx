import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Producto from '../components/Producto';

describe('Producto', () => {
  // Test 7
  it('deshabilita el boton de agregar cuando no hay stock', () => {
    const producto = {
      id: 1,
      nombre: 'Creatina',
      categoria: 'Aminoacidos',
      precio: 50000,
      stock: 0,
      imagen: '/img/creatina.jpg',
    };

    render(
      <MemoryRouter>
        <Producto producto={producto} onAgregar={() => {}} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Sin stock')).toBeTruthy();
    expect(screen.getByText('Agregar al carrito').disabled).toBeTrue();
  });
});
