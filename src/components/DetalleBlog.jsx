import { Link, useParams } from 'react-router-dom';
import blogs from '../data/blogs.json';

export default function DetalleBlog() {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === Number(id));

  if (!blog) {
    return (
      <section className="seccion">
        <div className="container">
          <h1>Blog no encontrado</h1>
          <Link to="/blogs" className="btn boton">
            Volver a blogs
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion">
      <article className="container blog-articulo">
        <h1>{blog.titulo}</h1>

        {blog.imagen && <img src={blog.imagen} alt={blog.titulo} className="blog-imagen" />}
        {blog.video && (
          <div className="ratio ratio-16x9 mb-4">
            <iframe src={blog.video} title={blog.titulo} allowFullScreen />
          </div>
        )}

        {blog.parrafos.map((parrafo) => (
          <p key={parrafo}>{parrafo}</p>
        ))}

        <Link to="/blogs" className="btn boton mt-3">
          ← Volver a blogs
        </Link>
      </article>
    </section>
  );
}
