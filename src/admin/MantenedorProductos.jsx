import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario';
import { esStockCritico, formatearPrecio } from '../utils/formato';
import { hayErrores, validarProducto } from '../utils/validaciones';

const categorias = ['Proteínas & Aminoácidos', 'Equipamiento', 'Ropa Deportiva', 'Vitaminas'];

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

export default function MantenedorProductos({ productos, onGuardar, onEliminar }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [datos, setDatos] = useState(formularioVacio);
  const [idEditando, setIdEditando] = useState(null);
  const [errores, setErrores] = useState({});

  const hayCritico = productos.some(esStockCritico);

  function abrirFormulario(producto) {
    setDatos(
      producto
        ? { ...formularioVacio, ...producto, precioOferta: producto.precioOferta ?? '' }
        : formularioVacio,
    );
    setIdEditando(producto ? producto.id : null);
    setErrores({});
    setMostrarFormulario(true);
  }

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
  }

  function eliminar(producto) {
    if (window.confirm(`¿Eliminar "${producto.nombre}"?`)) {
      onEliminar(producto.id);
    }
  }

  function guardar(e) {
    e.preventDefault();
    const nuevosErrores = validarProducto(datos);
    setErrores(nuevosErrores);
    if (hayErrores(nuevosErrores)) return;

    const original = productos.find((p) => p.id === idEditando);
    const producto = {
      id: idEditando ?? Date.now(),
      codigo: datos.codigo.trim(),
      nombre: datos.nombre.trim(),
      categoria: datos.categoria,
      precio: Number(datos.precio),
      stock: Number(datos.stock),
      stockCritico: Number(datos.stockCritico) || 5,
      imagen: original ? original.imagen : '/img/proteina.jpg',
      descripcion: datos.descripcion.trim(),
    };
    if (datos.precioOferta !== '') producto.precioOferta = Number(datos.precioOferta);

    onGuardar(producto);
    setMostrarFormulario(false);
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">Gestión de productos</h2>
        <button
          type="button"
          className="btn boton boton-primario"
          onClick={() => abrirFormulario(null)}
        >
          + Agregar producto
        </button>
      </div>

      {hayCritico && (
        <div className="alerta-stock" role="alert">
          <strong>Alerta de inventario:</strong> hay productos con stock igual o menor al
          crítico.
        </div>
      )}

      {mostrarFormulario && (
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
                {categorias.map((c) => (
                  <option key={c}>{c}</option>
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
            <button type="submit" className="btn boton boton-primario">
              Guardar producto
            </button>
            <button
              type="button"
              className="btn boton"
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
              {productos.map((p) => {
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
