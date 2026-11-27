import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario';
import { normalizarRol } from '../utils/formato';
import { hayErrores, validarUsuario } from '../utils/validaciones';

const formularioVacio = { nombre: '', correo: '', contrasena: '', rol: 'CLIENTE' };

const etiquetasRol = {
  ADMIN: 'Administrador',
  VENDEDOR: 'Vendedor',
  CLIENTE: 'Cliente',
};

const clasesRol = {
  ADMIN: 'estado-critico',
  VENDEDOR: 'estado-vendedor',
  CLIENTE: 'estado-ok',
};

export default function MantenedorUsuarios({
  usuarios,
  cargando = false,
  onGuardar,
  onEliminar,
}) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datos, setDatos] = useState(formularioVacio);
  const [idEditando, setIdEditando] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState('');
  const [guardando, setGuardando] = useState(false);

  function abrirModal(usuario) {
    setDatos(
      usuario
        ? {
            nombre: usuario.nombre,
            correo: usuario.correo,
            contrasena: '',
            rol: normalizarRol(usuario.rol) || 'CLIENTE',
          }
        : formularioVacio,
    );
    setIdEditando(usuario ? usuario.id : null);
    setErrores({});
    setErrorApi('');
    setMostrarModal(true);
  }

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setErrorApi('');
  }

  async function eliminar(usuario) {
    if (!window.confirm(`¿Eliminar a "${usuario.nombre}"?`)) return;
    setErrorApi('');
    try {
      await onEliminar(usuario.id);
    } catch (error) {
      setErrorApi(error.message || 'No se pudo eliminar el usuario.');
    }
  }

  async function guardar(e) {
    e.preventDefault();
    const nuevosErrores = validarUsuario(datos, idEditando === null);
    const correo = datos.correo.trim().toLowerCase();

    if (
      !nuevosErrores.correo &&
      usuarios.some((u) => u.correo.toLowerCase() === correo && u.id !== idEditando)
    ) {
      nuevosErrores.correo = 'Ya existe una cuenta con ese correo.';
    }
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const payload = {
      nombre: datos.nombre.trim(),
      correo,
      rol: normalizarRol(datos.rol) || 'CLIENTE',
    };
    if (datos.contrasena) {
      payload.contrasena = datos.contrasena;
    }

    setGuardando(true);
    setErrorApi('');
    try {
      await onGuardar(payload, idEditando);
      setMostrarModal(false);
    } catch (error) {
      setErrorApi(error.message || 'No se pudo guardar el usuario.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">Gestión de usuarios</h2>
        <button
          type="button"
          className="btn boton boton-primario"
          onClick={() => abrirModal(null)}
        >
          + Agregar usuario
        </button>
      </div>

      {!mostrarModal && errorApi && (
        <div className="alert alert-danger" role="alert">
          {errorApi}
        </div>
      )}

      <div className="tarjeta">
        <div className="table-responsive">
          <table className="table tabla-admin align-middle mb-0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    Cargando usuarios...
                  </td>
                </tr>
              ) : usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => {
                  const rol = normalizarRol(u.rol) || 'CLIENTE';
                  return (
                    <tr key={u.id}>
                      <td>{u.nombre}</td>
                      <td>{u.correo}</td>
                      <td>
                        <span className={clasesRol[rol] || 'estado-ok'}>
                          {etiquetasRol[rol] || rol}
                        </span>
                      </td>
                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="boton-accion boton-editar me-2"
                          onClick={() => abrirModal(u)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="boton-accion boton-eliminar"
                          onClick={() => eliminar(u)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {mostrarModal && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered">
              <form className="modal-content" onSubmit={guardar} noValidate>
                <div className="modal-header">
                  <h3 className="modal-title h5">
                    {idEditando ? 'Editar usuario' : 'Nuevo usuario'}
                  </h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    disabled={guardando}
                    onClick={() => setMostrarModal(false)}
                  />
                </div>
                <div className="modal-body">
                  {errorApi && (
                    <div className="alert alert-danger" role="alert">
                      {errorApi}
                    </div>
                  )}
                  <CampoFormulario
                    id="nombre"
                    etiqueta="Nombre"
                    value={datos.nombre}
                    error={errores.nombre}
                    onChange={cambiar}
                  />
                  <CampoFormulario
                    id="correo"
                    etiqueta="Correo"
                    tipo="email"
                    value={datos.correo}
                    error={errores.correo}
                    onChange={cambiar}
                  />
                  <CampoFormulario
                    id="contrasena"
                    etiqueta={idEditando ? 'Contraseña (vacía = no cambiar)' : 'Contraseña'}
                    tipo="password"
                    value={datos.contrasena}
                    error={errores.contrasena}
                    onChange={cambiar}
                  />
                  <label htmlFor="rol" className="form-label">
                    Rol
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    className="form-select"
                    value={datos.rol}
                    onChange={cambiar}
                  >
                    <option value="CLIENTE">Cliente</option>
                    <option value="VENDEDOR">Vendedor</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn boton"
                    disabled={guardando}
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn boton boton-primario" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar usuario'}
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}
