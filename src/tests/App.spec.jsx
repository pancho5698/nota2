import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  // Test 8
  it('el carrito exige sesion: sin iniciar sesion redirige al login', () => {
    render(
      <MemoryRouter initialEntries={['/carrito']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Inicia sesión para ver tu carrito.')).toBeTruthy();
    expect(screen.queryByText('Tu carrito está vacío')).toBeNull();
  });
});
