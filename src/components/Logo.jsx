export default function Logo({ texto = 'FitLab' }) {
  return (
    <span className="marca">
      <img src="/img/favicon.jpeg" alt="" width="30" height="30" className="marca-icono" />
      <span className="marca-nombre">{texto}</span>
    </span>
  );
}