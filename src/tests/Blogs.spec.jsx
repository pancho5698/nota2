import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Blogs from '../components/Blogs';
import blogs from '../data/blogs.json';

describe('Blogs', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <Blogs />
      </MemoryRouter>,
    );
  });

  it('muestra una tarjeta por cada blog del JSON', () => {
    expect(document.querySelectorAll('.tarjeta-blog').length).toBe(blogs.length);
    expect(screen.getByText(blogs[0].titulo)).toBeTruthy();
  });

  it('cada Leer mas apunta al detalle de su blog', () => {
    const enlaces = screen.getAllByText('Leer más');
    expect(enlaces[0].getAttribute('href')).toBe('/blogs/1');
    expect(enlaces[1].getAttribute('href')).toBe('/blogs/2');
  });
});