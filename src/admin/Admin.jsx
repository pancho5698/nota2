import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Resumen from './Resumen';
import MantenedorProductos from './MantenedorProductos';
import MantenedorUsuarios from './MantenedorUsuarios';
import { guardarDatos, leerDatos } from '../utils/almacenamiento';
import './Admin.css';

const vistas = [
  { id: 'resumen', texto: 'Resumen' },
  { id: 'productos', texto: 'Productos' },
  { id: 'usuarios', texto: 'Usuarios' },
];

export default function Admin({ usuario, productos, onGuardarProducto, onEliminarProducto }) {
  const [vista, setVista] = useState('resumen');
  const [usuarios, setUsuarios] = useState(() => leerDatos('usuarios', []));

  useEffect(() => {
    guardarDatos('usuarios', usuarios);
  }, [usuarios]);

  function guardarUsuario(datos) {
    setUsuarios((lista) =>
      lista.some((u) => u.id === datos.id)
        ? lista.map((u) => (u.id === datos.id ? datos : u))
        : [...lista, datos],
    );
  }

  function eliminarUsuario(id) {
    setUsuarios((lista) => lista.filter((u) => u.id !== id));
  }

  if (usuario?.rol !== 'admin') {
    return (
      <section className="seccion">
        <div className="container formulario-contacto">
          <h1>Acceso restringido</h1>
          <p>Esta sección es solo para administradores de FitLab.</p>
          <Link to="/login" state={{ desde: '/admin' }} className="btn boton boton-primario">
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion">
      <div className="container">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
          <h1 className="mb-0">Panel de administración</h1>
          <nav className="nav nav-pills menu-admin" aria-label="Secciones del admin">
            {vistas.map((v) => (
              <button
                key={v.id}
                type="button"
                className={`nav-link ${vista === v.id ? 'active' : ''}`}
                onClick={() => setVista(v.id)}
              >
                {v.texto}
              </button>
            ))}
          </nav>
        </div>

        {vista === 'resumen' && <Resumen productos={productos} usuarios={usuarios} />}

        {vista === 'productos' && (
          <MantenedorProductos
            productos={productos}
            onGuardar={onGuardarProducto}
            onEliminar={onEliminarProducto}
          />
        )}

        {vista === 'usuarios' && (
          <MantenedorUsuarios
            usuarios={usuarios}
            onGuardar={guardarUsuario}
            onEliminar={eliminarUsuario}
          />
        )}
      </div>
    </section>
  );
}
