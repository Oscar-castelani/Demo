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
  services/   storage · application · team · task · deliverable · closure · dashboard · alerts · timeline · tour · entries
  context/    DemoContext
  hooks/      useDemo · useActiveUser · useDocumentTitle
  data/       demoData · scenarios · presentationSteps · tools
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

## Teclado y foco

- `SkipLink` es el primer elemento enfocable y lleva el foco al `<main>` (es un botón, no un ancla, porque la parte del enlace después de `#` es de las rutas). Cada `<main>` tiene `tabIndex={-1}` para poder recibir el foco.
- `RouteFocus` lleva la vista al inicio y el foco al `<h1>` cuando cambia la ruta (no cuando cambia la pestaña ni la consulta); no actúa en la primera carga.
- Las pestañas del proyecto siguen el patrón de teclado: solo la activa está en el orden de tabulación; flechas, Inicio y Fin cambian de pestaña y mueven el foco.
- Los diálogos usan `<dialog>` nativo: atrapan el foco, se cierran con Escape y devuelven el foco al elemento que los abrió.

## Alertas y línea de tiempo

`alertsService.teacherAlerts(state, projects)` recorre tareas y entregables y devuelve alertas de cuatro tipos (vencidas, cambios solicitados, en revisión y sin responsable) con el enlace a la pantalla donde se atienden; compara fechas como texto `AAAA-MM-DD` en hora local. `AlertsPanel` las muestra en el panel de inicio del docente y dentro de cada proyecto de Supervisión.

`timelineService` fusiona el historial (eventos) con los comentarios: `entityTimeline` para una tarea o un entregable (de lo más antiguo a lo más nuevo) y `projectTimeline` para el proyecto (de lo más nuevo a lo más antiguo). Los registros simulados comparten una marca de tiempo ficticia, por lo que entre ellos se respeta el orden de registro. Al cambiar de estado o revisar un entregable, el evento se crea antes que el comentario asociado para que se lea en orden. `Timeline` los dibuja con texto ("Evento" o "Comentario") y forma distintos.

## Panel del docente

`teacherOverview(state, user)` (`src/services/teacherOverview.ts`) calcula las filas de **estudiantes** (con su situación) y de **equipos** (proyecto, comercio, integrantes, coordinador). Si no hay estudiantes o equipos reales, completa con los del caso de ejemplo y lo indica (`studentsIllustrative`, `teamsIllustrative`); esos datos no se guardan. `SkillsHover` muestra las habilidades en un `role="tooltip"` que se abre con el mouse, el foco o el toque, se cierra con Escape y se anuncia con `aria-describedby`.

## Escenarios

`src/data/scenarios.ts` arma estados de la demo **con la misma lógica que usa la aplicación** (los servicios), avanzando paso a paso: postulación, revisión, proyecto abierto, perfiles, postulantes, equipo, tareas, entregables y cierre. Hay un escenario por paso de la guía (10 en total, con el proyecto finalizado). Todo queda marcado como simulado. `ScenarioPicker` lista los escenarios elegibles en el ingreso; el resto los usará el modo presentación.

## Modo presentación

`PresentationContext` guarda el paso activo (1 a 9 o ninguno) en `localStorage` como preferencia de pantalla: no es un dato de la demo y no se borra al restablecerla. `data/presentationSteps.ts` define los 9 pasos (título, rol, persona ficticia, objetivo y pantalla). `usePresentationActions` carga el escenario del paso (`scenarioForStep`), deja activa a la persona que corresponde y navega; en los pasos con formulario público deja activo al docente de demostración para que la pantalla protegida de origen no redirija al ingreso durante la navegación. `PresentationBar` es una barra `sticky` al final de la página (no tapa el contenido) y `PathCards` ofrece los dos caminos de entrada y el botón para activar el modo (con confirmación si hay datos).

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
