import { useState } from 'react';
import CampoFormulario from './CampoFormulario';
import { hayErrores, validarContacto } from '../utils/validaciones';

const formularioVacio = { nombre: '', correo: '', comentario: '' };

export default function Contacto() {
  const [datos, setDatos] = useState(formularioVacio);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function cambiar(e) {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setEnviado(false);
  }

  function enviar(e) {
    e.preventDefault();
    const nuevosErrores = validarContacto(datos);
    setErrores(nuevosErrores);

    if (!hayErrores(nuevosErrores)) {
      setEnviado(true);
      setDatos(formularioVacio);
    }
  }

  return (
    <section className="seccion">
      <div className="container formulario-contacto">
        <h1>Contacto</h1>
        <p>¿Tienes dudas sobre un producto? Escríbenos.</p>

        {enviado && (
          <div className="alert alert-success" role="status">
            Mensaje enviado correctamente.
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
          />
          <CampoFormulario
            id="comentario"
            etiqueta="Comentario"
            multilinea
            rows={5}
            value={datos.comentario}
            error={errores.comentario}
            onChange={cambiar}
            maxLength={500}
          />
          <p className="small">{datos.comentario.length}/500 caracteres</p>
          <button type="submit" className="btn boton boton-primario">
            Enviar
          </button>
        </form>
      </div>
    </section>
  );
}
