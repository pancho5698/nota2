import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Cabecera from './components/Cabecera';
import Inicio from './components/Inicio';
import Nosotros from './components/Nosotros';
import Blogs from './components/Blogs';
import DetalleBlog from './components/DetalleBlog';
import Contacto from './components/Contacto';
import PiePagina from './components/PiePagina';
import productosIniciales from './data/productos.json';
import { guardarDatos, leerDatos } from './utils/almacenamiento';
import { agregarItem, contarItems } from './utils/carrito';
import './App.css';

export default function App() {
  const [productos] = useState(() => leerDatos('productos', productosIniciales));
  const [carrito, setCarrito] = useState(() => leerDatos('carrito', []));

  useEffect(() => {
    guardarDatos('carrito', carrito);
  }, [carrito]);

  function agregarAlCarrito(producto, cantidad = 1) {
    setCarrito((actual) => agregarItem(actual, producto, cantidad));
  }

  return (
    <>
      <Cabecera cantidadCarrito={contarItems(carrito)} />
      <main id="contenido" className="contenido">
        <Routes>
          <Route
            path="/"
            element={<Inicio productos={productos} onAgregar={agregarAlCarrito} />}
          />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:id" element={<DetalleBlog />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}