import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import Logo from './Logo';

const enlaces = [
  { ruta: '/', texto: 'Inicio' },
  { ruta: '/productos', texto: 'Productos' },
  { ruta: '/nosotros', texto: 'Nosotros' },
  { ruta: '/blogs', texto: 'Blogs' },
  { ruta: '/contacto', texto: 'Contacto' },
];

export default function Cabecera({ cantidadCarrito = 0, usuario = null, onCerrarSesion }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="cabecera">
      <nav className="navbar navbar-expand-lg" aria-label="Navegación principal">
        <div className="container">
          <Link to="/" className="navbar-brand" onClick={() => setAbierto(false)}>
            <Logo />
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            aria-controls="menu-principal"
            aria-expanded={abierto}
            aria-label="Abrir menú"
            onClick={() => setAbierto(!abierto)}
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div
            id="menu-principal"
            className={`collapse navbar-collapse ${abierto ? 'show' : ''}`}
          >
            <ul className="navbar-nav menu-principal mx-lg-auto">
              {enlaces.map((enlace) => (
                <li className="nav-item" key={enlace.ruta}>
                  <NavLink
                    to={enlace.ruta}
                    end={enlace.ruta === '/'}
                    className="nav-link"
                    onClick={() => setAbierto(false)}
                  >
                    {enlace.texto}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div className="acciones-cabecera">
              {usuario ? (
                <>
                  <span className="enlace-cuenta">Hola, {usuario.nombre}</span>
                  {usuario.rol === 'admin' && (
                    <Link to="/admin" className="enlace-cuenta" onClick={() => setAbierto(false)}>
                      Admin
                    </Link>
                  )}
                  <button
                    type="button"
                    className="enlace-cuenta btn btn-link p-0 border-0"
                    onClick={() => {
                      onCerrarSesion();
                      setAbierto(false);
                    }}
                  >
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="enlace-cuenta"
                    onClick={() => setAbierto(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    to="/registro"
                    className="enlace-cuenta"
                    onClick={() => setAbierto(false)}
                  >
                    Registrarse
                  </Link>
                </>
              )}
              <Link
                to="/carrito"
                className="enlace-carrito"
                onClick={() => setAbierto(false)}
              >
                Carrito (<span id="contador-carrito">{cantidadCarrito}</span>)
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
