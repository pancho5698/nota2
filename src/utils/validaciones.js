// Cada función recibe los datos del formulario y devuelve un objeto con los errores.
// Si el objeto queda vacío, el formulario es válido.

const FORMATO_CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DOMINIOS_PERMITIDOS = /@(duocuc\.cl|profesor\.duocuc\.cl|gmail\.com|outlook\.com)$/;

export function hayErrores(errores) {
  return Object.keys(errores).length > 0;
}

export function validarCorreo(correo) {
  const valor = correo.trim();

  if (valor === '') return 'El correo es obligatorio.';
  if (valor.length > 100) return 'El correo no puede superar los 100 caracteres.';
  if (!FORMATO_CORREO.test(valor)) return 'Ingresa un correo válido.';
  if (!DOMINIOS_PERMITIDOS.test(valor)) {
    return 'Solo se aceptan correos @duocuc.cl, @profesor.duocuc.cl, @gmail.com o @outlook.com.';
  }
  return '';
}

export function validarContacto({ nombre, correo, comentario }) {
  const errores = {};

  if (nombre.trim() === '') {
    errores.nombre = 'El nombre es obligatorio.';
  } else if (nombre.length > 100) {
    errores.nombre = 'El nombre no puede superar los 100 caracteres.';
  }

  const errorCorreo = validarCorreo(correo);
  if (errorCorreo) errores.correo = errorCorreo;

  if (comentario.trim() === '') {
    errores.comentario = 'El comentario es obligatorio.';
  } else if (comentario.length > 500) {
    errores.comentario = 'El comentario no puede superar los 500 caracteres.';
  }

  return errores;
}
