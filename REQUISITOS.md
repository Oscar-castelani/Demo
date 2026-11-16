# Requisitos

Demo interactiva de TUCE Conecta: una plataforma que vincula estudiantes de la TUCE (UNPAZ) con comercios, emprendimientos y Pymes, con acompañamiento docente. Es una demostración: no hay cuentas reales ni base de datos.

> **Cambio de alcance (15/11/2026).** La especificación original pedía un único proyecto precargado y excluía el registro. A pedido del equipo, la demo ahora **arranca vacía** y muestra cómo interactúa cada rol mediante formularios de postulación. Hay un **caso de ejemplo ficticio** opcional (botón "Cargar ejemplo").

## Recorrido de la demo

1. **Comercio:** completa el formulario de postulación de su proyecto.
2. **Docente:** revisa la postulación (la aprueba, pide más información o no la aprueba). Al aprobar se crea el proyecto con una cantidad de lugares.
3. **Estudiante:** completa su perfil con habilidades y se postula a un proyecto abierto.
4. **Docente:** acepta estudiantes, arma el equipo y designa quién coordina.
5. **Equipo:** organiza tareas en un tablero, comenta y registra entregables (enlaces).
6. **Docente y comercio:** revisan tareas y entregables.
7. **Docente:** registra la evaluación final y cierra el proyecto.

Una guía muestra en cada momento cuál es el próximo paso y qué rol debe actuar.

## Alcance incluido

- Formularios de postulación de comercios y de estudiantes; el formulario crea la identidad (no hay contraseñas).
- Seguimiento de la postulación del comercio en 6 etapas y conversación con el docente.
- Revisión de postulaciones, proyectos abiertos, armado de equipos y coordinación.
- Listado y detalle de proyectos, tablero de tareas, comentarios, entregables, actividad y cierre.
- Panel de supervisión docente.
- Sección de herramientas gratuitas con logos y enlaces.
- Caso de ejemplo opcional y **escenarios reproducibles** para probar una parte del recorrido (5 listados en el ingreso; 10 en total, uno por paso de la guía). Cada uno es ficticio, está marcado como simulado y pide confirmación antes de reemplazar lo cargado.
- Persistencia local y restablecimiento (la demo vuelve a estar vacía).

## Alcance excluido

Autenticación real, base de datos externa, mensajería privada, videollamadas, correos, integraciones con WhatsApp, Instagram, Canva o Trello, almacenamiento de archivos, reputación, pagos, estadísticas avanzadas, múltiples organizaciones e inteligencia artificial.

## Roles

| Rol | Cómo ingresa | Puede |
|---|---|---|
| Emprendimiento | Formulario "Postular mi comercio" o eligiendo a alguien ya cargado | Postular y seguir proyectos, conversar con el docente, revisar entregables, escribir la devolución final |
| Estudiante | Formulario "Postularme como estudiante" o eligiendo a alguien ya cargado | Ver proyectos abiertos y postularse, crear y editar tareas, mover las propias hasta En revisión, comentar, registrar entregables, escribir la reflexión del equipo |
| Supervisor docente | Entra directo | Revisar postulaciones, aceptar estudiantes, armar equipos y coordinar, supervisar, observar, evaluar y cerrar proyectos |
| Administrador de demostración | Entra directo | Ver todo, hacer pruebas y restablecer |

Los permisos se simulan en la interfaz y en los servicios; no son un sistema de seguridad.

## Formularios

- **Comercio:** nombre del comercio, emprendimiento o Pyme; rubro; localidad; persona a cargo; teléfono; correo (opcional); redes y sitio web (opcionales); dónde vende hoy (opcional); título y descripción del proyecto; resultado esperado (opcional); tipo de ayuda; plazo; horario de contacto (opcional); aceptación de las condiciones.
- **Estudiante:** nombre y apellido; correo; teléfono (opcional); año de cursada; horas semanales; habilidades; otras habilidades, experiencia y motivación (opcionales); redes y portafolio (opcionales); aceptación de las condiciones.
- Los formularios avisan que no envían datos a ningún servidor y sugieren usar datos ficticios. Validan teléfono, correo y enlaces (solo http o https) y llevan el foco al primer error.

## Reglas funcionales

- Estados de la postulación del comercio: Recibida, En revisión, Se pidió más información, Aprobada y No aprobada. Las etapas Equipo asignado, En desarrollo y Entregada se derivan del proyecto.
- Pedir información o no aprobar exige un mensaje del docente.
- Un proyecto aprobado está abierto mientras tenga lugares; al completarse deja de aparecer en Proyectos abiertos. Un estudiante no puede postularse dos veces al mismo proyecto.
- Quitar a un estudiante del equipo deja sus tareas sin responsable; puede volver a postularse.
- Las tareas nacen en Pendiente; un estudiante solo mueve las suyas y no puede marcarlas Finalizadas.
- Pedir correcciones exige una observación del supervisor.
- Cerrar el proyecto exige todas las tareas Finalizadas; agregar una tarea a un proyecto cerrado lo reabre.
- Los enlaces se validan y se abren en otra pestaña de forma segura.
- Cada comentario registra autor, rol, contenido y fecha y hora.
- Los cambios se guardan en `localStorage`; las acciones destructivas piden confirmación. Si cambia la estructura de los datos, lo guardado se descarta con un aviso.

## Datos

- La demo arranca vacía. Solo existen el docente y el administrador de demostración.
- El caso de ejemplo es **ficticio** (un vivero, tres estudiantes, un docente y 8 tareas). Sus estados, comentarios, devoluciones, perfiles y evaluación final son simulados y se marcan como "Dato simulado", sin fecha.
- No se incluyen personas, comercios, teléfonos, direcciones, usuarios de redes ni enlaces de proyectos reales. Los dos entregables del ejemplo apuntan a las páginas de inicio de Trello y Canva.
- Lo que escribe cada persona queda solo en su navegador.

## Herramientas

Trello, Google Drive, Google Docs y Canva (las del piloto, sin Instagram) y, además, Google Calendar, Google Sheets, Google Forms, Figma (categoría Diseño, junto con Canva), Google Meet, WhatsApp Business, Meta Business Suite y Perfil de Empresa de Google. Todas gratuitas o con plan gratuito, con su logo, para qué sirven y enlace. Los logos pertenecen a sus marcas.

## Requisitos no funcionales

- Funciona en navegadores de escritorio y móviles (verificado desde 375 px, con paneles plegables y tablero deslizable).
- Accesibilidad básica: etiquetas, texto alternativo, estados con texto e ícono, títulos distintos por pantalla. La navegación por teclado se apoya en elementos nativos, pero **falta una verificación completa** (orden de tabulación, foco y lector de pantalla).
- Avisos visibles: en la bienvenida, el ingreso, cada formulario y la cabecera se aclara que es una demostración, que los permisos son simulados, que lo cargado queda en el navegador, que los formularios no son una postulación real y que no se usen datos personales reales.
- Sitio estático publicable en GitHub Pages.
