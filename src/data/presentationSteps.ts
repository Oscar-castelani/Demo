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
  { n: 1, role: 'business', userName: null, title: 'El comercio presenta su proyecto',
    objective: 'Mostrar el formulario de postulación: datos del comercio, contacto y descripción del proyecto.',
    route: () => '/postular/comercio' },
  { n: 2, role: 'supervisor', userName: 'Docente de demostración', title: 'El docente revisa la postulación',
    objective: 'Revisar el proyecto: comenzar la revisión, pedir más información, aprobar (se abre a los estudiantes) o no aprobar.',
    route: () => '/app/postulaciones' },
  { n: 3, role: 'student', userName: null, title: 'El estudiante crea su perfil',
    objective: 'Mostrar el formulario del estudiante: datos, disponibilidad y habilidades.',
    route: () => '/postular/estudiante' },
  { n: 4, role: 'student', userName: 'Lucía Fernández', title: 'El estudiante se postula a un proyecto',
    objective: 'Ver los proyectos abiertos con sus lugares libres y postularse con un mensaje.',
    route: () => '/app/abiertos' },
  { n: 5, role: 'supervisor', userName: 'Docente de demostración', title: 'El docente arma el equipo',
    objective: 'Ver los perfiles y sus habilidades, aceptar estudiantes y designar quién coordina.',
    route: () => '/app/equipos' },
  { n: 6, role: 'student', userName: 'Mateo Gómez', title: 'El equipo crea las tareas',
    objective: 'En el tablero, crear tareas, asignar responsables y moverlas.',
    route: (s) => project(s, 'board') },
  { n: 7, role: 'supervisor', userName: 'Docente de demostración', title: 'Se trabaja y el docente revisa',
    objective: 'Revisar la tarea en revisión: dejar una observación y aprobar o pedir correcciones.',
    route: (s) => project(s, 'board') },
  { n: 8, role: 'student', userName: 'Lucía Fernández', title: 'Se registran y revisan los entregables',
    objective: 'Registrar un entregable (un enlace); después el comercio lo aprueba o pide cambios.',
    route: (s) => project(s, 'deliverables') },
  { n: 9, role: 'supervisor', userName: 'Docente de demostración', title: 'El docente evalúa y cierra el proyecto',
    objective: 'Registrar el estado de cumplimiento y las observaciones finales, y cerrar el proyecto.',
    route: (s) => project(s, 'closure') },
]

export const PRESENTATION_TOTAL = PRESENTATION_STEPS.length
