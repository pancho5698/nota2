import { useCallback, useEffect, useState } from 'react';
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
import Admin from './admin/Admin';
import { guardarDatos, leerDatos } from './utils/almacenamiento';
import { agregarItem, cambiarCantidad, contarItems, quitarItem } from './utils/carrito';
import { normalizarRol } from './utils/formato';
import {
  actualizarProductoApi,
  crearBoletaApi,
  crearProductoApi,
  eliminarProductoApi,
  guardarToken,
  limpiarToken,
  loginApi,
  obtenerCategoriasApi,
  obtenerProductosApi,
  obtenerToken,
  renovarSesionApi,
} from './services/api';
import './App.css';

export default function App() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargandoProductos, setCargandoProductos] = useState(true);
  const [errorProductos, setErrorProductos] = useState('');
  const [carrito, setCarrito] = useState(() => leerDatos('carrito', []));
  const [sesion, setSesion] = useState(() => (obtenerToken() ? leerDatos('sesion', null) : null));

  const cargarProductos = useCallback(async () => {
    setCargandoProductos(true);
    setErrorProductos('');
    try {
      const lista = await obtenerProductosApi();
      setProductos(Array.isArray(lista) ? lista : []);
    } catch (error) {
      setErrorProductos(error.message);
    } finally {
      setCargandoProductos(false);
    }
  }, []);

  const cargarCategorias = useCallback(async () => {
    try {
      const lista = await obtenerCategoriasApi();
      setCategorias(Array.isArray(lista) ? lista : []);
    } catch {
      // Si no hay categorías en backend, el formulario usa las categorías por defecto.
    }
  }, []);

  // Carga el catálogo desde el backend al iniciar.
  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, [cargarProductos, cargarCategorias]);

  // Mantiene y renueva la sesión al recargar la página usando el token JWT guardado.
  useEffect(() => {
    const token = obtenerToken();
    if (!token) return;

    let cancelado = false;
    renovarSesionApi()
      .then((respuesta) => {
        if (cancelado) return;
        guardarToken(respuesta.token);
        setSesion(respuesta.usuario);
        guardarDatos('sesion', respuesta.usuario);
      })
      .catch((error) => {
        if (cancelado) return;
        if (error.status === 401) {
          limpiarToken();
          localStorage.removeItem('sesion');
          setSesion(null);
        }
      });

    return () => {
      cancelado = true;
    };
  }, []);

  useEffect(() => {
    guardarDatos('carrito', carrito);
  }, [carrito]);

  useEffect(() => {
    if (sesion) {
      guardarDatos('sesion', sesion);
    } else {
      localStorage.removeItem('sesion');
    }
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

  async function guardarProducto(producto, idEditando = null) {
    const guardado = idEditando
      ? await actualizarProductoApi(idEditando, producto)
      : await crearProductoApi(producto);

    setProductos((lista) =>
      lista.some((p) => p.id === guardado.id)
        ? lista.map((p) => (p.id === guardado.id ? guardado : p))
        : [...lista, guardado],
    );
    return guardado;
  }

  async function eliminarProducto(id) {
    await eliminarProductoApi(id);
    setProductos((lista) => lista.filter((p) => p.id !== id));
  }

  async function iniciarSesion(datos) {
    try {
      const respuesta = await loginApi({
        correo: datos.correo.trim().toLowerCase(),
        contrasena: datos.contrasena,
      });
      guardarToken(respuesta.token);
      setSesion(respuesta.usuario);
      guardarDatos('sesion', respuesta.usuario);
      return { ok: true, usuario: respuesta.usuario };
    } catch (error) {
      return { ok: false, mensaje: error.message };
    }
  }

  function cerrarSesion() {
    limpiarToken();
    localStorage.removeItem('sesion');
    setSesion(null);
  }

  async function finalizarCompra() {
    const items = carrito.map((item) => ({
      productoId: item.id,
      cantidad: item.cantidad,
    }));
    const boleta = await crearBoletaApi(items);
    setCarrito([]);
    await cargarProductos();
    return boleta;
  }

  const esVendedor = normalizarRol(sesion?.rol) === 'VENDEDOR';

  return (
    <>
      <Cabecera
        cantidadCarrito={contarItems(carrito)}
        usuario={sesion}
        onCerrarSesion={cerrarSesion}
      />
      <main id="contenido" className="contenido">
        {errorProductos && (
          <div className="container pt-3">
            <div className="alert alert-warning d-flex justify-content-between align-items-center mb-0" role="alert">
              <span>{errorProductos}</span>
              <button
                type="button"
                className="btn boton btn-sm"
                onClick={cargarProductos}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
        <Routes>
          <Route
            path="/"
            element={
              esVendedor ? (
                <Navigate to="/admin" replace />
              ) : (
                <Inicio productos={productos} onAgregar={agregarAlCarrito} />
              )
            }
          />
          <Route
            path="/productos"
            element={
              esVendedor ? (
                <Navigate to="/admin" replace />
              ) : (
                <Productos
                  productos={productos}
                  cargando={cargandoProductos}
                  onAgregar={agregarAlCarrito}
                />
              )
            }
          />
          <Route
            path="/productos/:id"
            element={
              esVendedor ? (
                <Navigate to="/admin" replace />
              ) : (
                <DetalleProducto productos={productos} onAgregar={agregarAlCarrito} />
              )
            }
          />
          <Route path="/nosotros" element={esVendedor ? <Navigate to="/admin" replace /> : <Nosotros />} />
          <Route path="/blogs" element={esVendedor ? <Navigate to="/admin" replace /> : <Blogs />} />
          <Route path="/blogs/:id" element={esVendedor ? <Navigate to="/admin" replace /> : <DetalleBlog />} />
          <Route path="/contacto" element={esVendedor ? <Navigate to="/admin" replace /> : <Contacto />} />
          <Route
            path="/carrito"
            element={
              esVendedor ? (
                <Navigate to="/admin" replace />
              ) : sesion ? (
                <Carrito
                  carrito={carrito}
                  onCambiarCantidad={cambiarCantidadCarrito}
                  onQuitar={quitarDelCarrito}
                  onVaciar={vaciarCarrito}
                  onComprar={finalizarCompra}
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
          <Route
            path="/admin"
            element={
              <Admin
                usuario={sesion}
                productos={productos}
                categorias={categorias}
                onGuardarProducto={guardarProducto}
                onEliminarProducto={eliminarProducto}
                onRecargarProductos={cargarProductos}
                onSesionExpirada={cerrarSesion}
              />
            }
          />
          <Route path="*" element={<Navigate to={esVendedor ? '/admin' : '/'} replace />} />
        </Routes>
      </main>
      <PiePagina />
    </>
  );
}
