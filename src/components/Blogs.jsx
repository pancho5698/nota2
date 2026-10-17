import { Link } from 'react-router-dom';
import blogs from '../data/blogs.json';

export default function Blogs() {
  return (
    <section className="seccion">
      <div className="container">
        <h1>Noticias y blogs</h1>
        <div className="row g-4 mt-2">
          {blogs.map((blog) => (
            <div className="col-md-6" key={blog.id}>
              <article className="tarjeta tarjeta-blog">
                <h2>{blog.titulo}</h2>
                <p>{blog.resumen}</p>
                <Link to={`/blogs/${blog.id}`} className="btn boton mt-auto align-self-start">
                  Leer más
                </Link>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}