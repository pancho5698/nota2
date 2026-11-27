# FitLab Frontend

Tienda online de suplementos, equipamiento y ropa deportiva hecha en React y Vite. Es el frontend de la Evaluación Parcial 3 de Desarrollo Fullstack II y se conecta a la API del repositorio backend (Spring Boot y MongoDB Atlas).

Tienda publicada en Railway: https://fitlab-front-production.up.railway.app

## Requisitos

- Node.js 20 o superior
- El backend funcionando (en Railway o en local)

## Ejecutar

```sh
git clone https://github.com/pancho5698/nota2.git
cd nota2
npm install
npm run dev
```

Se abre en http://localhost:5173. Vite reenvía las rutas `/api` al backend configurado en `server.proxy` de `vite.config.js`. Para usar el backend en local se cambia el `target` por `http://localhost:8080`.

## Funciones

- Catálogo de productos con búsqueda, filtro por categoría y ofertas.
- Registro e inicio de sesión con JWT. La sesión se guarda en localStorage y se renueva al recargar la página.
- Carrito y compra: crea la boleta en el backend y muestra el comprobante.
- Panel de administración: resumen, productos, compras y usuarios.
- Panel de vendedor: solo ve los productos (sin editar) y las compras.
- El cliente solo usa la tienda. Si entra al panel ve "Acceso restringido".

## Organización

- `src/services/api.js`: todas las llamadas a la API. Agrega el token en la cabecera Authorization.
- `src/App.jsx`: rutas, sesión, carrito y restricciones por rol.
- `src/components`: páginas de la tienda (inicio, productos, detalle, carrito, login, registro, etc).
- `src/admin`: panel de administración y de vendedor.
- `src/utils`: validaciones, formato de precios y carrito.
- `src/tests`: pruebas con Karma y Jasmine.

## Comprobaciones

```sh
npm run lint
npm run build
npm test
```

## Railway

El sitio se publica con `vite preview` usando el script `start` de `package.json`. Desde esta carpeta:

```sh
railway up --service fitlab-front
```
