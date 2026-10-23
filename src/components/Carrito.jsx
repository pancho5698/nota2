import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato';
import { calcularTotal, contarItems } from '../utils/carrito';

export default function Carrito({ carrito, onCambiarCantidad, onQuitar, onVaciar }) {
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
          <button type="button" className="btn boton btn-sm" onClick={onVaciar}>
            Vaciar carrito
          </button>
        </div>

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
                        disabled={item.cantidad <= 1}
                        onClick={() => onCambiarCantidad(item.id, item.cantidad - 1)}
                      >
                        −
                      </button>
                      <span aria-live="polite">{item.cantidad}</span>
                      <button
                        type="button"
                        className="btn boton btn-sm"
                        aria-label={`Aumentar cantidad de ${item.nombre}`}
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
            <p className="h4 mb-0">Total: {formatearPrecio(calcularTotal(carrito))}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
