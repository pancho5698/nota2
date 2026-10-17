import { useState } from 'react';
import Producto from './Producto';

export default function ListaProductos({ productos, onAgregar }) {
  const [mensaje, setMensaje] = useState('');

  function agregar(producto) {
    onAgregar(producto);
    setMensaje(`${producto.nombre} se agregó al carrito.`);
  }

  if (productos.length === 0) {
    return <p>No hay productos disponibles.</p>;
  }

  return (
    <>
      {mensaje && (
        <div className="alert alert-success py-2" role="status">
          {mensaje}
        </div>
      )}
      <div className="row g-4">
        {productos.map((producto) => (
          <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={producto.id}>
            <Producto producto={producto} onAgregar={agregar} />
          </div>
        ))}
      </div>
    </>
  );
}