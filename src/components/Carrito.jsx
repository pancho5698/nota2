import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatearFecha, formatearPrecio } from '../utils/formato';
import { calcularTotal, contarItems } from '../utils/carrito';

export default function Carrito({ carrito, onCambiarCantidad, onQuitar, onVaciar, onComprar }) {
  const [comprando, setComprando] = useState(false);
  const [errorCompra, setErrorCompra] = useState('');
  const [boletaConfirmada, setBoletaConfirmada] = useState(null);

  async function manejarCompra() {
    if (!onComprar || carrito.length === 0) return;
    setComprando(true);
    setErrorCompra('');
    try {
      const boleta = await onComprar();
      setBoletaConfirmada(boleta);
    } catch (error) {
      setErrorCompra(error.message || 'No se pudo completar la compra.');
    } finally {
      setComprando(false);
    }
  }

  if (boletaConfirmada) {
    return (
      <section className="seccion">
        <div className="container">
          <div className="tarjeta">
            <div className="alert alert-success" role="status">
              ¡Compra realizada con éxito! Se generó la boleta <strong>#{boletaConfirmada.id}</strong>.
            </div>
            <h1 className="h3 mb-3">Comprobante de compra</h1>
            <p className="mb-1">
              <strong>N° Boleta:</strong> #{boletaConfirmada.id}
            </p>
            <p className="mb-1">
              <strong>Fecha:</strong> {formatearFecha(boletaConfirmada.fecha)}
            </p>
            <p className="mb-3">
              <strong>Cliente:</strong> {boletaConfirmada.correoCliente}
            </p>

            <div className="table-responsive mb-3">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th scope="col">Producto</th>
                    <th scope="col">Precio unitario</th>
                    <th scope="col">Cantidad</th>
                    <th scope="col">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(boletaConfirmada.detalles || []).map((detalle, indice) => (
                    <tr key={`${detalle.productoId}-${indice}`}>
                      <td>{detalle.nombre}</td>
                      <td>{formatearPrecio(detalle.precioUnitario)}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{formatearPrecio(detalle.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
              <p className="h4 mb-0">Total pagado: {formatearPrecio(boletaConfirmada.total)}</p>
              <Link to="/productos" className="btn boton boton-primario">
                Seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (carrito.length === 0) {
    return (
      <section className="seccion">
        <div className="container text-center">
          <h1 className="h2">Tu carrito está vacío</h1>
          <p>Agrega productos desde el inicio para verlos aquí.</p>
          <Link to="/" className="btn boton boton-primario">
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion">
      <div className="container">
        <div className="titulo-seccion">
          <h1 className="h2">Carrito de compras</h1>
          <button
            type="button"
            className="btn boton btn-sm"
            disabled={comprando}
            onClick={onVaciar}
          >
            Vaciar carrito
          </button>
        </div>

        {errorCompra && (
          <div className="alert alert-danger" role="alert">
            {errorCompra}
          </div>
        )}

        <div className="table-responsive">
          <table className="table align-middle">
            <thead>
              <tr>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Subtotal</th>
                <th scope="col">
                  <span className="visually-hidden">Quitar</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <img
                        src={item.imagen}
                        alt={item.nombre}
                        width="64"
                        height="64"
                        className="rounded object-fit-cover"
                      />
                      <span>{item.nombre}</span>
                    </div>
                  </td>
                  <td>{formatearPrecio(item.precio)}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <button
                        type="button"
                        className="btn boton btn-sm"
                        aria-label={`Disminuir cantidad de ${item.nombre}`}
                        disabled={comprando || item.cantidad <= 1}
                        onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.cantidad}</span>
                      <button
                        type="button"
                        className="btn boton btn-sm"
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
                        disabled={comprando}
                        onClick={() => onCambiarCantidad(item.id, item.cantidad + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatearPrecio(item.precio * item.cantidad)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn boton btn-sm"
                      disabled={comprando}
                      onClick={() => onQuitar(item.id)}
                    >
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mt-3">
          <Link to="/" className="enlace-texto">
            Seguir comprando
          </Link>
          <div className="text-end">
            <p className="mb-1">Productos: {contarItems(carrito)}</p>
            <p className="h4 mb-3">Total: {formatearPrecio(calcularTotal(carrito))}</p>
            <button
              type="button"
              className="btn boton boton-primario"
              disabled={comprando}
              onClick={manejarCompra}
            >
              {comprando ? 'Procesando compra...' : 'Finalizar compra'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
