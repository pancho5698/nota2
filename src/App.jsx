import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cabecera from './components/Cabecera';
import Inicio from './components/Inicio';
import Productos from './components/Productos';
import DetalleProducto from './components/DetalleProducto';
import Nosotros from './components/Nosotros';
import Blogs from './components/Blogs';
import DetalleBlog from './components/DetalleBlog';
import Contacto from './components/Contacto';
import Carrito from './components/Carrito';
import Login from './components/Login';
import Registro from './components/Registro';
import PiePagina from './components/PiePagina';
import productosIniciales from './data/productos.json';
import { guardarDatos, leerDatos } from './utils/almacenamiento';
import { agregarItem, cambiarCantidad, contarItems, quitarItem } from './utils/carrito';
import { autenticarUsuario } from './utils/usuarios';
import './App.css';

export default function App() {
  const [productos] = useState(() => leerDatos('productos', productosIniciales));
  const [carrito, setCarrito] = useState(() => leerDatos('carrito', []));
  const [sesion, setSesion] = useState(() => leerDatos('sesion', null));

  useEffect(() => {
    guardarDatos('carrito', carrito);
  }, [carrito]);

  useEffect(() => {
    guardarDatos('sesion', sesion);
  }, [sesion]);

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito((actual) => agregarItem(actual, producto, cantidad));
  }

  function cambiarCantidadCarrito(id, cantidad) {
    setCarrito((actual) => cambiarCantidad(actual, id, cantidad));
  }

  function quitarDelCarrito(id) {
    setCarrito((actual) => quitarItem(actual, id));
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  // Devuelve true si las credenciales son correctas.
  function iniciarSesion(datos) {
    const usuario = autenticarUsuario(datos);
    if (!usuario) return false;
    setSesion(usuario);
    return true;
  }

  function cerrarSesion() {
    setSesion(null);
  }

  return (
    <>
      <Cabecera
        cantidadCarrito={contarItems(carrito)}
        usuario={sesion}
        onCerrarSesion={cerrarSesion}
      />
      <main id="contenido" className="contenido">
        <Routes>
          <Route
            path="/"
            element={<Inicio productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/productos"
            element={<Productos productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route
            path="/productos/:id"
            element={<DetalleProducto productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route
            path="/carrito"
            element={
              sesion ? (
                <Carrito
                  carrito={carrito}
                  onCambiarCantidad={cambiarCantidadCarrito}
                  onQuitar={quitarDelCarrito}
                  onVaciar={vaciarCarrito}
                />
              ) : (
                <Navigate
                  to="/login"
                  replace
                  state={{ desde: '/carrito', requiereSesion: true }}
                />
              )
            }
          />
          <Route path="/login" element={<Login onIniciar={iniciarSesion} />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}
