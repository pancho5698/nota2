import { Link } from 'react-router-dom';
import { formatearPrecio } from '../utils/formato';
import './Producto.css';

export default function Producto({ producto, onAgregar }) {
  const { id, nombre, categoria, precio, stock, imagen } = producto;
  const sinStock = stock <= 0;

  return (
    <article className="card tarjeta-producto">
      <img src={imagen} alt={nombre} className="producto-imagen" />
      <div className="card-body d-flex flex-column">
        <p className="producto-categoria">{categoria}</p>
        <h3 className="card-title h5">{nombre}</h3>
        <p className="producto-precio">{formatearPrecio(precio)}</p>
        <p className="producto-stock">{sinStock ? 'Sin stock' : `Stock: ${stock}`}</p>
        <div className="d-grid gap-2 mt-auto">
          <Link to={`/productos/${id}`} className="btn boton">
            Ver detalle
          </Link>
          <button
            type="button"
            className="btn boton boton-primario"
            disabled={sinStock}
            onClick={() => onAgregar(producto)}
          >
            Agregar al carrito
          </button>
        </div>
      </div>
    </article>
  );
}
