import { guardarDatos, leerDatos } from './almacenamiento';

export function registrarUsuario({ nombre, correo, contrasena }) {
  const usuarios = leerDatos('usuarios', []);
  const correoNormalizado = correo.trim().toLowerCase();

  if (usuarios.some((usuario) => usuario.correo === correoNormalizado)) {
    return 'Ya existe una cuenta con ese correo.';
  }

  guardarDatos('usuarios', [
    ...usuarios,
    { id: Date.now(), nombre: nombre.trim(), correo: correoNormalizado, contrasena },
  ]);
  return '';
}

export function autenticarUsuario({ correo, contrasena }) {
  const usuarios = leerDatos('usuarios', []);
  const correoNormalizado = correo.trim().toLowerCase();
  const usuario = usuarios.find(
    (u) => u.correo === correoNormalizado && u.contrasena === contrasena,
  );

  return usuario ? { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } : null;
}