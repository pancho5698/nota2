export default function CampoFormulario({
  id,
  etiqueta,
  error = '',
  tipo = 'text',
  multilinea = false,
  ...props
}) {
  const Control = multilinea ? 'textarea' : 'input';

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">
        {etiqueta}
      </label>
      <Control
        id={id}
        name={id}
        type={multilinea ? undefined : tipo}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
}
