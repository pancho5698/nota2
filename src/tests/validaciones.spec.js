import { validarCorreo } from '../utils/validaciones';

describe('validaciones', () => {
  // Test 6
  it('solo acepta correos de los dominios permitidos', () => {
    expect(validarCorreo('ana@duocuc.cl')).toBe('');
    expect(validarCorreo('ana@gmail.com')).toBe('');
    expect(validarCorreo('ana@yahoo.com')).toContain('Solo se aceptan correos');
  });
});
