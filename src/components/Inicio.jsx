import { Link } from 'react-router-dom';
import ListaProductos from './ListaProductos';

const beneficios = [
  'Proteínas y aminoácidos',
  'Equipamiento y ropa deportiva',
  'Vitaminas',
];

export default function Inicio({ productos, onAgregar }) {
  const masVendidos = productos.slice(0, 4);

  return (
    <>
      <section className="portada">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-6">
              <h1>Suplementos deportivos, ¡supera tus límites!</h1>
              <p className="portada-descripcion">
                Proteínas, equipamiento y ropa deportiva para llevar tus entrenamientos al
                siguiente nivel.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/productos" className="btn boton boton-primario btn-lg">
                  Ver productos
                </Link>
                <Link to="/nosotros" className="btn boton btn-lg">
                  Conócenos
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="/img/deportista-equipamiento.jpeg"
                alt="Deportista entrenando con equipamiento FitLab"
                className="portada-imagen"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="beneficios">
        <div className="container">
          <div className="row g-3">
            {beneficios.map((beneficio) => (
              <div className="col-md-4" key={beneficio}>
                {beneficio}
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="seccion">
        <div className="container">
          <div className="titulo-seccion">
            <h2>Más vendidos</h2>
            <Link to="/productos" className="enlace-texto">
              Ver todo el catálogo
            </Link>
          </div>
          <ListaProductos productos={masVendidos} onAgregar={onAgregar} />
        </div>
      </section>
    </>
  );
}