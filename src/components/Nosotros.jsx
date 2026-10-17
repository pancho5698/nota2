const bloques = [
  {
    titulo: 'Nuestra historia',
    texto:
      'FitLab nació con la idea de acercar suplementos y equipamiento deportivo de calidad a quienes entrenan día a día, sin importar su nivel. Partimos como un pequeño emprendimiento y hoy ofrecemos proteínas, aminoácidos, vitaminas, creatinas, ropa y equipamiento para acompañar cada etapa del entrenamiento.',
  },
  {
    titulo: 'Misión',
    texto:
      'Entregar productos deportivos confiables y de buena calidad, con información clara sobre cada uno, para que nuestros clientes entrenen con seguridad y logren sus objetivos.',
  },
  {
    titulo: 'Equipo',
    texto:
      'Somos un grupo de estudiantes de Ingeniería en Informática de Duoc UC que decidió crear FitLab como un proyecto propio. Combinamos lo que aprendimos en la carrera con la pasión por el deporte para levantar este emprendimiento desde cero.',
  },
];

export default function Nosotros() {
  return (
    <section className="seccion">
      <div className="container">
        <h1>Nosotros</h1>
        <div className="row g-4 mt-2">
          {bloques.map((bloque) => (
            <div className="col-md-6 col-lg-4" key={bloque.titulo}>
              <article className="tarjeta bloque-nosotros">
                <h2>{bloque.titulo}</h2>
                <p className="mb-0">{bloque.texto}</p>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}