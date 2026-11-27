import { useState } from 'react';
import { formatearFecha, formatearPrecio } from '../utils/formato';
import { obtenerBoletaApi } from '../services/api';

export default function ListaBoletas({ boletas, cargando = false, onRecargar }) {
  const [boletaSeleccionada, setBoletaSeleccionada] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [errorDetalle, setErrorDetalle] = useState('');

  async function verDetalle(boleta) {
    setErrorDetalle('');
    setCargandoDetalle(true);
    setBoletaSeleccionada(boleta);
    try {
      const detalleCompleto = await obtenerBoletaApi(boleta.id);
      setBoletaSeleccionada(detalleCompleto);
    } catch (error) {
      setErrorDetalle(error.message || 'No se pudo cargar el detalle de la compra.');
    } finally {
      setCargandoDetalle(false);
    }
  }

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <h2 className="mb-0">Compras y boletas</h2>
        {onRecargar && (
          <button
            type="button"
            className="btn boton"
            disabled={cargando}
            onClick={onRecargar}
          >
            {cargando ? 'Actualizando...' : 'Actualizar'}
          </button>
        )}
      </div>

      <div className="tarjeta">
        <div className="table-responsive">
          <table className="table tabla-admin align-middle mb-0">
            <thead>
              <tr>
                <th>N° Boleta</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Unidades</th>
                <th>Total</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Cargando compras...
                  </td>
                </tr>
              ) : boletas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Aún no hay compras registradas.
                  </td>
                </tr>
              ) : (
                boletas.map((b) => {
                  const unidades = (b.detalles || []).reduce((acc, d) => acc + d.cantidad, 0);
                  return (
                    <tr key={b.id}>
                      <td className="text-nowrap">
                        <strong>#{b.id}</strong>
                      </td>
                      <td className="text-nowrap">{formatearFecha(b.fecha)}</td>
                      <td>{b.correoCliente}</td>
                      <td>{unidades}</td>
                      <td className="text-nowrap">{formatearPrecio(b.total)}</td>
                      <td className="text-center text-nowrap">
                        <button
                          type="button"
                          className="boton-accion boton-ver"
                          onClick={() => verDetalle(b)}
                        >
                          Ver detalle
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

      {boletaSeleccionada && (
        <>
          <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title h5">Detalle de boleta #{boletaSeleccionada.id}</h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Cerrar"
                    onClick={() => setBoletaSeleccionada(null)}
                  />
                </div>
                <div className="modal-body">
                  {errorDetalle && (
                    <div className="alert alert-danger" role="alert">
                      {errorDetalle}
                    </div>
                  )}
                  <p className="mb-1">
                    <strong>Fecha:</strong> {formatearFecha(boletaSeleccionada.fecha)}
                  </p>
                  <p className="mb-3">
                    <strong>Cliente:</strong> {boletaSeleccionada.correoCliente}
                  </p>

                  {cargandoDetalle ? (
                    <p className="small">Cargando detalle...</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table tabla-admin align-middle mb-0">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Precio unitario</th>
                            <th>Cantidad</th>
                            <th>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(boletaSeleccionada.detalles || []).map((d, idx) => (
                            <tr key={`${d.productoId}-${idx}`}>
                              <td>{d.nombre}</td>
                              <td className="text-nowrap">{formatearPrecio(d.precioUnitario)}</td>
                              <td>{d.cantidad}</td>
                              <td className="text-nowrap">{formatearPrecio(d.subtotal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                <div className="modal-footer justify-content-between">
                  <strong className="fs-5">
                    Total: {formatearPrecio(boletaSeleccionada.total)}
                  </strong>
                  <button
                    type="button"
                    className="btn boton"
                    onClick={() => setBoletaSeleccionada(null)}
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
