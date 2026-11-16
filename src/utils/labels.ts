import type { Fulfillment, ProjectStatus, ReviewStatus, Role, TaskStatus } from '../types'

export const ROLE_LABELS: Record<Role, string> = {
  student: 'Estudiante',
  business: 'Emprendimiento',
  supervisor: 'Supervisor docente',
  admin: 'Administrador de demo',
}

export const ROLE_DESCRIPTIONS: Record<Role, string> = {
  student: 'Participa en proyectos, gestiona tareas y registra avances y entregables.',
  business: 'Consulta el avance de su proyecto y revisa los entregables.',
  supervisor: 'Acompaña el proyecto, deja observaciones y registra la evaluación final.',
  admin: 'Configura y presenta la demostración, y restablece los datos.',
}

export const ROLE_ORDER: Role[] = ['student', 'business', 'supervisor', 'admin']

// Los estados se distinguen por texto e ícono, no solo por color.
export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  pending: 'Pendiente',
  in_progress: 'En proceso',
  in_review: 'En revisión',
  done: 'Finalizada',
}

export const TASK_STATUS_ICONS: Record<TaskStatus, string> = {
  pending: '○',
  in_progress: '◐',
  in_review: '◎',
  done: '✔',
}

export const REVIEW_LABELS: Record<ReviewStatus, string> = {
  pending: 'Pendiente de revisión',
  approved: 'Aprobado',
  changes_requested: 'Con cambios solicitados',
}

export const REVIEW_ICONS: Record<ReviewStatus, string> = {
  pending: '○',
  approved: '✔',
  changes_requested: '↺',
}

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'En curso',
  closed: 'Cerrado',
}

export const FULFILLMENT_LABELS: Record<Fulfillment, string> = {
  fulfilled: 'Objetivos cumplidos',
  partial: 'Cumplimiento parcial',
  not_fulfilled: 'Objetivos no cumplidos',
}

// ---------- Postulaciones ----------

import type { ApplicationStatus, HelpType, InterestStatus } from '../types'

export const HELP_TYPES: HelpType[] = ['instagram', 'store', 'catalog', 'photos', 'whatsapp', 'marketing', 'other']

export const HELP_TYPE_LABELS: Record<HelpType, string> = {
  instagram: 'Perfil en redes sociales',
  store: 'Tienda online',
  catalog: 'Catálogo de productos',
  photos: 'Fotos y diseño de publicaciones',
  whatsapp: 'WhatsApp Business',
  marketing: 'Contenidos y difusión',
  other: 'Otra ayuda',
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  received: 'Recibida',
  in_review: 'En revisión',
  info_requested: 'Se pidió más información',
  approved: 'Aprobada',
  rejected: 'No aprobada',
}

export const APPLICATION_STATUS_ICONS: Record<ApplicationStatus, string> = {
  received: '○',
  in_review: '◐',
  info_requested: '?',
  approved: '✔',
  rejected: '✕',
}

export const INTEREST_STATUS_LABELS: Record<InterestStatus, string> = {
  pending: 'Pendiente de respuesta',
  accepted: 'Aceptada',
  declined: 'No aceptada',
  removed: 'Salió del equipo',
}

/** Etapas del seguimiento de una postulación, en orden. */
export const TRACKER_STEPS = [
  'Recibida',
  'En revisión',
  'Aprobada',
  'Equipo asignado',
  'En desarrollo',
  'Entregada',
] as const

export const SKILLS = [
  'Diseño gráfico',
  'Canva',
  'Redes sociales',
  'Redacción de contenidos',
  'Fotografía y video',
  'Tienda online',
  'Atención al cliente',
  'WhatsApp Business',
  'Análisis de datos',
  'Programación web',
  'Organización de proyectos',
] as const

export const STUDENT_YEARS = ['1.er año', '2.º año', '3.er año', 'Egresado/a'] as const
export const WEEKLY_HOURS = ['2 a 4 horas', '5 a 8 horas', '9 a 12 horas', 'Más de 12 horas'] as const
export const TIMEFRAMES = ['Lo antes posible', 'En un mes', 'En 2 o 3 meses', 'Sin apuro'] as const
