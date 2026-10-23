import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import CampoFormulario from './CampoFormulario';
import { hayErrores, validarLogin } from '../utils/validaciones';

const formularioVacio = { correo: '', contrasena: '' };

export default function Login({ onIniciar }) {
  const [datos, setDatos] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setErrorGeneral('');
  }

  function enviar(e) {
    e.preventDefault();
    const nuevosErrores = validarLogin(datos);
    setErrores(nuevosErrores);

    if (hayErrores(nuevosErrores)) return;

    if (onIniciar(datos)) {
      navigate(location.state?.desde ?? '/');
    } else {
      setErrorGeneral('Correo o contraseña incorrectos.');
    }
  }

  return (
    <section className="seccion">
      <div className="container formulario-contacto">
        <h1>Iniciar sesión</h1>

        {location.state?.registrado && (
          <div className="alert alert-success" role="status">
            Cuenta creada correctamente. Ahora puedes iniciar sesión.
          </div>
        )}
        {location.state?.requiereSesion && (
          <div className="alert alert-info" role="status">
            Inicia sesión para ver tu carrito.
          </div>
        )}
        {errorGeneral && (
          <div className="alert alert-danger" role="alert">
            {errorGeneral}
          </div>
        )}

        <form className="tarjeta" onSubmit={enviar} noValidate>
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
            autoComplete="current-password"
          />
          <button type="submit" className="btn boton boton-primario">
            Entrar
          </button>
        </form>

        <p className="mt-3">
          ¿No tienes cuenta?{' '}
          <Link to="/registro" className="enlace-texto">
            Regístrate
          </Link>
        </p>
      </div>
    </section>
  );
}
