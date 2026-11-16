import { isSafeUrl } from './url'

export interface TaskFormValues {
  title: string
  description: string
  assigneeId: string | null
  dueDate?: string
}

export interface TaskFormErrors {
  title?: string
  description?: string
  dueDate?: string
}

export const TITLE_MIN = 3
export const TITLE_MAX = 120
export const DESCRIPTION_MAX = 500

export function validateTaskInput(values: Pick<TaskFormValues, 'title' | 'description' | 'dueDate'>): TaskFormErrors {
  const errors: TaskFormErrors = {}
  const title = values.title.trim()
  if (title.length < TITLE_MIN) errors.title = `El título debe tener al menos ${TITLE_MIN} caracteres.`
  else if (title.length > TITLE_MAX) errors.title = `El título no puede superar ${TITLE_MAX} caracteres.`
  if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`
  }
  if (values.dueDate) {
    const valid = /^\d{4}-\d{2}-\d{2}$/.test(values.dueDate) && !Number.isNaN(Date.parse(values.dueDate))
    if (!valid) errors.dueDate = 'La fecha límite no es válida.'
  }
  return errors
}

export function hasErrors(errors: object): boolean {
  return Object.keys(errors).length > 0
}

// ---------- Comentarios y entregables ----------

export const COMMENT_MAX = 500
export const RESOURCE_TYPES = ['Google Drive', 'Canva', 'Instagram', 'Trello', 'Otro'] as const

export function validateComment(content: string): string | undefined {
  const text = content.trim()
  if (text.length === 0) return 'Escribí un comentario.'
  if (text.length > COMMENT_MAX) return `El comentario no puede superar ${COMMENT_MAX} caracteres.`
  return undefined
}

export interface DeliverableFormValues {
  title: string
  description: string
  resourceType: string
  url: string
  taskId: string | null
}

export interface DeliverableFormErrors {
  title?: string
  description?: string
  url?: string
}

export function validateDeliverableInput(
  values: Pick<DeliverableFormValues, 'title' | 'description' | 'url'>,
): DeliverableFormErrors {
  const errors: DeliverableFormErrors = {}
  const title = values.title.trim()
  if (title.length < TITLE_MIN) errors.title = `El título debe tener al menos ${TITLE_MIN} caracteres.`
  else if (title.length > TITLE_MAX) errors.title = `El título no puede superar ${TITLE_MAX} caracteres.`
  if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `La descripción no puede superar ${DESCRIPTION_MAX} caracteres.`
  }
  const url = values.url.trim()
  if (url.length === 0) errors.url = 'Ingresá el enlace al recurso.'
  else if (!isSafeUrl(url)) errors.url = 'El enlace debe empezar con http:// o https:// y ser una dirección válida.'
  return errors
}

export const CLOSURE_TEXT_MAX = 1000

export function validateClosureText(text: string): string | undefined {
  if (text.trim().length > CLOSURE_TEXT_MAX) return `El texto no puede superar ${CLOSURE_TEXT_MAX} caracteres.`
  return undefined
}
