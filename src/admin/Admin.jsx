import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Resumen from './Resumen';
import MantenedorProductos from './MantenedorProductos';
import MantenedorUsuarios from './MantenedorUsuarios';
import ListaBoletas from './ListaBoletas';
import { normalizarRol } from '../utils/formato';
import {
  actualizarUsuarioApi,
  crearUsuarioApi,
  eliminarUsuarioApi,
  obtenerBoletasApi,
  obtenerUsuariosApi,
} from '../services/api';
import './Admin.css';

const vistasAdmin = [
  { id: 'resumen', texto: 'Resumen' },
  { id: 'productos', texto: 'Productos' },
  { id: 'compras', texto: 'Compras' },
  { id: 'usuarios', texto: 'Usuarios' },
];

const vistasVendedor = [
  { id: 'productos', texto: 'Productos' },
  { id: 'compras', texto: 'Compras' },
];

export default function Admin({
  usuario,
  productos,
  categorias = [],
  onGuardarProducto,
  onEliminarProducto,
  onSesionExpirada,
}) {
  const rol = normalizarRol(usuario?.rol);
  const esAdmin = rol === 'ADMIN';
  const esVendedor = rol === 'VENDEDOR';
  const tieneAcceso = esAdmin || esVendedor;

  const vistas = esAdmin ? vistasAdmin : vistasVendedor;
  const [vista, setVista] = useState(esAdmin ? 'resumen' : 'productos');
  const [usuarios, setUsuarios] = useState([]);
  const [boletas, setBoletas] = useState([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [cargandoBoletas, setCargandoBoletas] = useState(false);
  const [errorPanel, setErrorPanel] = useState('');

  const vistaActiva = vistas.some((v) => v.id === vista) ? vista : vistas[0].id;

  const cargarUsuarios = useCallback(async () => {
    if (!esAdmin) return;
    setCargandoUsuarios(true);
    try {
      const lista = await obtenerUsuariosApi();
      setUsuarios(Array.isArray(lista) ? lista : []);
    } catch (error) {
      if (error.status === 401) {
        onSesionExpirada?.();
      } else {
        setErrorPanel(error.message);
      }
    } finally {
      setCargandoUsuarios(false);
    }
  }, [esAdmin, onSesionExpirada]);

  const cargarBoletas = useCallback(async () => {
    if (!tieneAcceso) return;
    setCargandoBoletas(true);
    try {
      const lista = await obtenerBoletasApi();
      setBoletas(Array.isArray(lista) ? lista : []);
    } catch (error) {
      if (error.status === 401) {
        onSesionExpirada?.();
      } else {
        setErrorPanel(error.message);
      }
    } finally {
      setCargandoBoletas(false);
    }
  }, [tieneAcceso, onSesionExpirada]);

  useEffect(() => {
    if (!tieneAcceso) return;
    setErrorPanel('');
    cargarBoletas();
    if (esAdmin) {
      cargarUsuarios();
    } else {
      setUsuarios([]);
    }
  }, [tieneAcceso, esAdmin, cargarBoletas, cargarUsuarios]);

  async function guardarUsuario(datos, idEditando = null) {
    const guardado = idEditando
      ? await actualizarUsuarioApi(idEditando, datos)
      : await crearUsuarioApi(datos);

    setUsuarios((lista) =>
      lista.some((u) => u.id === guardado.id)
        ? lista.map((u) => (u.id === guardado.id ? guardado : u))
        : [...lista, guardado],
    );
    return guardado;
  }

  async function eliminarUsuario(id) {
    await eliminarUsuarioApi(id);
    setUsuarios((lista) => lista.filter((u) => u.id !== id));
  }

  if (!tieneAcceso) {
    return (
      <section className="seccion">
        <div className="container formulario-contacto">
          <h1>Acceso restringido</h1>
          <p>
            {usuario
              ? 'Esta sección es solo para administradores y vendedores de FitLab.'
              : 'Inicia sesión con una cuenta autorizada para acceder a este panel.'}
          </p>
          {usuario ? (
            <Link to="/" className="btn boton boton-primario">
              Volver a la tienda
            </Link>
          ) : (
            <Link to="/login" state={{ desde: '/admin' }} className="btn boton boton-primario">
              Iniciar sesión
            </Link>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="seccion">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <h1 className="mb-0">
            {esAdmin ? 'Panel de administración' : 'Panel de vendedor'}
          </h1>
          <nav className="nav nav-pills menu-admin" aria-label="Secciones del panel">
            {vistas.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`nav-link ${vistaActiva === v.id ? 'active' : ''}`}
                onClick={() => setVista(v.id)}
              >
                {v.texto}
              </button>
            ))}
          </nav>
        </div>

        {errorPanel && (
          <div className="alert alert-danger" role="alert">
            {errorPanel}
          </div>
        )}

        {esAdmin && vistaActiva === 'resumen' && (
          <Resumen productos={productos} usuarios={usuarios} boletas={boletas} />
        )}

        {vistaActiva === 'productos' && (
          <MantenedorProductos
            productos={productos}
            categoriasDisponibles={categorias}
            soloLectura={esVendedor}
            onGuardar={onGuardarProducto}
            onEliminar={onEliminarProducto}
          />
        )}

        {vistaActiva === 'compras' && (
          <ListaBoletas
            boletas={boletas}
            cargando={cargandoBoletas}
            onRecargar={cargarBoletas}
          />
        )}

        {esAdmin && vistaActiva === 'usuarios' && (
          <MantenedorUsuarios
            usuarios={usuarios}
            cargando={cargandoUsuarios}
            onGuardar={guardarUsuario}
            onEliminar={eliminarUsuario}
          />
        )}
      </div>
    </section>
  );
}
