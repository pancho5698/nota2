import { guardarDatos, leerDatos } from './almacenamiento';

const ADMIN = {
  id: 0,
  nombre: 'Administrador',
  correo: 'admin@fitlab.cl',
  contrasena: 'admin123',
  rol: 'admin',
};

export function registrarUsuario({ nombre, correo, contrasena }) {
  const usuarios = leerDatos('usuarios', []);
  const correoNormalizado = correo.trim().toLowerCase();

  if ([ADMIN, ...usuarios].some((usuario) => usuario.correo === correoNormalizado)) {
    return 'Ya existe una cuenta con ese correo.';
  }

  guardarDatos('usuarios', [
    ...usuarios,
    {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correoNormalizado,
      contrasena,
      rol: 'cliente',
    },
  ]);
  return '';
}

export function autenticarUsuario({ correo, contrasena }) {
  const usuarios = [ADMIN, ...leerDatos('usuarios', [])];
  const correoNormalizado = correo.trim().toLowerCase();
  const usuario = usuarios.find(
    (u) => u.correo === correoNormalizado && u.contrasena === contrasena,
  );

  return usuario
    ? { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo, rol: usuario.rol ?? 'cliente' }
    : null;
}
