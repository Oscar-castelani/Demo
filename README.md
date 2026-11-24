# TUCE Conecta – demo interactiva

Demostración de una plataforma que vincula estudiantes de la Tecnicatura Universitaria en Comercio Electrónico (TUCE, UNPAZ) con comercios, emprendimientos y Pymes, con acompañamiento docente.

**Demo en línea:** https://oscar-castelani.github.io/Demo/

> **Esto es una demostración.** No hay cuentas reales, contraseñas, base de datos ni servidor. Los permisos de cada rol se simulan en la interfaz y **no son un sistema de seguridad**. Lo que se carga queda solo en el navegador de quien lo escribe. Los formularios **no son una postulación real** a ningún programa universitario: usá datos ficticios.

**Estado:** versión 2. La demo arranca vacía y cada rol se postula y recorre el proceso (postulaciones, equipos, tablero, entregables y cierre), con herramientas gratuitas. Hay un caso de ejemplo ficticio que se carga con un botón.

Para entender qué hace cada rol, leé la **[Guía de la demo](GUIA_DE_LA_DEMO.md)**.

## Recorrido en breve

1. **Comercio:** *Postular mi comercio*. 2. **Docente:** revisa y aprueba la postulación. 3. **Estudiante:** *Postularme como estudiante* y elige un proyecto. 4. **Docente:** arma el equipo en *Equipos*. 5. **Equipo:** trabaja en el tablero y registra entregables. 6. **Docente y comercio:** revisan. 7. **Docente:** evalúa y cierra el proyecto.

Una guía en pantalla indica el próximo paso. **Cargar ejemplo** (pantalla de ingreso) carga un caso ficticio ya terminado.

## Tecnologías

React · TypeScript · Vite · React Router (`HashRouter`) · CSS propio · `localStorage` · GitHub Pages. Los logos de las herramientas vienen de `simple-icons` (CC0).

## Instalación y ejecución

Requiere Node.js 20 o superior y npm.

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173/Demo/` (la ruta base corresponde al repositorio `Demo` de GitHub Pages).

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica tipos y genera la versión de producción en `dist/` |
| `npm run lint` | Revisa el código con ESLint |
| `npm run preview` | Sirve la compilación de producción |

## Pantallas y rutas

| Ruta | Pantalla |
|---|---|
| `#/` | Bienvenida (incluye la sección de herramientas) |
| `#/ingresar` | Selector de rol y usuario; carga del ejemplo |
| `#/postular/comercio` | Formulario de postulación del comercio |
| `#/postular/estudiante` | Formulario de postulación del estudiante |
| `#/app` | Panel según el rol (sin usuario elegido, redirige al ingreso) |
| `#/app/postulaciones` | Comercio: seguimiento de sus postulaciones. Docente: revisión |
| `#/app/abiertos` | Estudiante: proyectos abiertos y su perfil |
| `#/app/equipos` | Docente: aceptar estudiantes, armar el equipo y coordinar |
| `#/app/proyectos` | Listado de proyectos del usuario |
| `#/app/proyectos/:id` | Detalle con pestañas: Resumen, Tablero de tareas, Entregables, Actividad y Cierre y evaluación |
| `#/app/supervision` | Panel de supervisión docente |
| `#/app/herramientas` | Herramientas gratuitas con logo, uso y enlace |

## Roles

| Rol | Cómo ingresa | Resumen de lo que puede hacer |
|---|---|---|
| Emprendimiento | Formulario o eligiendo a alguien ya cargado | Postular y seguir proyectos, conversar con el docente, revisar entregables, escribir la devolución final |
| Estudiante | Formulario o eligiendo a alguien ya cargado | Postularse a proyectos abiertos, crear y mover tareas propias (hasta En revisión), comentar, registrar entregables, escribir la reflexión del equipo |
| Supervisor docente | Entra directo | Revisar postulaciones, armar equipos, observar, aprobar o pedir correcciones, evaluar y cerrar |
| Administrador de demostración | Entra directo | Ver todo, hacer pruebas y restablecer |

El detalle completo está en la [Guía de la demo](GUIA_DE_LA_DEMO.md).

## Datos y persistencia

- Estado vacío y caso de ejemplo ficticio: `src/data/demoData.ts`. Lo inventado lleva `simulated: true` y no tiene fecha visible; no hay personas, comercios ni enlaces reales.
- Almacenamiento: `src/services/storageService.ts` (única capa que usa `localStorage`, con control de errores y versión de esquema).
- Estado global: `src/context/DemoContext.tsx` y `src/hooks/useDemo.ts`.
- Los cambios se conservan solo en el navegador y el sitio donde se hicieron. **Restablecer demo** la deja vacía.

## Publicación en GitHub Pages

El sitio se publica con GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## Documentación

- [GUIA_DE_LA_DEMO.md](GUIA_DE_LA_DEMO.md): qué hace cada rol y cómo presentar la demo.
- [REQUISITOS.md](REQUISITOS.md): alcance, roles y reglas.
- [ARQUITECTURA.md](ARQUITECTURA.md): estructura, rutas y modelo de datos.
- [PRUEBAS.md](PRUEBAS.md): pruebas realizadas y límites.
- [CAMBIOS.md](CAMBIOS.md): registro de cambios.
