import { render, screen } from '@testing-library/react';
import Nosotros from '../components/Nosotros';

describe('Nosotros', () => {
  beforeEach(() => {
    render(<Nosotros />);
  });

  it('muestra los tres bloques de la empresa', () => {
    expect(document.querySelectorAll('.bloque-nosotros').length).toBe(3);
  });

  it('cada bloque tiene su titulo', () => {
    expect(screen.getByText('Nuestra historia')).toBeTruthy();
    expect(screen.getByText('Misión')).toBeTruthy();
    expect(screen.getByText('Equipo')).toBeTruthy();
  });
});