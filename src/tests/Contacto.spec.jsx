import { fireEvent, render, screen } from '@testing-library/react';
import Contacto from '../components/Contacto';

function escribir(etiqueta, valor) {
  fireEvent.change(screen.getByLabelText(etiqueta), { target: { value: valor } });
}

function llenar(nombre, correo, comentario) {
  escribir('Nombre', nombre);
  escribir('Correo', correo);
  escribir('Comentario', comentario);
}

function enviar() {
  fireEvent.click(screen.getByText('Enviar'));
}

describe('Contacto', () => {
  beforeEach(() => {
    render(<Contacto />);
  });

  it('muestra los 3 errores si se envia vacio', () => {
    enviar();

    expect(screen.getByText('El nombre es obligatorio.')).toBeTruthy();
    expect(screen.getByText('El correo es obligatorio.')).toBeTruthy();
    expect(screen.getByText('El comentario es obligatorio.')).toBeTruthy();
    expect(document.querySelectorAll('.is-invalid').length).toBe(3);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('evita que la pagina se recargue al enviar', () => {
    const formulario = document.querySelector('form');
    // false = preventDefault
    expect(fireEvent.submit(formulario)).toBeFalse();
  });

  it('corrige los errores, envia y limpia el formulario', () => {
    enviar();
    expect(document.querySelectorAll('.invalid-feedback').length).toBe(3);

    llenar('Marco', 'marco@duocuc.cl', 'Consulta por stock');
    enviar();

    expect(document.querySelectorAll('.invalid-feedback').length).toBe(0);
    expect(screen.getByRole('status').textContent).toBe('Mensaje enviado correctamente.');
    expect(screen.getByLabelText('Nombre').value).toBe('');
    expect(screen.getByLabelText('Comentario').value).toBe('');
    expect(screen.getByText('0/500 caracteres')).toBeTruthy();
  });

  it('acepta solo los dominios permitidos', () => {
    const permitidos = ['ana@duocuc.cl', 'ana@profesor.duocuc.cl', 'ana@gmail.com', 'ana@outlook.com'];
    const rechazados = ['ana@hotmail.com', 'ana@yahoo.es', 'ana@gmail'];

    permitidos.forEach((correo) => {
      llenar('Ana', correo, 'Hola');
      enviar();
      expect(screen.getByRole('status')).toBeTruthy();
    });

    rechazados.forEach((correo) => {
      llenar('Ana', correo, 'Hola');
      enviar();
      expect(screen.getByLabelText('Correo').classList.contains('is-invalid')).toBeTrue();
      expect(screen.queryByRole('status')).toBeNull();
    });
  });

  it('respeta los largos maximos', () => {
    expect(screen.getByLabelText('Nombre').getAttribute('maxlength')).toBe('100');
    expect(screen.getByLabelText('Comentario').getAttribute('maxlength')).toBe('500');

    llenar('a'.repeat(101), 'ana@gmail.com', 'b'.repeat(501));
    enviar();

    expect(screen.getByText('El nombre no puede superar los 100 caracteres.')).toBeTruthy();
    expect(screen.getByText('El comentario no puede superar los 500 caracteres.')).toBeTruthy();
    expect(screen.getByText('501/500 caracteres')).toBeTruthy();
  });

  it('el aviso de exito se oculta al volver a escribir', () => {
    llenar('Marco', 'marco@gmail.com', 'Hola');
    enviar();
    expect(screen.getByRole('status')).toBeTruthy();

    escribir('Nombre', 'M');
    expect(screen.queryByRole('status')).toBeNull();
  });
});
