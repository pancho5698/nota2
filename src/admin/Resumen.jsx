import { esStockCritico } from '../utils/formato';

export default function Resumen({ productos, usuarios }) {
  const criticos = productos.filter(esStockCritico);
  const enOferta = productos.filter((p) => typeof p.precioOferta === 'number').length;

  const metricas = [
    { id: 'total-productos', titulo: 'Productos', valor: productos.length },
    { id: 'stock-critico', titulo: 'Stock crítico', valor: criticos.length, alerta: true },
    { id: 'en-oferta', titulo: 'En oferta', valor: enOferta },
    { id: 'total-usuarios', titulo: 'Usuarios registrados', valor: usuarios.length },
  ];

  return (
    <>
      <div className="row g-4">
        {metricas.map((m) => (
          <div className="col-sm-6 col-lg-3" key={m.id}>
            <div className={`tarjeta-metrica ${m.alerta ? 'alerta' : ''}`}>
              <h2>{m.titulo}</h2>
              <p id={m.id}>{m.valor}</p>
            </div>
          </div>
        ))}
      </div>

      {criticos.length > 0 && (
        <section className="tarjeta mt-4">
          <h2 className="h5">Productos con stock crítico</h2>
          <ul className="list-group list-group-flush">
            {criticos.map((p) => (
              <li className="list-group-item d-flex justify-content-between" key={p.id}>
                {p.nombre}
                <span className="estado-critico">{p.stock} unid.</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
