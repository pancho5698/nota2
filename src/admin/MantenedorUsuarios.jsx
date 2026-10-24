import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario';
import { hayErrores, validarUsuario } from '../utils/validaciones';

const formularioVacio = { nombre: '', correo: '', contrasena: '', rol: 'cliente' };

export default function MantenedorUsuarios({ usuarios, onGuardar, onEliminar }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datos, setDatos] = useState(formularioVacio);
  const [idEditando, setIdEditando] = useState(null);
  const [errores, setErrores] = useState({});

  function abrirModal(usuario) {
    setDatos(
      usuario
        ? { nombre: usuario.nombre, correo: usuario.correo, contrasena: '', rol: usuario.rol ?? 'cliente' }
        : formularioVacio,
    );
    setIdEditando(usuario ? usuario.id : null);
    setErrores({});
    setMostrarModal(true);
  }

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function eliminar(usuario) {
    if (window.confirm(`¿Eliminar a "${usuario.nombre}"?`)) {
      onEliminar(usuario.id);
    }
  }

  function guardar(e) {
    e.preventDefault();
    const nuevosErrores = validarUsuario(datos, idEditando === null);
    const correo = datos.correo.trim().toLowerCase();

    if (!nuevosErrores.correo && usuarios.some((u) => u.correo === correo && u.id !== idEditando)) {
      nuevosErrores.correo = 'Ya existe una cuenta con ese correo.';
    }
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const original = usuarios.find((u) => u.id === idEditando);
    onGuardar({
      id: idEditando ?? Date.now(),
      nombre: datos.nombre.trim(),
      correo,
      contrasena: datos.contrasena || original.contrasena,
      rol: datos.rol,
    });
    setMostrarModal(false);
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
              {usuarios.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No hay usuarios registrados.
                  </td>
                </tr>
              ) : (
                usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span className={u.rol === 'admin' ? 'estado-critico' : 'estado-ok'}>
                        {u.rol === 'admin' ? 'Administrador' : 'Cliente'}
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
                ))
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
                    onClick={() => setMostrarModal(false)}
                  />
                </div>
                <div className="modal-body">
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
                    <option value="cliente">Cliente</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn boton"
                    onClick={() => setMostrarModal(false)}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn boton boton-primario">
                    Guardar usuario
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
