import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Inicio from '../components/Inicio';
// Datos de prueba: el test no depende del backend ni de un archivo externo.
const productos = [
  { id: 1, codigo: 'PROT-001', nombre: 'Prostar 5 lb', categoria: 'Proteínas & Aminoácidos', precio: 90000, precioOferta: 79990, stock: 12, stockCritico: 5, imagen: '/img/proteina.jpg' },
  { id: 2, codigo: 'CREAT-002', nombre: 'Creatina 300 g', categoria: 'Proteínas & Aminoácidos', precio: 50000, stock: 4, stockCritico: 5, imagen: '/img/creatina.jpg' },
  { id: 3, codigo: 'EQUI-003', nombre: 'Bandas Elásticas', categoria: 'Equipamiento', precio: 12990, stock: 45, stockCritico: 5, imagen: '/img/bandas.jpg' },
  { id: 4, codigo: 'EQUI-004', nombre: 'Mancuernas', categoria: 'Equipamiento', precio: 30000, stock: 8, stockCritico: 5, imagen: '/img/mancuernas.jpg' },
  { id: 5, codigo: 'VIT-005', nombre: 'Vitamina C', categoria: 'Vitaminas', precio: 8990, stock: 20, stockCritico: 5, imagen: '/img/vitamina-c.jpg' },
];

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