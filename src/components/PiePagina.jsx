import { Link } from 'react-router-dom';
import Logo from './Logo';

const anioActual = new Date().getFullYear();

export default function PiePagina() {
  return (
    <footer className="pie-pagina">
      <div className="container">
        <div className="row g-4">
          <div className="col-md-6">
            <Logo />
            <p className="mt-3">
              Suplementos, equipamiento y ropa deportiva
              <br />
              para entrenar mejor cada día.
            </p>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6">Tienda</h2>
            <Link to="/productos">Productos</Link>
            <Link to="/carrito">Carrito</Link>
            <Link to="/registro">Registrarse</Link>
          </div>
          <div className="col-6 col-md-3">
            <h2 className="h6">FitLab</h2>
            <Link to="/nosotros">Nosotros</Link>
            <Link to="/blogs">Blogs</Link>
            <Link to="/contacto">Contacto</Link>
          </div>
        </div>
        <div className="pie-inferior">
          <span>© {anioActual} FitLab. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}