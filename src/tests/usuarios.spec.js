import { autenticarUsuario, registrarUsuario } from '../utils/usuarios';

describe('usuarios', () => {
  const datos = { nombre: 'Ana', correo: 'ana@duocuc.cl', contrasena: 'secreto1' };

  beforeEach(() => localStorage.clear());
  afterAll(() => localStorage.clear());

  // Test 4
  it('el login solo funciona con la contrasena correcta y no expone la contrasena', () => {
    registrarUsuario(datos);

    const usuario = autenticarUsuario({ correo: 'ANA@duocuc.cl', contrasena: 'secreto1' });
    expect(usuario.nombre).toBe('Ana');
    expect(usuario.contrasena).toBeUndefined();

    expect(autenticarUsuario({ correo: 'ana@duocuc.cl', contrasena: 'incorrecta' })).toBeNull();
  });

  // Test 5
  it('no permite registrar el mismo correo aunque cambien mayusculas o espacios', () => {
    expect(registrarUsuario(datos)).toBe('');
    expect(registrarUsuario({ ...datos, correo: '  ANA@duocuc.cl ' })).toBe(
      'Ya existe una cuenta con ese correo.',
    );
    expect(JSON.parse(localStorage.getItem('usuarios')).length).toBe(1);
  });
});
