import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Cabecera from '../components/Cabecera';

function renderCabecera(cantidad) {
  render(
    <MemoryRouter>
      <Cabecera cantidadCarrito={cantidad} />
    </MemoryRouter>,
  );
}

describe('Cabecera', () => {
  it('muestra la cantidad del carrito recibida por props', () => {
    renderCabecera(3);
    expect(document.getElementById('contador-carrito').textContent).toBe('3');
  });

  it('abre y cierra el menu movil', () => {
    renderCabecera();
    const boton = screen.getByLabelText('Abrir menú');
    const menu = document.getElementById('menu-principal');

    fireEvent.click(boton);
    expect(menu.classList.contains('show')).toBeTrue();
    fireEvent.click(boton);
    expect(menu.classList.contains('show')).toBeFalse();
  });

  it('cierra el menu al elegir un enlace', () => {
    renderCabecera();
    fireEvent.click(screen.getByLabelText('Abrir menú'));
    fireEvent.click(screen.getByText('Blogs'));
    expect(
      document.getElementById('menu-principal').classList.contains('show'),
    ).toBeFalse();
  });

  it('el enlace de iniciar sesion lleva al admin', () => {
    renderCabecera();
    expect(screen.getByText('Iniciar Sesión').getAttribute('href')).toBe('/login');
  });
});