const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '');
const CLAVE_TOKEN = 'token';

export function obtenerToken() {
  return localStorage.getItem(CLAVE_TOKEN);
}

export function guardarToken(token) {
  if (token) {
    localStorage.setItem(CLAVE_TOKEN, token);
  } else {
    localStorage.removeItem(CLAVE_TOKEN);
  }
}

export function limpiarToken() {
  localStorage.removeItem(CLAVE_TOKEN);
}

async function peticion(ruta, { method = 'GET', body, conToken = true } = {}) {
  const headers = {};

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }

  if (conToken) {
    const token = obtenerToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    const error = new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.',
    );
    error.status = 0;
    throw error;
  }

  if (respuesta.status === 204) {
    return null;
  }

  const texto = await respuesta.text();
  let datos = null;
  if (texto) {
    try {
      datos = JSON.parse(texto);
    } catch {
      datos = { message: texto };
    }
  }

  if (!respuesta.ok) {
    const mensaje =
      datos?.message ||
      datos?.error ||
      (respuesta.status === 401
        ? 'Tu sesión expiró o no tienes autorización.'
        : respuesta.status === 403
          ? 'No tienes permisos para realizar esta acción.'
          : 'Ocurrió un error al comunicarse con el servidor.');
    const error = new Error(mensaje);
    error.status = respuesta.status;
    throw error;
  }

  return datos;
}

// Autenticación
export function loginApi({ correo, contrasena }) {
  return peticion('/api/v1/auth/login', {
    method: 'POST',
    body: { correo, contrasena },
    conToken: false,
  });
}

export function registroApi({ nombre, correo, contrasena }) {
  return peticion('/api/v1/auth/registro', {
    method: 'POST',
    body: { nombre, correo, contrasena },
    conToken: false,
  });
}

export function renovarSesionApi() {
  return peticion('/api/v1/auth/refresh', {
    method: 'POST',
  });
}

// Productos
export function obtenerProductosApi() {
  return peticion('/api/v1/productos', { conToken: false });
}

export function obtenerProductoApi(id) {
  return peticion(`/api/v1/productos/${id}`, { conToken: false });
}

export function crearProductoApi(producto) {
  return peticion('/api/v1/productos', {
    method: 'POST',
    body: producto,
  });
}

export function actualizarProductoApi(id, producto) {
  return peticion(`/api/v1/productos/${id}`, {
    method: 'PUT',
    body: producto,
  });
}

export function eliminarProductoApi(id) {
  return peticion(`/api/v1/productos/${id}`, {
    method: 'DELETE',
  });
}

// Categorías
export function obtenerCategoriasApi() {
  return peticion('/api/v1/categorias', { conToken: false });
}

export function crearCategoriaApi(categoria) {
  return peticion('/api/v1/categorias', {
    method: 'POST',
    body: categoria,
  });
}

// Usuarios (solo ADMIN)
export function obtenerUsuariosApi() {
  return peticion('/api/v1/usuarios');
}

export function crearUsuarioApi(usuario) {
  return peticion('/api/v1/usuarios', {
    method: 'POST',
    body: usuario,
  });
}

export function actualizarUsuarioApi(id, usuario) {
  return peticion(`/api/v1/usuarios/${id}`, {
    method: 'PUT',
    body: usuario,
  });
}

export function eliminarUsuarioApi(id) {
  return peticion(`/api/v1/usuarios/${id}`, {
    method: 'DELETE',
  });
}

// Boletas / Compras
export function obtenerBoletasApi() {
  return peticion('/api/v1/boletas');
}

export function obtenerBoletaApi(id) {
  return peticion(`/api/v1/boletas/${id}`);
}

export function crearBoletaApi(items) {
  return peticion('/api/v1/boletas', {
    method: 'POST',
    body: { items },
  });
}
