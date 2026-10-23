import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato';

export default function DetalleProducto({ productos, onAgregar }) {
  const { id } = useParams();
  const producto = productos.find((item) => String(item.id) === id);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState('');

  if (!producto) {
    return (
      <section className="seccion">
        <div className="container text-center">
          <h1 className="h2">Producto no encontrado</h1>
          <p>El producto que buscas no existe o ya no está disponible.</p>
          <Link to="/productos" className="btn boton boton-primario">
            Volver a productos
          </Link>
        </div>
      </section>
    );
  }

  const { nombre, codigo, categoria, precio, precioOferta, stock, stockCritico, imagen, descripcion } =
    producto;
  const sinStock = stock <= 0;
  const stockBajo = !sinStock && stock <= stockCritico;
  const enOferta = typeof precioOferta === 'number' && precioOferta < precio;
  const descuento = enOferta ? Math.round((1 - precioOferta / precio) * 100) : 0;

  function agregar() {
    onAgregar(producto, cantidad);
    setMensaje(`${cantidad} x ${nombre} se agregó al carrito.`);
  }

  return (
    <section className="seccion">
      <div className="container">
        <Link to="/productos" className="enlace-texto">
          ← Volver a productos
        </Link>

        <div className="row g-5 mt-1">
          <div className="col-md-6">
            <img src={imagen} alt={nombre} className="img-fluid rounded" />
          </div>

          <div className="col-md-6">
            <p className="producto-categoria">{categoria}</p>
            <h1 className="h2">{nombre}</h1>
            <p className="small">Código: {codigo}</p>

            {enOferta && (
              <span className="badge text-bg-danger mb-2">Oferta -{descuento}%</span>
            )}
            {enOferta ? (
              <p className="producto-precio">
                <span className="text-decoration-line-through text-secondary me-2 fs-6">
                  {formatearPrecio(precio)}
                </span>
                <span>{formatearPrecio(precioOferta)}</span>
              </p>
            ) : (
              <p className="producto-precio">{formatearPrecio(precio)}</p>
            )}

            <p>{descripcion}</p>
            <p className="producto-stock">{sinStock ? 'Sin stock' : `Stock: ${stock}`}</p>
            {stockBajo && <p className="text-warning">¡Quedan pocas unidades!</p>}

            {mensaje && (
              <div className="alert alert-success py-2" role="status">
                {mensaje}
              </div>
            )}

            <div className="d-flex align-items-center gap-2 mb-3">
              <button
                type="button"
                className="btn boton btn-sm"
                aria-label="Disminuir cantidad"
                disabled={sinStock || cantidad <= 1}
                onClick={() => setCantidad(cantidad - 1)}
              >
                −
              </button>
              <span aria-live="polite">{cantidad}</span>
              <button
                type="button"
                className="btn boton btn-sm"
                aria-label="Aumentar cantidad"
                disabled={sinStock || cantidad >= stock}
                onClick={() => setCantidad(cantidad + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className="btn boton boton-primario"
              disabled={sinStock}
              onClick={agregar}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
