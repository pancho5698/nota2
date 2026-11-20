import { useEffect, useState } from 'react';

// Hook personalizado: pide el catálogo al backend (Spring Boot + MongoDB Atlas).
// Devuelve los productos y el estado de carga o error para que la vista decida qué mostrar.
export default function useProductos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarProductos() {
      try {
        // Vite reenvía /api al backend definido en server.proxy de vite.config.js.
        const respuesta = await fetch('/api/v1/productos', { signal: controlador.signal });
        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}`);
        }
        setProductos(await respuesta.json());
        setError(false);
      } catch {
        if (!controlador.signal.aborted) {
          setError(true);
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarProductos();
    // Cancela la petición si el componente se desmonta antes de recibir la respuesta.
    return () => controlador.abort();
  }, []);

  return { productos, setProductos, cargando, error };
}
