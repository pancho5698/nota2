import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario';
import { hayErrores, validarRegistro } from '../utils/validaciones';
import { registroApi } from '../services/api';

const formularioVacio = { nombre: '', correo: '', contrasena: '', confirmacion: '' };

export default function Registro() {
  const [datos, setDatos] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setErrorGeneral('');
  }

  async function enviar(e) {
    e.preventDefault();
    const nuevosErrores = validarRegistro(datos);
    setErrores(nuevosErrores);

    if (hayErrores(nuevosErrores)) return;

    setCargando(true);
    setErrorGeneral('');
    try {
      await registroApi({
        nombre: datos.nombre.trim(),
        correo: datos.correo.trim().toLowerCase(),
        contrasena: datos.contrasena,
      });
      navigate('/login', { state: { registrado: true } });
    } catch (error) {
      if (error.message.toLowerCase().includes('correo')) {
        setErrores({ correo: error.message });
      } else {
        setErrorGeneral(error.message);
      }
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="seccion">
      <div className="container formulario-contacto">
        <h1>Registro</h1>
        <p>Crea tu cuenta para comprar en FitLab.</p>

        {errorGeneral && (
          <div className="alert alert-danger" role="alert">
            {errorGeneral}
          </div>
        )}

        <form className="tarjeta" onSubmit={enviar} noValidate>
          <CampoFormulario
            id="nombre"
            etiqueta="Nombre"
            value={datos.nombre}
            error={errores.nombre}
            onChange={cambiar}
            maxLength={100}
            autoComplete="name"
          />
          <CampoFormulario
            id="correo"
            etiqueta="Correo"
            tipo="email"
            placeholder="tucorreo@gmail.com"
            value={datos.correo}
            error={errores.correo}
            onChange={cambiar}
            maxLength={100}
            autoComplete="email"
          />
          <CampoFormulario
            id="contrasena"
            etiqueta="Contraseña"
            tipo="password"
            value={datos.contrasena}
            error={errores.contrasena}
            onChange={cambiar}
            maxLength={20}
            autoComplete="new-password"
          />
          <CampoFormulario
            id="confirmacion"
            etiqueta="Confirmar contraseña"
            tipo="password"
            value={datos.confirmacion}
            error={errores.confirmacion}
            onChange={cambiar}
            maxLength={20}
            autoComplete="new-password"
          />
          <button type="submit" className="btn boton boton-primario" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-3">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="enlace-texto">
            Inicia sesión
          </Link>
        </p>
      </div>
    </section>
  );
}
