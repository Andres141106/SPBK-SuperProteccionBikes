# spbk-superproteccionbikes
📌 Descripción del Proyecto

SPBK – SuperProteccionBikes es una Single Page Application (SPA) desarrollada con Vue.js 3 que permite:

Autenticación de usuarios (Admin / User)

Gestión completa (CRUD) de Usuarios

Gestión completa (CRUD) de Productos

Interfaz moderna con Bootstrap 5 y Bootstrap Icons

Rutas protegidas mediante Vue Router

Consumo de APIs desde MockAPI

Control de sesión mediante localStorage

Vista especial de Tienda para usuarios tipo User

El proyecto cumple completamente con los requerimientos funcionales y no funcionales del examen final.

✨ Características Principales
🔐 Autenticación

Inicio de sesión validando email + password contra MockAPI.

Generación de token ficticio almacenado en localStorage.

Usuarios tipo Admin ingresan al panel administrativo.

Usuarios User ingresan a la tienda.

Cerrar sesión disponible desde la barra de navegación.

🛡️ Rutas Protegidas

Usuarios no autenticados → redirigidos a /login.

Solo Admin puede acceder a:

/users

/products

Usuarios User solo acceden a:

/shop

Protección implementada mediante navigation guards.

👥 CRUD de Usuarios (Solo Admin)

Incluye:

Listado completo

Crear usuario (modal)

Editar usuario (modal)

Eliminar usuario (modal de confirmación)

Uso de alertas tras cada acción (éxito/error)

Roles disponibles: Admin / User

Estado: Activo / Inactivo

Usuarios con estado Inactivo no pueden iniciar sesión

📦 CRUD de Productos (Solo Admin)

Incluye:

Listado de productos

Crear producto (modal)

Editar producto (modal)

Eliminar producto (modal de confirmación)

Manejo de imágenes por URL

Solo productos con estado Activo aparecen en la Tienda

Alertas de confirmación y errores

🛒 Vista “Tienda” para Usuarios tipo User

Los usuarios “User” acceden únicamente a esta vista.

Funciones:

Ver productos activos

Filtro automático: productos Inactivos NO se muestran

Modal con detalle del producto

Botón Comprar (simula compra con alerta)

🎨 Diseño e Interfaz

Realizado con:

Bootstrap 5

Bootstrap Icons

Sistema grid responsivo

Modales para CRUD

Alertas de retroalimentación

🧱 Tecnologías Utilizadas
Tecnología	Uso
Vue 3 (Composition / Options API)	SPA, reactividad, vistas
Vue Router	Rutas protegidas y navegación
Axios	Consumo de MockAPI
Bootstrap 5	UI moderna y responsiva
Bootstrap Icons	Iconografía
MockAPI	Backend simulado (Usuarios y Productos)
Git + GitHub	Control de versiones
📂 Estructura del Proyecto
src/
 ├── assets/
 ├── components/
 ├── router/
 │     └── index.js
 ├── services/
 │     ├── api.js
 │     ├── authService.js
 │     ├── userService.js
 │     └── productService.js
 ├── views/
 │     ├── LoginView.vue
 │     ├── RegisterView.vue
 │     ├── UsersView.vue
 │     ├── ProductsView.vue
 │     └── ShopView.vue
 ├── App.vue
 └── main.js

🧪 Flujo del Sistema
🔸 Login

Usuario ingresa email y contraseña.

Se verifica en MockAPI.

Si es Admin → /users

Si es User → /shop

Si está Inactivo → no puede entrar.

🔸 CRUD Usuarios (Admin)

Listar → modal de creación → modal de edición → modal de eliminación.

Roles seleccionados desde un <select>.

Estado “Inactivo” bloquea acceso.

🔸 CRUD Productos (Admin)

Listar productos

Imagen cargada por URL

Crear / Editar / Eliminar

Los productos con estado Inactivo no aparecen en la tienda

🔸 Tienda (User)

Vista solo para usuarios no administradores.

Consumición del endpoint de productos.

Filtrado automático: productos activos.

Modal con detalle + botón de compra.

🔗 URL del Repositorio

https://github.com/Andres141106/SPBK-SuperProteccionBikes.git

📝 Conclusiones

La aplicación cumple todos los requerimientos del examen final.

Se implementó una SPA modular, escalable y segura mediante rutas protegidas.

Bootstrap 5 permitió crear una interfaz moderna y responsiva.

Se aplicaron buenas prácticas en la separación de servicios, router y vistas.

El uso de MockAPI facilitó la simulación de un backend real.

El flujo de roles (Admin/User) permite un sistema adaptable a escenarios reales.

🧑‍💻 Autores

Andrés Felipe Carrascal Gomez 
(192321) — front-End-diseño

Franklin Mauricio Hernandez Galvis (192326) - front-End-diseño 

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
