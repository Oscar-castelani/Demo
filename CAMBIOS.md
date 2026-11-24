# Registro de cambios

## Fase 1 – Preparación del proyecto (en curso)

- Proyecto creado con React, TypeScript y Vite; ESLint configurado.
- Estructura de carpetas según la especificación.
- Tipos de datos definidos en `src/types/index.ts`; los datos inventados llevan el campo `simulated`.
- `HashRouter` para compatibilidad con GitHub Pages; `base` de Vite `/Demo/` (nombre del repositorio).
- Página de inicio con la paleta y la tipografía (Plus Jakarta Sans) tomadas de la imagen de referencia. La ilustración es provisional y no constituye una identidad de marca aprobada.
- Los documentos de contexto se movieron a `docs-privados/`, excluido de Git.
- Pendiente: revisión y aprobación de la Fase 1 antes de pasar a la Fase 2.

## Fase 2 – Datos y persistencia

- Datos iniciales de ejemplo: 6 usuarios de demostración, 1 comercio, 1 proyecto, 8 tareas y 2 entregables (reemplazados después por un caso ficticio; ver "Caso de ejemplo ficticio").
- Estados, comentarios, devoluciones y evaluación final son simulados y están marcados como tales. Sin fechas visibles y sin datos personales.
- `storageService`: carga, guardado y restablecimiento; maneja datos dañados, versión de esquema distinta y fallos de almacenamiento.
- `DemoContext` guarda cada cambio al aplicarlo.
- Verificado en el navegador: carga inicial, persistencia, datos dañados, versión antigua, restablecimiento y copias independientes del estado inicial.
- Pendiente: confirmar con la UI de la Fase 3 que un cambio sobrevive a recargar la página.

## Fase 3 – Navegación y paneles

- Bienvenida (`WelcomePage`, antes `HomePage`) con acceso a la demo.
- Selector de rol y usuario (`#/ingresar`); se puede cambiar de usuario sin perder los cambios locales. El usuario activo se conserva al recargar.
- Estructura de la app (`AppLayout`) con rol activo visible, cambio de usuario y restablecimiento con confirmación.
- Ruta `#/app` protegida: sin usuario elegido redirige al selector.
- Paneles por rol (estudiante, emprendimiento, supervisor, administrador) con estados vacíos; los estados se distinguen por texto e ícono, no solo por color.
- Enlaces de entregables validados (solo http/https) y abiertos con `rel="noopener noreferrer"`.
- `Business` incorpora `ownerId`; versión de esquema de datos 2.
- Verificado en el navegador: los 4 roles, redirección, persistencia del usuario tras recargar, diálogo de restablecer (cancelar y confirmar) y ancho de 375 px sin desborde. Build y lint sin errores.
- Pendiente: Fase 4 (proyectos y tareas). Los cambios de datos reales se probarán desde ahí.

## Ajustes de la página de inicio

- Se quitaron las olas celestes y se rehízo "Cómo funciona" en 4 pasos, según el ejemplo del equipo.
- Se incorporaron 5 fotografías provistas por el equipo (`src/assets/images/`): una en el bloque principal y una por paso. Reemplazan la ilustración y los íconos provisionales.
- Pendiente: confirmar el origen y la licencia de las fotografías antes de publicar el repositorio. La foto del monitor con "social wall" que se compartió no se usó.

## Fase 4 – Proyectos y tareas

- Listado de proyectos y detalle con pestañas Resumen y Tablero de tareas; acceso solo a los proyectos del usuario activo.
- Tablero con 4 columnas (Pendiente, En proceso, En revisión, Finalizada); tarjetas con título, responsable, estado, fecha límite opcional y cantidad de comentarios.
- Crear y editar tareas (título, descripción, responsable, fecha límite opcional) con validaciones accesibles; las tareas nuevas nacen en Pendiente con id único.
- Cambio de estado según el rol y registro en el historial de la tarea, con confirmación en pantalla.
- Lógica en `taskService` (con permisos) y en `DemoContext`; la interfaz solo despacha acciones.
- Verificado en el navegador: crear, validar, editar, mover estados, aprobar o pedir correcciones como supervisor, solo lectura para el comercio, persistencia tras recargar, restablecimiento y 375 px sin desborde. Build y lint sin errores.
- Decisión abierta: el proyecto de demostración figura "Cerrado" pero permite agregar tareas; el cierre se tratará en la Fase 6.

## Fase 5 – Comentarios y entregables

- Comentarios en tareas y en entregables, con autor, rol y fecha y hora (los datos simulados muestran la etiqueta en lugar de la fecha).
- Registro de entregables como enlaces validados (http/https), con tipo de recurso y vínculo opcional a una tarea; adjuntar enlace desde el detalle de la tarea. Las tarjetas muestran el indicador de entregables.
- Revisión de entregables por el emprendimiento: aprobar o solicitar modificaciones (devolución obligatoria); reenvío a revisión por quien lo registró.
- Pestañas Entregables y Actividad en el detalle del proyecto; el historial incluye tareas y entregables, con los movimientos reales primero.
- `Deliverable` incorpora `history` y `taskId`; versión de esquema de datos 3.
- Corrección: los diálogos cerrados por código ya no disparan el cierre de quien los abrió (el detalle de la tarea no se reabría al volver del formulario).
- Verificado en el navegador: validación de enlaces, comentarios, vínculo con tareas, flujo completo de revisión entre comercio, estudiantes y docente, orden de la actividad y ausencia de desborde horizontal (el emulador móvil midió 470 px, no 375 px). Build y lint sin errores.

## Publicación

- Se agregó el flujo de GitHub Actions que compila (`lint` y `build`) y publica `dist/` en GitHub Pages. Antes, Pages servía el `index.html` de desarrollo sin compilar, por eso la página aparecía en blanco.
- Requiere cambiar Settings → Pages → Source a "GitHub Actions".

- Corrección de la publicación: `npm ci` fallaba en GitHub Actions (Node 22 y npm 10) porque faltaban `@emnapi/core` y `@emnapi/runtime` en `package-lock.json`. Se agregaron como dependencias de desarrollo. Reproducido y verificado localmente con Node 22 y npm 10: instalación, lint y build correctos.

## Fase 6 – Supervisión docente y cierre

- Panel `#/app/supervision` con resumen, tareas por estado, avance por integrante (tabla accesible), tareas pendientes de revisión con acceso directo a la tarea, entregables, comentarios recientes y actividad del equipo.
- Observación obligatoria del supervisor al solicitar correcciones; opcional al aprobar. Se registra como comentario con su rol.
- Cierre y evaluación final: estado de cumplimiento, devolución del emprendimiento, observaciones del supervisor y reflexión del equipo, editables por rol. Los textos de ejemplo pierden la etiqueta "Dato simulado" al editarse.
- Cerrar o reabrir el proyecto (supervisor y administrador); cerrar exige tareas Finalizadas y agregar una tarea reabre el proyecto (resuelve la decisión abierta de la Fase 4).
- `ProjectClosure` usa `simulatedFields`; versión de esquema de datos 4.
- Corrección: las pestañas del proyecto desbordaban en pantallas angostas (ahora se acomodan en varias líneas).
- Verificado en el navegador: flujo crear, enviar a revisión, pedir correcciones con y sin observación, reenviar, aprobar y cerrar; permisos del comercio y del docente sobre el cierre; 375 px sin desborde en las 5 pestañas. Build y lint sin errores.

## Fase 7 – Pruebas y ajustes

- Se ejecutaron los 10 recorridos de aceptación, casos límite y una auditoría básica de accesibilidad; resultados en `PRUEBAS.md`.
- Corrección: la pantalla de ingreso ahora tiene región `main`.
- Corrección: se eliminaron los saltos de encabezado (h1 a h3) en proyectos, tablero y entregables.
- Mejora: título de la pestaña distinto por pantalla (`useDocumentTitle`).
- Se agregaron `REQUISITOS.md`, `ARQUITECTURA.md` y `PRUEBAS.md`.

## Ajuste de la versión móvil

- Nueva hoja `src/styles/mobile.css`: tipografía, espacios y encabezados compactos en pantallas de hasta 640 px.
- Paneles plegables (`Collapsible`, basado en `<details>`): en el celular arrancan cerrados salvo los principales; en escritorio arrancan abiertos.
- Tablero con columnas deslizables en horizontal (con aviso), pestañas del proyecto en una sola fila deslizable, pasos de la bienvenida en formato compacto con miniatura y diálogos casi a pantalla completa.
- Altura de las pantallas a 375 px (en pantallas de 812 px de alto): bienvenida de 7,0 a 3,9; supervisión de 3,6 a 1,4; panel del supervisor de 2,9 a 1,0; tablero de 2,8 a 1,8. Sin desborde horizontal.

## Rediseño: postulaciones (etapa 2)

- La demo **arranca vacía** (solo existen el docente y el administrador de demostración). El botón **Cargar ejemplo** carga un caso de ejemplo, con confirmación si ya hay datos. Restablecer deja la demo vacía.
- **El formulario es la identidad**: el comercio y el estudiante se postulan y quedan identificados con esos datos; después se puede volver a entrar eligiendo entre las personas ya cargadas.
- Formulario del comercio (`#/postular/comercio`): nombre, rubro, localidad, persona a cargo, teléfono, correo, redes opcionales, dónde vende hoy, título y descripción del proyecto, resultado esperado, tipo de ayuda, plazo, horario y aceptación de condiciones.
- Formulario del estudiante (`#/postular/estudiante`): nombre, correo, teléfono opcional, año, horas semanales, habilidades, experiencia, motivación, redes opcionales y aceptación de condiciones.
- Los formularios avisan que no envían datos a ningún servidor y sugieren datos ficticios; validan teléfono, correo y enlaces (solo https) y llevan el foco al primer error.
- `Mis postulaciones` (comercio): seguimiento en 6 etapas (Recibida, En revisión, Aprobada, Equipo asignado, En desarrollo, Entregada), conversación con el docente y la posibilidad de postular otro proyecto. Las etapas posteriores a la aprobación se derivan del proyecto.
- `Postulaciones` (docente): comenzar revisión, pedir información (mensaje obligatorio), aprobar (crea el proyecto con la cantidad de lugares elegida) o no aprobar (mensaje obligatorio); filtro por estado.
- `Proyectos abiertos` (estudiante): proyectos aprobados con lugares libres, postulación con mensaje opcional y seguimiento de sus postulaciones; su perfil visible.
- Nuevos tipos: `ProjectApplication`, `StudentProfile`, `ProjectInterest`; `Business` suma teléfono, correo y redes; `Project` suma `maxMembers` y `applicationId`. Versión de esquema de datos 5.
- Pendiente (etapa 3): que el docente acepte o rechace las postulaciones de estudiantes y arme los equipos; hoy quedan "Pendiente de respuesta".

## Rediseño: equipos del docente (etapa 3)

- Nueva pantalla `#/app/equipos` (docente y administrador) con una sección por proyecto: equipo actual, postulaciones de estudiantes y estudiantes con perfil.
- Aceptar o no aceptar postulaciones de estudiantes; sumar a un estudiante directamente (sus postulaciones pendientes pasan a aceptadas); quitar del equipo (sus tareas quedan sin responsable, con registro en el historial, y puede volver a postularse).
- Designar o quitar al estudiante que coordina el equipo; el aviso pide definirlo mientras falte. En el ejemplo ya hay un coordinador.
- Cambiar la cantidad de lugares (1 a 6, sin bajar de los integrantes). Mientras haya lugar el proyecto está abierto a postulaciones; al completarse deja de aparecer en Proyectos abiertos.
- Filtro por habilidad sobre las postulaciones y los perfiles; cada perfil muestra habilidades, año, disponibilidad, contacto, experiencia, motivación y redes.
- El proyecto muestra quién coordina; el panel del docente indica cuántas postulaciones de estudiantes esperan respuesta.
- Nuevo estado de postulación de estudiante: "Salió del equipo". Nueva lógica en `teamService` con permisos aplicados también en el servicio.
- Verificado en el navegador: aceptar, sumar, quitar, coordinador, ampliar lugares, filtro, tareas sin responsable, volver a postularse y 375 px sin desborde. Build y lint sin errores.

## Rediseño: herramientas y guía del recorrido (etapa 4)

- Sección **Herramientas** en la bienvenida y en la aplicación: Trello, Google Drive, Google Docs y Canva (las del piloto, sin Instagram) más Google Calendar, Sheets, Forms, Meet, WhatsApp Business, Meta Business Suite y Perfil de Empresa de Google; todas gratuitas o con plan gratuito, con logo, uso y enlace seguro.
- Los logos vienen del paquete `simple-icons` (CC0), que se instaló con tu autorización; Canva y el Perfil de Empresa de Google no existen en ese paquete y llevan un símbolo genérico propio.
- **Guía del recorrido**: indica el próximo paso (9 pasos), qué rol debe actuar y lleva a esa pantalla; se puede ocultar. `tourService` decide el paso según el estado.
- El selector de rol admite `?rol=` para llegar con el rol elegido.
- El menú de la bienvenida (6 opciones) ya no se parte en dos líneas en pantallas medianas.
- Documentación actualizada: `REQUISITOS.md`, `ARQUITECTURA.md` y `PRUEBAS.md` reflejan el nuevo alcance.

## Caso de ejemplo ficticio

- El caso de ejemplo ya no usa ningún dato real: comercio (*Vivero Raíces*, de ejemplo), persona a cargo, tres estudiantes, docente, 8 tareas y entregables son inventados y están marcados como simulados.
- Los entregables del ejemplo apuntan a las páginas de inicio de Trello y Canva, no a proyectos reales.
- Se quitó de la interfaz, los datos y la documentación cualquier mención a personas, comercios o enlaces del proyecto real de la prueba piloto.

## Herramientas: Figma

- Se agregó **Figma** a la categoría **Diseño**, junto con Canva (plan gratuito, con logo oficial de `simple-icons` y enlace seguro). La sección pasa a tener 12 herramientas.

## Documentación y avisos (M09 y M08 del documento de mejoras)

- `README.md` reescrito y ordenado: enlace a la demo en línea (verificado, responde 200), aviso de que es una demostración y no una postulación real, tabla de rutas completa (postulaciones, proyectos abiertos, equipos, supervisión, herramientas y los dos formularios), roles y documentación.
- El aviso de la cabecera ya no dice "datos simulados" (la demo arranca vacía): ahora aclara que los permisos son simulados, que lo cargado queda en el navegador y que no se usen datos personales reales.
- Aviso visible en la bienvenida, en el ingreso y en cada formulario: es una demostración, no una postulación real, y no se deben cargar datos personales reales.
- `GUIA_DE_LA_DEMO.md` suma el límite "no es una postulación real".

## Escenarios reproducibles (M07)

- Nuevo `src/data/scenarios.ts`: 10 escenarios (uno por paso de la guía, más el proyecto finalizado) construidos con los servicios de la aplicación, todo ficticio y marcado como simulado.
- En el ingreso, `Escenarios para probar una parte del recorrido` (plegado por defecto) ofrece cinco: Proyecto recién postulado, Estudiantes postulados, Equipo armado sin tareas, Tareas esperando revisión y Listo para cerrar. Piden confirmación si hay datos y avisan que sigan la guía. El proyecto finalizado sigue en **Cargar ejemplo**.
- Los demás escenarios (Proyecto aprobado y abierto, Estudiantes con perfil y Tareas listas sin entregables) no se listan: los usará el modo presentación (M01).
- Lo que se hace después de cargar un escenario es real: tiene fecha y se distingue de lo simulado.

## Panel del docente: estudiantes y equipos

- El panel de inicio del docente muestra **Estudiantes postulados** y **Equipos armados**. Cada nombre abre sus **habilidades principales** al pasar el mouse, al enfocarlo con el teclado (Escape lo cierra) o al tocarlo en el celular; también se anuncian a los lectores de pantalla.
- La lista indica dónde está cada estudiante (en el equipo de un proyecto, postulado a un proyecto o con perfil sin proyecto). Cada equipo muestra el proyecto, el comercio, los integrantes, los lugares y quién coordina.
- Si no hay estudiantes o equipos, se muestra un **ejemplo ilustrativo** rotulado (del caso ficticio), sin cargarlo en la demo, con un botón para cargar el ejemplo completo. Se reemplaza solo cuando hay datos reales. Se quitó el panel "Estudiantes participantes", que quedó incluido.

## Dos caminos de entrada y modo presentación (M02 y M01)

- La pantalla de ingreso ofrece dos caminos rotulados: **Explorar un proyecto completo** (carga el caso ficticio terminado) y **Crear un proyecto desde cero** (demo vacía y formulario del comercio). Con datos cargados piden confirmación; sin datos no hay nada que perder. Reemplazan al bloque "Cargar ejemplo" anterior. Los roles quedan debajo ("O elegí un rol directamente") y los escenarios, plegados al final.
- **Modo presentación**: barra al pie con el paso (de 9), el rol que actúa, la persona ficticia, el objetivo y si el paso parte de un escenario simulado; Anterior, Siguiente, Ir a la pantalla y Salir (Terminar en el paso 9). Cada paso carga su escenario, deja activa a la persona correcta y lleva a la pantalla. Pide confirmación al activarse si hay datos; no vuelve a preguntar entre pasos. Se desactiva sin perder lo cargado, y la preferencia sobrevive a recargar la página.
- Durante la presentación se oculta la guía normal del recorrido (la barra ya cumple esa función). En el celular el detalle del paso arranca plegado (barra de unos 150 px).
- Corrección encontrada al probar: al volver de una pantalla protegida a un formulario público el sitio redirigía al ingreso; se resolvió dejando activo al docente de demostración en los pasos con formulario.

## Alertas del docente y línea de tiempo (M03 y M05)

- **Alertas** en el panel de inicio del docente y en Supervisión: tareas vencidas (fecha límite pasada y sin finalizar), entregables con cambios solicitados, tareas esperando revisión y tareas sin responsable. Cada una enlaza a la tarea (se abre su detalle) o a los entregables. No se calcula "integrantes sin actividad": con fechas simuladas no sería confiable.
- El escenario "Tareas esperando revisión" ahora trae una tarea con fecha límite vencida (relativa a hoy) y una sin responsable, para que el docente vea las alertas.
- **Línea de tiempo** en el detalle de cada tarea y entregable y en la pestaña Actividad: eventos automáticos y comentarios diferenciados con texto y forma, con quién, rol y fecha; los simulados muestran la etiqueta y no una fecha. Se omite el evento redundante "Agregó un comentario".
- Al pedir correcciones o revisar un entregable, el evento se registra antes que la observación, para que la historia se lea en orden (entrega, observación, corrección, reenvío, aprobación).
- Se quitó el bloque "Historial de cambios" de la tarea (queda integrado en la línea de tiempo) y la lista de actividad se reemplazó por la línea de tiempo.

## Accesibilidad, teclado y permisos (M11)

- Se verificó con **teclas reales** el teclado, el foco y los diálogos; se encontraron y corrigieron tres faltantes: no había enlace para saltar al contenido, el foco no se movía al cambiar de pantalla y las pestañas del proyecto no respondían a las flechas.
- Nuevo `SkipLink` ("Saltar al contenido"), `RouteFocus` (foco al título al cambiar de ruta) y patrón de pestañas con flechas, Inicio y Fin; los `<main>` pasan a ser enfocables por código.
- Contraste: 16 combinaciones de colores en uso, todas por encima de los mínimos WCAG; el turquesa claro solo se usa en texto grande o decorativo.
- Matriz de permisos a nivel de lógica (sin pasar por la interfaz): 56 acciones probadas por rol, todas con el resultado esperado.

## Resumen exportable en Markdown (M06)

- Nuevo botón **Descargar resumen (.md)** en el detalle del proyecto. Genera `resumen-<proyecto>.md` en el navegador (sin servidor) con datos generales, equipo y habilidades, avance, tareas, entregables, observaciones del docente y devoluciones del comercio, evaluación final y línea de tiempo.
- Marca lo simulado como *(dato simulado)* sin fecha; lo hecho en la demo lleva fecha y hora. El estado de una tarea o entregable figura como simulado solo si su último movimiento lo es (corregido al probar: una tarea cambiada por una acción real aparecía como simulada). No incluye teléfonos ni correos.
- Solo Markdown: el PDF requeriría una dependencia nueva.

## Correcciones tras la prueba de usabilidad con personas (simulada)

- La guía del recorrido cambia de usuario y lleva directo a la pantalla cuando ya hay alguien con el rol que toca (antes obligaba a pasar por el ingreso). El ingreso también respeta `?rol=` si ya estabas en esa pantalla.
- "Responder al docente" lleva al campo de la conversación y le da el foco.
- Postulaciones: los controles de decisión del docente van arriba de la conversación para que no se muevan al enviar un mensaje; el campo se llama "Mensaje del docente que acompaña tu decisión" para distinguirlo de "Agregar comentario".
- Equipos: las postulaciones de estudiantes van primero.
- Enlace a la encuesta de usabilidad (formulario externo de Google, sin datos personales) en la bienvenida y al pie de la app.
- Panel del docente: con datos ilustrativos, los títulos dicen «(ejemplo)» en lugar de un número que parecía real.
- Estudiante: tras postularse, un aviso explica qué pasa ahora (el docente revisa; si lo aceptan, el proyecto aparece en «Mis proyectos»).
- Formulario del comercio: ejemplo y ayuda en «¿Qué resultado esperan?» y en «Tipo de ayuda».
- El logo de la cabecera de la app vuelve a la página de inicio.

## Páginas separadas y sin recorrido guiado

- Se quitó la guía del recorrido (cuadro con los 9 pasos): para esta etapa no hace falta y en el celular no se resolvía bien. El modo presentación sigue como estaba.
- Cada opción del menú (Cómo funciona, Beneficios, Herramientas, Demo, Sobre el proyecto) es ahora una página propia en lugar de una sección más abajo en la misma pantalla. Inicio queda solo con la portada.
- Pantalla de ingreso: se quitaron las opciones «Explorar un proyecto completo» y «Crear un proyecto desde cero». Bajo «¿Cómo querés recorrer la demo?» solo queda el subtítulo «Elegí el rol» con los cuatro roles.
- Formulario de usabilidad (Google Forms): se eliminaron las 3 respuestas simuladas, se quitó la pregunta «Tipo de respuesta» y se reescribió la descripción para uso real. Se agregaron «¿Desde qué dispositivo probaste la demo?», «¿Pudiste cumplir tu tarea sin ayuda?» y «¿Qué fue lo que más te gustó?», y las preguntas abiertas llevan un ejemplo de respuesta.
- Modo presentación: la barra ya no empieza con «paso N de 9» (daba a entender que siempre actúa el mismo rol). Ahora el título dice quién hace qué («El comercio carga los datos de su proyecto», «El docente supervisa la postulación del comercio», «El estudiante crea su perfil»…) y entre paréntesis avisa qué se verá en la siguiente pantalla. El número de paso quedó en el detalle.
