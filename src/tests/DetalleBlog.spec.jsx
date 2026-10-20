import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DetalleBlog from '../components/DetalleBlog';
import blogs from '../data/blogs.json';

function renderBlog(id) {
  render(
    <MemoryRouter initialEntries={[`/blogs/${id}`]}>
      <Routes>
        <Route path="/blogs/:id" element={<DetalleBlog />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('DetalleBlog', () => {
  it('blog 1 muestra titulo, imagen y todos sus parrafos', () => {
    renderBlog(1);
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(blogs[0].titulo);
    expect(document.querySelector('.blog-imagen')).not.toBeNull();
    expect(document.querySelectorAll('article p').length).toBe(blogs[0].parrafos.length);
  });

  it('blog 2 muestra el video en vez de imagen', () => {
    renderBlog(2);
    expect(document.querySelector('iframe').getAttribute('src')).toBe(blogs[1].video);
    expect(document.querySelector('.blog-imagen')).toBeNull();
  });

  it('muestra un aviso si el blog no existe', () => {
    renderBlog(99);
    expect(screen.getByText('Blog no encontrado')).toBeTruthy();
  });
});
