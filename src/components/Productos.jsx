import { useState } from 'react';
import ListaProductos from './ListaProductos';

export default function Productos({ productos, onAgregar }) {
  const [categoria, setCategoria] = useState('Todas');
  const [busqueda, setBusqueda] = useState('');
  const [soloOfertas, setSoloOfertas] = useState(false);

  const categorias = ['Todas', ...new Set(productos.map((producto) => producto.categoria))];
  const texto = busqueda.trim().toLowerCase();

  const filtrados = productos.filter((producto) => {
    const coincideCategoria = categoria === 'Todas' || producto.categoria === categoria;
    const coincideNombre = producto.nombre.toLowerCase().includes(texto);
    const enOferta =
      typeof producto.precioOferta === 'number' && producto.precioOferta < producto.precio;
    return coincideCategoria && coincideNombre && (!soloOfertas || enOferta);
  });

  return (
    <section className="seccion">
      <div className="container">
        <div className="titulo-seccion">
          <h1 className="h2">Productos</h1>
        </div>

        <div className="row g-3 align-items-end mb-4">
          <div className="col-md-5">
            <label htmlFor="busqueda" className="form-label">
              Buscar
            </label>
            <input
              id="busqueda"
              type="search"
              className="form-control"
              placeholder="Nombre del producto"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <label htmlFor="categoria" className="form-label">
              Categoría
            </label>
            <select
              id="categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              {categorias.map((nombre) => (
                <option key={nombre} value={nombre}>
                  {nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <div className="form-check">
              <input
                id="solo-ofertas"
                type="checkbox"
                className="form-check-input"
                checked={soloOfertas}
                onChange={(e) => setSoloOfertas(e.target.checked)}
              />
              <label htmlFor="solo-ofertas" className="form-check-label">
                Solo ofertas
              </label>
            </div>
          </div>
        </div>

        <p className="small">
          {filtrados.length} {filtrados.length === 1 ? 'producto' : 'productos'}
        </p>
        <ListaProductos productos={filtrados} onAgregar={onAgregar} />
      </div>
    </section>
  );
}
