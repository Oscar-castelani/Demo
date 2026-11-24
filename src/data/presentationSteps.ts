import type { DemoState, Role } from '../types'

export interface PresentationStep {
  n: number
  title: string
  role: Role
  /** Persona ficticia con la que se actúa en este paso; null si el paso es un formulario público. */
  userName: string | null
  /** Qué se muestra y qué se hace en este paso. */
  objective: string
  route: (state: DemoState) => string
}

const project = (s: DemoState, tab: string) => `/app/proyectos/${s.projects[0]?.id ?? ''}?tab=${tab}`

/** Los nueve pasos del recorrido, que coinciden con los de la guía y con los escenarios. */
export const PRESENTATION_STEPS: PresentationStep[] = [
  { n: 1, role: 'business', userName: null, title: 'El comercio carga los datos de su proyecto',
    objective: 'Mostrar el formulario de postulación: datos del comercio, contacto y descripción del proyecto.',
    route: () => '/postular/comercio' },
  { n: 2, role: 'supervisor', userName: 'Docente de demostración', title: 'El docente supervisa la postulación del comercio',
    objective: 'Revisar el proyecto: comenzar la revisión, pedir más información, aprobar (se abre a los estudiantes) o no aprobar.',
    route: () => '/app/postulaciones' },
  { n: 3, role: 'student', userName: null, title: 'El estudiante crea su perfil',
    objective: 'Mostrar el formulario del estudiante: datos, disponibilidad y habilidades.',
    route: () => '/postular/estudiante' },
  { n: 4, role: 'student', userName: 'Lucía Fernández', title: 'El estudiante se postula a un proyecto abierto',
    objective: 'Ver los proyectos abiertos con sus lugares libres y postularse con un mensaje.',
    route: () => '/app/abiertos' },
  { n: 5, role: 'supervisor', userName: 'Docente de demostración', title: 'El docente arma el equipo',
    objective: 'Ver los perfiles y sus habilidades, aceptar estudiantes y designar quién coordina.',
    route: () => '/app/equipos' },
  { n: 6, role: 'student', userName: 'Mateo Gómez', title: 'El equipo crea las tareas',
    objective: 'En el tablero, crear tareas, asignar responsables y moverlas.',
    route: (s) => project(s, 'board') },
  { n: 7, role: 'supervisor', userName: 'Docente de demostración', title: 'El equipo trabaja y el docente revisa las tareas',
    objective: 'Revisar la tarea en revisión: dejar una observación y aprobar o pedir correcciones.',
    route: (s) => project(s, 'board') },
  { n: 8, role: 'student', userName: 'Lucía Fernández', title: 'El estudiante registra entregables y el comercio los revisa',
    objective: 'Registrar un entregable (un enlace); después el comercio lo aprueba o pide cambios.',
    route: (s) => project(s, 'deliverables') },
  { n: 9, role: 'supervisor', userName: 'Docente de demostración', title: 'El docente evalúa y cierra el proyecto',
    objective: 'Registrar el estado de cumplimiento y las observaciones finales, y cerrar el proyecto.',
    route: (s) => project(s, 'closure') },
]

export const PRESENTATION_TOTAL = PRESENTATION_STEPS.length

/** Aclaración de lo que se verá en la pantalla siguiente, para que quien mira sepa que cambia el rol. */
export function nextStepHint(n: number): string {
  const next = PRESENTATION_STEPS[n]
  if (!next) return 'Es el último paso: el proyecto queda cerrado.'
  const text = next.title.charAt(0).toLowerCase() + next.title.slice(1)
  return `En la siguiente pantalla veremos que ${text}.`
}
