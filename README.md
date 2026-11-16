# TUCE Conecta – MVP demostrativo

Demo interactiva de una plataforma que vincula estudiantes de la Tecnicatura Universitaria en Comercio Electrónico (TUCE, UNPAZ) con comercios, emprendimientos y Pymes, con acompañamiento docente.

> Proyecto académico. Es una demostración: no hay cuentas reales, autenticación ni base de datos. Los datos marcados como simulados son ejemplos, no hechos históricos.

**Estado:** versión 2 de la demo: arranca vacía y cada rol se postula y recorre el proceso (postulaciones, equipos, tablero, entregables, cierre), con herramientas gratuitas y guía del recorrido.

## Tecnologías

React · TypeScript · Vite · CSS propio · localStorage (a partir de la Fase 2) · GitHub Pages

## Requisitos

Node.js 20 o superior y npm.

## Instalación y ejecución

```bash
npm install
npm run dev
```

La app queda en `http://localhost:5173/Demo/` (la ruta base corresponde al repositorio `Demo` de GitHub Pages).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Verifica tipos y genera la versión de producción en `dist/` |
| `npm run lint` | Revisa el código con ESLint |
| `npm run preview` | Sirve la compilación de producción |

## Estructura

```text
src/
  components/ (common, layout, projects, tasks, supervision)
  pages/  data/  services/  context/  hooks/  utils/  styles/  types/
```

La interfaz, la lógica y la persistencia se mantienen separadas.

## Enlace a la demo

Se agregará al publicar en GitHub Pages (Fase 8).

## Datos y persistencia

- Estado vacío y caso de ejemplo ficticio: `src/data/demoData.ts`. Los datos inventados llevan `simulated: true`; no hay personas, comercios ni enlaces reales.
- Almacenamiento: `src/services/storageService.ts` (única capa que usa `localStorage`, con control de errores y versión de esquema).
- Estado global: `src/context/DemoContext.tsx` y `src/hooks/useDemo.ts`.
- Los cambios se conservan solo en el navegador y origen donde se hicieron.

## Navegación

| Ruta | Pantalla |
|---|---|
| `#/` | Bienvenida |
| `#/ingresar` | Selector de rol y usuario (sin contraseñas) |
| `#/app` | Panel según el rol; si no hay usuario elegido, redirige al selector |

| `#/app/proyectos` | Listado de proyectos del usuario |
| `#/app/proyectos/:id` | Detalle del proyecto (resumen y tablero de tareas) |

### Permisos simulados en el tablero

| Rol | Puede |
|---|---|
| Estudiante (integrante) | Crear y editar tareas del proyecto; mover las tareas que tiene asignadas o sin responsable (Pendiente ↔ En proceso → En revisión). No marca Finalizada |
| Supervisor docente | Aprobar (Finalizada) o solicitar correcciones (En proceso) sobre tareas En revisión. No crea ni edita tareas |
| Emprendimiento | Solo consulta |
| Administrador | Todo, incluida la reasignación de responsables |

Es una simulación de la interfaz, no un sistema de seguridad.

### Comentarios y entregables

- Comentarios en tareas: equipo, supervisor del proyecto y administrador. En entregables también comenta el emprendimiento.
- Entregables: se registran **enlaces** (solo http/https, abiertos en otra pestaña con `rel="noopener noreferrer"`); no se almacenan archivos. Pueden vincularse a una tarea.
- Revisión: el emprendimiento aprueba o solicita modificaciones (con devolución obligatoria). Quien lo registró puede volver a enviarlo a revisión.
- Los datos simulados no muestran fecha, solo la etiqueta "Dato simulado".

## Publicación en GitHub Pages

El sitio se publica con GitHub Actions (`.github/workflows/deploy.yml`) en cada push a `main`.
En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
URL: https://oscar-castelani.github.io/Demo/

### Supervisión y cierre

- `#/app/supervision` (supervisor y administrador): avance por estado, integrantes, tareas pendientes de revisión, entregables, comentarios recientes y actividad.
- Al pedir correcciones, el supervisor debe dejar una observación; queda como comentario de la tarea.
- Pestaña "Cierre y evaluación": cada parte la completa su rol (cumplimiento y observaciones: supervisor; devolución: emprendimiento; reflexión: equipo). Cerrar el proyecto exige todas las tareas Finalizadas; agregar una tarea a un proyecto cerrado lo reabre.

## Documentación

- [REQUISITOS.md](REQUISITOS.md) · [ARQUITECTURA.md](ARQUITECTURA.md) · [PRUEBAS.md](PRUEBAS.md) · [CAMBIOS.md](CAMBIOS.md)

### Recorrido de la demo

1. Comercio: **Postular mi comercio**. 2. Docente: revisa y aprueba. 3. Estudiante: **Postularme como estudiante** y elige un proyecto. 4. Docente: arma el equipo en **Equipos**. 5. El equipo trabaja en el tablero y registra entregables. 6. Docente y comercio revisan. 7. El docente cierra el proyecto. Una guía en pantalla indica el próximo paso; **Cargar ejemplo** carga un caso ficticio.
