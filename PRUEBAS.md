# Pruebas

Pruebas manuales asistidas por scripts en el navegador. Entorno: servidor de desarrollo local y sitio publicado en GitHub Pages. Fecha: 15/11/2026.

Hay dos bloques: las pruebas de la **versión 2 de la demo** (postulaciones, equipos, herramientas y guía; la que está vigente) y las de la **Fase 7**, hechas sobre la versión anterior con datos precargados.

## Versión 2: demo vacía y recorrido por rol

| Prueba | Resultado | Qué se verificó |
|---|---|---|
| Arranque vacío | Correcta | Solo existen el docente y el administrador; "Cargar ejemplo" pide confirmación si hay datos y carga 8 tareas, 6 usuarios y 3 perfiles |
| Formulario del comercio | Correcta | Validación de campos obligatorios, teléfono, correo, enlace `javascript:` rechazado y aceptación de condiciones; el foco va al primer error; al enviar queda identificado como usuario activo |
| Formulario del estudiante | Correcta | Validación de campos, habilidades, redes opcionales; crea usuario y perfil y abre "Proyectos abiertos" |
| Seguimiento de la postulación | Correcta | Etapas Recibida, En revisión, Aprobada, y derivadas del proyecto; aviso cuando se espera respuesta |
| Revisión del docente | Correcta | Comenzar revisión, pedir información (mensaje obligatorio), respuesta del comercio que vuelve a revisión, aprobar con cantidad de lugares (crea el proyecto), no aprobar |
| Proyectos abiertos | Correcta | Muestra lugares libres, evita postularse dos veces, deja de aparecer al completarse el equipo |
| Equipos | Correcta | Aceptar y no aceptar, sumar directamente, quitar (tareas sin responsable, con historial), coordinador, cambiar lugares, filtro por habilidad, volver a postularse |
| Guía del recorrido | Correcta | Los 9 pasos se suceden según el estado (de "vacío" a "proyecto cerrado" y ejemplo); ocultar y mostrar; enlace con rol preseleccionado |
| Herramientas | Correcta | 12 herramientas con logo, uso, condición gratuita y enlace seguro, en la bienvenida y en la aplicación |
| Accesibilidad | Correcta | En 9 pantallas nuevas: un `h1`, sin saltos de encabezado, una región `main`, campos con etiqueta, botones con nombre, sin `id` duplicados y título distinto |
| Móvil (375 px) | Correcta | Sin desborde horizontal en formularios, postulaciones, equipos, herramientas y paneles |

Contrastes nuevos (WCAG): texto sobre azul oscuro 13,5:1, turquesa oscuro sobre blanco 5,1:1, rojo de error 6,5:1.

## Fase 7: recorridos de aceptación (versión con datos precargados)

Estos recorridos se ejecutaron con un caso de ejemplo precargado (después reemplazado por uno ficticio, con otros nombres). Siguen siendo reproducibles con **Cargar ejemplo**. Una diferencia: desde la versión 2, "Restablecer demo" deja la demo vacía y ya no recupera los datos del ejemplo (la Prueba 9 de abajo describe el comportamiento anterior).

| # | Prueba | Resultado | Qué se verificó |
|---|---|---|---|
| 1 | Acceso | Correcta | Ingreso como estudiante, cambio a supervisor sin perder datos, rol activo visible |
| 2 | Consulta del proyecto | Correcta | Información del proyecto, integrantes, supervisor y las 8 tareas |
| 3 | Gestión de tareas | Correcta | Crear tarea (nace en Pendiente), cambiar responsable, cambiar estado; tablero y panel reflejan el cambio |
| 4 | Persistencia | Correcta | Recarga real de la página: usuario activo, 9 tareas y estado de la tarea se conservan |
| 5 | Supervisión | Correcta | Panel con tareas pendientes de revisión y avance por integrante; observación registrada como comentario |
| 6 | Revisión | Correcta | El estudiante ve la observación, edita y reenvía a revisión |
| 7 | Entregables | Correcta | Registro de enlace; visible en Entregables, supervisión y panel del emprendimiento; enlace con `target="_blank"` y `rel="noopener noreferrer"` |
| 8 | Emprendimiento | Correcta | El comercio consulta, aprueba un entregable con devolución y registra la devolución final |
| 9 | Restablecimiento | Correcta | Pide confirmación, cancelar no borra, confirmar recupera los datos iniciales y conserva el usuario |
| 10 | Publicación | Correcta | `https://oscar-castelani.github.io/Demo/`: carga, CSS, JS y 5 imágenes con código 200; navegación; recarga en una ruta interna; localStorage; sin errores de consola |

## Casos límite

| Caso | Resultado |
|---|---|
| Entrar a `#/app` sin usuario elegido | Redirige al selector |
| Ruta inexistente | Redirige a la bienvenida |
| Proyecto inexistente o sin acceso | Mensaje "Proyecto no disponible" |
| Un comercio en `#/app/supervision` | Aviso de que es para supervisores |
| Datos guardados dañados | Se restablecen y aparece un aviso |
| Almacenamiento que falla al guardar | Aparece un aviso; la interfaz sigue funcionando en memoria |
| Enlace `javascript:` o `ftp:` en un entregable | Rechazado con mensaje |
| Título de tarea vacío o comentario vacío | Rechazado con mensaje |
| Pedir correcciones sin observación | Rechazado con mensaje |
| Cerrar el proyecto con tareas abiertas | Botón deshabilitado con explicación |

## Permisos verificados

| Rol | Comprobado |
|---|---|
| Estudiante | Crea y edita tareas, mueve las propias, no marca Finalizada, no mueve tareas ajenas |
| Supervisor | Aprueba o pide correcciones, no crea ni edita tareas, no edita la devolución del emprendimiento |
| Emprendimiento | Solo consulta tareas; revisa entregables; edita solo su devolución final |
| Administrador | Acceso a todas las vistas y al restablecimiento |

## Accesibilidad básica

- Un único `h1` por pantalla, sin saltos de nivel de encabezado, una región `main` y títulos de pestaña distintos por pantalla (corregido en esta fase).
- Todos los campos tienen etiqueta, los botones y enlaces tienen nombre, las imágenes tienen texto alternativo y no hay `id` duplicados.
- Los estados se distinguen por texto e ícono, no solo por color.
- Diálogos nativos (`<dialog>`) con título asociado; las pestañas usan roles `tablist`, `tab` y `tabpanel`.
- Contraste (WCAG): texto principal 13,5:1, texto secundario 8,1:1, errores 6,5:1, enlaces y etiquetas 5,1:1. El turquesa `#0a8fb0` sobre blanco (3,8:1) se usa solo en texto grande o en negrita.

## Visualización móvil

375 px de ancho sin desborde horizontal en bienvenida, selector, panel, proyectos, supervisión y las 5 pestañas del proyecto, tanto local como publicado.

## Errores detectados y corregidos

| Fase | Error | Corrección |
|---|---|---|
| 4 | El detalle de la tarea no se reabría al volver de un formulario | `Modal` ya no avisa el cierre hecho por código |
| 5 | Orden de la actividad: los datos simulados quedaban primero | Marca de tiempo de los datos simulados anterior a la actual |
| 6 | Las pestañas del proyecto desbordaban en pantallas angostas | Se acomodan en varias líneas |
| Publicación | Página en blanco en GitHub Pages | Flujo de GitHub Actions y dependencias `@emnapi` en el lockfile |
| 7 | Pantalla de ingreso sin `main`; saltos de encabezados; título único | Corregidos |

## Limitaciones conocidas

- No hay pruebas automatizadas en el repositorio; las pruebas se hicieron manualmente con scripts en el navegador.
- No se probó con lectores de pantalla ni en dispositivos físicos; el control móvil usa la emulación del navegador.
- El contraste se calculó sobre los colores definidos, no con una herramienta externa de auditoría.
- Los cambios se conservan solo en el navegador y origen donde se hicieron.

## Escenarios (M07)

| Prueba | Resultado | Qué se verificó |
|---|---|---|
| Cada escenario coincide con su paso | Correcta | Los 10 escenarios dejan la guía exactamente en el paso que declaran (1 a 9 y finalizado) y todo lo cargado queda marcado como simulado |
| Carga con y sin datos | Correcta | Sin datos carga directo; con datos pide confirmación y cancelar no cambia nada |
| Seguir el recorrido desde un escenario | Correcta | Desde "Tareas esperando revisión" el docente pide correcciones (lo nuevo tiene fecha, lo cargado muestra "Dato simulado"); desde "Listo para cerrar" cierra el proyecto y la guía marca recorrido completo |
| Móvil (375 px) | Correcta | El selector plegado y abierto no desborda |

## Panel del docente

| Prueba | Resultado | Qué se verificó |
|---|---|---|
| Docente con la demo vacía | Correcta | Ve 3 estudiantes y 1 equipo de ejemplo rotulados como ilustrativos; el estado guardado sigue vacío |
| Habilidades en el nombre | Correcta | Oculto al inicio; visible con el mouse, el foco y el toque; se cierra al salir, con Escape y al volver a tocar; `aria-describedby` apunta al contenido. El foco real no se pudo probar porque la ventana del navegador de pruebas no tenía foco: se comprobó con eventos de foco |
| Mezcla de datos reales e ilustrativos | Correcta | Con estudiantes postulados y sin equipo, los estudiantes son reales y el equipo ilustrativo; con equipo armado, todo es real y muestra proyecto, enlace, integrantes y coordinador |
| Móvil (375 px) | Correcta | Los 5 nombres abren su habilidades dentro de la pantalla, sin desborde |

## Dos caminos y modo presentación

| Prueba | Resultado | Qué se verificó |
|---|---|---|
| Dos caminos de entrada | Correcta | Sin datos: "Empezar desde cero" va al formulario y "Cargar y explorar" carga el ejemplo. Con datos: ambos piden confirmación y cancelar no cambia nada; confirmar "desde cero" borra y va al formulario |
| Los 9 pasos hacia adelante y hacia atrás | Correcta | En cada paso la guía coincide con el número, la persona activa es la prevista, la ruta es la esperada y la pantalla correcta; Anterior está deshabilitado en el paso 1 y el paso 9 ofrece Terminar |
| Ir a la pantalla, Salir y persistencia | Correcta | Vuelve a la pantalla del paso sin cambiar datos; Salir quita la barra y conserva los datos; la barra sobrevive a recargar |
| Confirmación al activar | Correcta | Con datos pide confirmación (cancelar no activa); confirmar activa el paso 1 con la demo vacía |
| Móvil (375 px) | Correcta | Sin desborde en los pasos recorridos; barra de 148 px con el detalle plegado y de unos 267 px con el detalle abierto |

## Alertas y línea de tiempo

| Prueba | Resultado | Qué se verificó |
|---|---|---|
| Escenarios y guía | Correcta | Los 10 escenarios siguen coincidiendo con su paso tras agregar la fecha vencida y la tarea sin responsable |
| Alertas | Correcta | En "Tareas esperando revisión": 1 vencida, 1 en revisión y 1 sin responsable, con las mismas tareas del tablero; una fecha límite de hoy no cuenta como vencida; un entregable con cambios pedidos genera su alerta con enlace a Entregables |
| Enlaces y actualización | Correcta | El enlace abre la tarea correcta; al resolverla (pedir correcciones) la alerta desaparece y el panel pasa de 3 a 2 |
| Línea de tiempo del entregable | Correcta | Registró, solicitó modificaciones, comentario, volvió a enviar, aprobó y comentario, en ese orden; sin eventos redundantes; el conteo coincide |
| Línea de tiempo de la tarea | Correcta | Eventos simulados con etiqueta y sin fecha; lo nuevo con fecha; el evento antecede a la observación |
| Móvil (375 px) | Correcta | Panel, diálogo de tarea, Actividad y Supervisión sin desborde. El panel del docente ocupa ahora unas 2,6 pantallas por las alertas y los paneles de estudiantes y equipos abiertos |
