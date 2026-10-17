export function leerDatos(clave, valorInicial) {
  const guardado = localStorage.getItem(clave);
  return guardado ? JSON.parse(guardado) : valorInicial;
}

export function guardarDatos(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}