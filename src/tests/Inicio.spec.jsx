import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inicio from '../components/Inicio';
import productos from '../data/productos.json';

function renderInicio(onAgregar = () => {}) {
  render(
    <MemoryRouter>
      <Inicio productos={productos} onAgregar={onAgregar} />
    </MemoryRouter>,
  );
}

describe('Inicio', () => {
  it('muestra solo los 4 productos mas vendidos', () => {
    renderInicio();
    expect(screen.getByText('Más vendidos')).toBeTruthy();
    expect(document.querySelectorAll('.tarjeta-producto').length).toBe(4);
  });

  it('el boton Ver productos lleva al catalogo', () => {
    renderInicio();
    expect(screen.getByText('Ver productos').getAttribute('href')).toBe('/productos');
  });

  it('al agregar avisa al padre y muestra un mensaje', () => {
    const onAgregar = jasmine.createSpy('onAgregar');
    renderInicio(onAgregar);

    fireEvent.click(screen.getAllByText('Agregar al carrito')[0]);

    expect(onAgregar).toHaveBeenCalledWith(productos[0]);
    expect(screen.getByRole('status').textContent).toContain('Prostar 5 lb se agregó');
  });

  it('el boton queda deshabilitado si no hay stock', () => {
    const sinStock = productos.map((p) => ({ ...p, stock: 0 }));
    render(
      <MemoryRouter>
        <Inicio productos={sinStock} onAgregar={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.getAllByText('Agregar al carrito')[0].disabled).toBeTrue();
    expect(screen.getAllByText('Sin stock').length).toBe(4);
  });
});