import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario';
import { esStockCritico, formatearPrecio } from '../utils/formato';
import { hayErrores, validarProducto } from '../utils/validaciones';

const categoriasPorDefecto = [
  'Proteínas & Aminoácidos',
  'Equipamiento',
  'Ropa Deportiva',
  'Vitaminas',
];

const formularioVacio = {
  codigo: '',
  nombre: '',
  categoria: '',
  precio: '',
  precioOferta: '',
  stock: '',
  stockCritico: '',
  descripcion: '',
};

export default function MantenedorProductos({
  productos,
  categoriasDisponibles = [],
  soloLectura = false,
  onGuardar,
  onEliminar,
}) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datos, setDatos] = useState(formularioVacio);
  const [idEditando, setIdEditando] = useState(null);
  const [errores, setErrores] = useState({});
  const [errorApi, setErrorApi] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [productoDetalle, setProductoDetalle] = useState(null);

  const nombresCategorias = Array.from(
    new Set([
      ...categoriasDisponibles.map((c) => (typeof c === 'string' ? c : c.nombre)).filter(Boolean),
      ...categoriasPorDefecto,
      ...productos.map((p) => p.categoria).filter(Boolean),
    ]),
  );

  const hayCritico = productos.some(esStockCritico);

  function abrirFormulario(producto) {
    if (soloLectura) return;
    setDatos(
      producto
        ? { ...formularioVacio, ...producto, precioOferta: producto.precioOferta ?? '' }
        : formularioVacio,
    );
    setIdEditando(producto ? producto.id : null);
    setErrores({});
    setErrorApi('');
    setMostrarFormulario(true);
  }

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setErrorApi('');
  }

  async function eliminar(producto) {
    if (soloLectura) return;
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) return;
    setErrorApi('');
    try {
      await onEliminar(producto.id);
    } catch (error) {
      setErrorApi(error.message || 'No se pudo eliminar el producto.');
    }
  }

  async function guardar(e) {
    e.preventDefault();
    if (soloLectura) return;
    const nuevosErrores = validarProducto(datos);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const original = productos.find((p) => p.id === idEditando);
    const producto = {
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      precioOferta: datos.precioOferta !== '' ? Number(datos.precioOferta) : null,
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico) || 5,
      imagen: original ? original.imagen : '/img/proteina.jpg',
      descripcion: datos.descripcion.trim(),
    };

    setGuardando(true);
    setErrorApi('');
    try {
      await onGuardar(producto, idEditando);
      setMostrarFormulario(false);
    } catch (error) {
      setErrorApi(error.message || 'No se pudo guardar el producto.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">
          {soloLectura ? 'Catálogo de productos' : 'Gestión de productos'}
        </h2>
        {!soloLectura && (
          <button
            type="button"
            className="btn boton boton-primario"
            onClick={() => abrirFormulario(null)}
          >
            + Agregar producto
          </button>
        )}
      </div>

      {errorApi && (
        <div className="alert alert-danger" role="alert">
          {errorApi}
        </div>
      )}

      {hayCritico && (
        <div className="alerta-stock" role="alert">
          <strong>Alerta de inventario:</strong> hay productos con stock igual o menor al
          crítico.
        </div>
      )}

      {!soloLectura && mostrarFormulario && (
        <form id="formulario-producto" className="tarjeta mb-4" onSubmit={guardar} noValidate>
          <h3 className="h5">{idEditando ? 'Editar producto' : 'Nuevo producto'}</h3>
          <div className="row">
            <div className="col-md-6">
              <CampoFormulario
                id="codigo"
                etiqueta="Código"
                value={datos.codigo}
                error={errores.codigo}
                onChange={cambiar}
              />
            </div>
            <div className="col-md-6">
              <CampoFormulario
                id="nombre"
                etiqueta="Nombre"
                value={datos.nombre}
                error={errores.nombre}
                onChange={cambiar}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="categoria" className="form-label">
                Categoría
              </label>
              <select
                id="categoria"
                name="categoria"
                className={`form-select ${errores.categoria ? 'is-invalid' : ''}`}
                value={datos.categoria}
                onChange={cambiar}
              >
                <option value="">Selecciona una categoría</option>
                {nombresCategorias.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errores.categoria && <div className="invalid-feedback">{errores.categoria}</div>}
            </div>
            <div className="col-md-3">
              <CampoFormulario
                id="precio"
                etiqueta="Precio"
                tipo="number"
                value={datos.precio}
                error={errores.precio}
                onChange={cambiar}
              />
            </div>
            <div className="col-md-3">
              <CampoFormulario
                id="precioOferta"
                etiqueta="Precio oferta"
                tipo="number"
                value={datos.precioOferta}
                error={errores.precioOferta}
                onChange={cambiar}
              />
            </div>
            <div className="col-md-6">
              <CampoFormulario
                id="stock"
                etiqueta="Stock"
                tipo="number"
                value={datos.stock}
                error={errores.stock}
                onChange={cambiar}
              />
            </div>
            <div className="col-md-6">
              <CampoFormulario
                id="stockCritico"
                etiqueta="Stock crítico"
                tipo="number"
                placeholder="5"
                value={datos.stockCritico}
                onChange={cambiar}
              />
            </div>
            <div className="col-12">
              <CampoFormulario
                id="descripcion"
                etiqueta="Descripción"
                multilinea
                rows={3}
                value={datos.descripcion}
                onChange={cambiar}
              />
            </div>
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn boton boton-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar producto'}
            </button>
            <button
              type="button"
              className="btn boton"
              disabled={guardando}
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="tarjeta">
        <div className="table-responsive">
          <table className="table tabla-admin align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No hay productos registrados.
                  </td>
                </tr>
              ) : (
                productos.map((p) => {
                  const critico = esStockCritico(p);
                  return (
                    <tr key={p.id} className={critico ? 'fila-critica' : ''}>
                      <td className="text-nowrap">
                        <strong>{p.codigo}</strong>
                      </td>
                      <td>{p.nombre}</td>
                      <td>{p.categoria}</td>
                      <td className="text-nowrap">
                        {formatearPrecio(p.precioOferta ?? p.precio)}
                        {typeof p.precioOferta === 'number' && (
                          <span className="badge text-bg-danger ms-2">Oferta</span>
                        )}
                      </td>
                      <td>{p.stock}</td>
                      <td>
                        <span className={critico ? 'estado-critico' : 'estado-ok'}>
                          {critico ? 'CRÍTICO' : 'OK'}
                        </span>
                      </td>
                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="boton-accion boton-ver me-2"
                          onClick={() => setProductoDetalle(p)}
                        >
                          Ver detalle
                        </button>
                        {!soloLectura && (
                          <>
                            <button
                              type="button"
                              className="boton-accion boton-editar me-2"
                              onClick={() => abrirFormulario(p)}
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              className="boton-accion boton-eliminar"
                              onClick={() => eliminar(p)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {productoDetalle && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5">{productoDetalle.nombre}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setProductoDetalle(null)}
                  />
                </div>
                <div className="modal-body">
                  <div className="row g-4 align-items-start">
                    <div className="col-md-5">
                      <img
                        src={productoDetalle.imagen || '/img/proteina.jpg'}
                        alt={productoDetalle.nombre}
                        className="img-fluid rounded"
                      />
                    </div>
                    <div className="col-md-7">
                      <p className="mb-2">
                        <strong>Código:</strong> {productoDetalle.codigo}
                      </p>
                      <p className="mb-2">
                        <strong>Categoría:</strong> {productoDetalle.categoria}
                      </p>
                      <p className="mb-2">
                        <strong>Precio normal:</strong> {formatearPrecio(productoDetalle.precio)}
                      </p>
                      {typeof productoDetalle.precioOferta === 'number' && (
                        <p className="mb-2">
                          <strong>Precio oferta:</strong>{' '}
                          {formatearPrecio(productoDetalle.precioOferta)}
                        </p>
                      )}
                      <p className="mb-2">
                        <strong>Stock:</strong> {productoDetalle.stock} unidades (crítico:{' '}
                        {productoDetalle.stockCritico || 5})
                      </p>
                      <p className="mb-0">
                        <strong>Descripción:</strong>{' '}
                        {productoDetalle.descripcion || 'Sin descripción.'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn boton"
                    onClick={() => setProductoDetalle(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show" />
        </>
      )}
    </>
  );
}
