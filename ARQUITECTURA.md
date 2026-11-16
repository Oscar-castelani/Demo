# Arquitectura

## Tecnologías

React 19, TypeScript, Vite, React Router (`HashRouter`), CSS propio y la tipografía Plus Jakarta Sans instalada localmente. Los logos de las herramientas vienen del paquete `simple-icons` (licencia CC0; solo se incluyen los usados). Sin librerías de estado ni de interfaz. Publicación con GitHub Actions en GitHub Pages.

## Capas

| Capa | Dónde | Responsabilidad |
|---|---|---|
| Interfaz | `src/components`, `src/pages` | Pantallas y componentes. No contienen reglas de negocio: despachan acciones |
| Lógica | `src/services` | Funciones que reciben el estado y devuelven un estado nuevo; incluyen los permisos simulados y las validaciones |
| Datos | `src/data` | Estado vacío, caso de ejemplo y lista de herramientas |
| Persistencia | `src/services/storageService.ts` | Único archivo que usa `localStorage` para los datos |
| Estado global | `src/context/DemoContext.tsx` | Aplica las acciones con un reductor y guarda cada cambio |

Para migrar a un backend solo habría que reemplazar `storageService` y la forma en que `DemoContext` carga y guarda.

## Estructura

```text
src/
  components/ common · layout · applications · forms · teams · projects · tasks · deliverables · dashboard · tools
  pages/      Welcome · RoleSelect · ApplyBusiness · ApplyStudent · Dashboard · Applications · OpenProjects
              Teams · Projects · ProjectDetail · Supervision · Tools
  services/   storage · application · team · task · deliverable · closure · dashboard · tour · entries
  context/    DemoContext
  hooks/      useDemo · useActiveUser · useDocumentTitle
  data/       demoData · scenarios · tools
  types/      index
  utils/      labels · validation · applicationValidation · url
  styles/     variables · base · home · app · mobile
  assets/     images
```

## Rutas

| Ruta | Pantalla |
|---|---|
| `#/` | Bienvenida (incluye la sección de herramientas) |
| `#/ingresar` | Selector de rol y usuario; admite `?rol=` |
| `#/postular/comercio`, `#/postular/estudiante` | Formularios de postulación (públicos: crean la identidad) |
| `#/app` | Panel según el rol (protegida) |
| `#/app/postulaciones` | Comercio: sus postulaciones. Docente: revisión |
| `#/app/abiertos` | Estudiante: proyectos abiertos y su perfil |
| `#/app/equipos` | Docente: aceptar estudiantes, armar equipos, coordinar |
| `#/app/proyectos`, `#/app/proyectos/:id` | Listado y detalle (`?tab=` y `?task=`) |
| `#/app/supervision` | Supervisión docente |
| `#/app/herramientas` | Herramientas |

## Modelo de datos (`src/types/index.ts`)

- Personas y comercios: `User` (rol), `Business` (contacto y redes), `StudentProfile`.
- Postulaciones: `ProjectApplication` (con conversación) y `ProjectInterest` (estudiante a proyecto).
- Trabajo: `Project` (equipo, coordinador, lugares, cierre), `Task`, `Deliverable`, `Comment`, `HistoryEntry`.
- `DemoState` agrupa todo y lleva `schemaVersion` (actualmente 5).
- Lo inventado lleva `simulated`; el cierre usa `simulatedFields`.
- La etapa de una postulación aprobada (equipo asignado, en desarrollo, entregada) se **deriva** del proyecto y sus tareas; no se guarda, para evitar inconsistencias.

## Flujo de una acción

1. La interfaz llama a `dispatch({ type, actorId, ... })`.
2. El reductor busca al actor y llama a la función del servicio correspondiente. Las acciones que crean a la persona (los formularios) no tienen actor.
3. El servicio valida permisos y datos; si algo falla devuelve el mismo estado, sin cambios.
4. Si el estado cambió, `DemoContext` lo guarda en `localStorage` y avisa si el guardado falla.

## Panel del docente

`teacherOverview(state, user)` (`src/services/teacherOverview.ts`) calcula las filas de **estudiantes** (con su situación) y de **equipos** (proyecto, comercio, integrantes, coordinador). Si no hay estudiantes o equipos reales, completa con los del caso de ejemplo y lo indica (`studentsIllustrative`, `teamsIllustrative`); esos datos no se guardan. `SkillsHover` muestra las habilidades en un `role="tooltip"` que se abre con el mouse, el foco o el toque, se cierra con Escape y se anuncia con `aria-describedby`.

## Escenarios

`src/data/scenarios.ts` arma estados de la demo **con la misma lógica que usa la aplicación** (los servicios), avanzando paso a paso: postulación, revisión, proyecto abierto, perfiles, postulantes, equipo, tareas, entregables y cierre. Hay un escenario por paso de la guía (10 en total, con el proyecto finalizado). Todo queda marcado como simulado. `ScenarioPicker` lista los escenarios elegibles en el ingreso; el resto los usará el modo presentación.

## Guía del recorrido

`tourService.nextTourStep(state)` recorre el estado y devuelve el próximo paso (rol, pantalla y texto), o `null` si el proyecto está cerrado. `TourBanner` lo muestra y se puede ocultar (preferencia en `localStorage`).

## Decisiones técnicas

- `HashRouter` para que recargar una ruta interna funcione en GitHub Pages; `base: '/Demo/'` en Vite.
- Diálogos nativos `<dialog>`; paneles plegables con `<details>` (abiertos en escritorio, cerrados en el celular salvo los principales).
- Los permisos se aplican también en los servicios, no solo ocultando botones.
- Los formularios usan etiquetas asociadas, grupos con `fieldset` y errores con `role="alert"`.
- Las fotografías están en `src/assets/images`; el equipo confirmó que provienen de un banco de imágenes sin derecho de autor.

## Publicación

`.github/workflows/deploy.yml` instala dependencias, corre `lint` y `build`, y publica `dist/` en cada push a `main`. Requiere Settings → Pages → Source: GitHub Actions.
