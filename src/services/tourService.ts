import type { DemoState, Project, Role } from '../types'

export interface TourStep {
  /** Número del paso (1 a 9) para mostrar el avance del recorrido. */
  number: number
  text: string
  /** Rol que tiene que actuar en este paso. */
  role: Role
  /** Pantalla donde se hace la acción. */
  to: string
  cta: string
  done?: false
}

export const TOUR_TOTAL = 9

/** Último proyecto creado: es el que sigue el recorrido guiado. */
function currentProject(state: DemoState): Project | undefined {
  return state.projects[state.projects.length - 1]
}

/**
 * Indica cuál es el próximo paso lógico de la demo según lo que ya pasó. Devuelve null cuando el
 * recorrido terminó (el proyecto está cerrado).
 */
export function nextTourStep(state: DemoState): TourStep | null {
  const apps = state.applications
  if (apps.length === 0) {
    return { number: 1, role: 'business', to: '/postular/comercio', cta: 'Postular un comercio',
      text: 'Un comercio presenta su proyecto. Ingresá como comercio y completá el formulario.' }
  }
  if (apps.some((a) => a.status === 'info_requested')) {
    return { number: 2, role: 'business', to: '/app/postulaciones', cta: 'Responder al docente',
      text: 'El docente pidió más información. Ingresá como comercio y respondé en la conversación.' }
  }
  if (apps.some((a) => a.status === 'received' || a.status === 'in_review')) {
    return { number: 2, role: 'supervisor', to: '/app/postulaciones', cta: 'Revisar postulaciones',
      text: 'Un docente revisa el proyecto: puede aprobarlo, pedir más información o no aprobarlo.' }
  }

  const project = currentProject(state)
  if (!project) {
    return { number: 2, role: 'supervisor', to: '/app/postulaciones', cta: 'Revisar postulaciones',
      text: 'La postulación no fue aprobada. Cargá otro proyecto como comercio o aprobá una postulación como docente.' }
  }
  if (project.status === 'closed') return null

  const tasks = state.tasks.filter((t) => t.projectId === project.id)
  const deliverables = state.deliverables.filter((d) => d.projectId === project.id)
  const pendingInterests = state.interests.filter((i) => i.projectId === project.id && i.status === 'pending')

  if (project.memberIds.length === 0) {
    if (pendingInterests.length > 0) {
      return { number: 5, role: 'supervisor', to: '/app/equipos', cta: 'Armar el equipo',
        text: 'Hay estudiantes postulados. Ingresá como docente, aceptalos y armá el equipo.' }
    }
    if (state.studentProfiles.length === 0) {
      return { number: 3, role: 'student', to: '/postular/estudiante', cta: 'Postularme como estudiante',
        text: 'El proyecto está abierto. Ingresá como estudiante y completá tu perfil con tus habilidades.' }
    }
    return { number: 4, role: 'student', to: '/app/abiertos', cta: 'Ver proyectos abiertos',
      text: 'Ingresá como estudiante y postulate al proyecto abierto. El docente también puede sumar estudiantes.' }
  }
  if (!project.coordinatorId) {
    return { number: 5, role: 'supervisor', to: '/app/equipos', cta: 'Elegir coordinador',
      text: 'El equipo ya tiene integrantes. Ingresá como docente y designá quién coordina.' }
  }
  if (tasks.length === 0) {
    return { number: 6, role: 'student', to: `/app/proyectos/${project.id}?tab=board`, cta: 'Crear tareas',
      text: 'Ingresá como estudiante del equipo y creá las tareas en el tablero.' }
  }
  if (tasks.some((t) => t.status === 'in_review')) {
    return { number: 7, role: 'supervisor', to: `/app/proyectos/${project.id}?tab=board`, cta: 'Revisar tareas',
      text: 'Hay tareas en revisión. Ingresá como docente, dejá una observación y aprobá o pedí correcciones.' }
  }
  if (tasks.some((t) => t.status !== 'done')) {
    return { number: 7, role: 'student', to: `/app/proyectos/${project.id}?tab=board`, cta: 'Ir al tablero',
      text: 'Ingresá como estudiante y avanzá las tareas hasta enviarlas a revisión.' }
  }
  if (deliverables.length === 0) {
    return { number: 8, role: 'student', to: `/app/proyectos/${project.id}?tab=deliverables`, cta: 'Registrar entregable',
      text: 'Las tareas están listas. Ingresá como estudiante y registrá un entregable con su enlace.' }
  }
  if (deliverables.some((d) => d.reviewStatus === 'pending')) {
    return { number: 8, role: 'business', to: `/app/proyectos/${project.id}?tab=deliverables`, cta: 'Revisar entregables',
      text: 'Hay entregables esperando. Ingresá como comercio y aprobalos o pedí modificaciones.' }
  }
  return { number: 9, role: 'supervisor', to: `/app/proyectos/${project.id}?tab=closure`, cta: 'Cerrar el proyecto',
    text: 'Todo está entregado. Ingresá como docente, registrá la evaluación final y cerrá el proyecto.' }
}
