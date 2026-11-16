import type { Comment, DemoState, HistoryEntry, Project, Role } from '../types'
import { deliverablesOfProjects, tasksOfProjects } from './dashboardService'

export interface TimelineItem {
  id: string
  /** Evento automático registrado por la plataforma o comentario escrito por una persona. */
  kind: 'event' | 'comment'
  actorName: string
  actorRole: Role
  text: string
  createdAt: string
  simulated: boolean
  /** Tarea o entregable al que se refiere (solo en la línea de tiempo del proyecto). */
  context?: string
}

/** Al comentar, la plataforma registra "Agregó un comentario": el comentario ya se ve, así que se omite el aviso. */
const REDUNDANT_EVENT = 'Agregó un comentario'

function isRelevant(h: HistoryEntry): boolean {
  return h.action !== REDUNDANT_EVENT
}

function fromHistory(h: HistoryEntry, context?: string): TimelineItem {
  return { id: h.id, kind: 'event', actorName: h.actorName, actorRole: h.actorRole, text: h.action, createdAt: h.createdAt, simulated: h.simulated, context }
}

function fromComment(c: Comment, context?: string): TimelineItem {
  return { id: c.id, kind: 'comment', actorName: c.authorName, actorRole: c.authorRole, text: c.content, createdAt: c.createdAt, simulated: c.simulated, context }
}

/**
 * Ordena por fecha. Los registros simulados comparten una marca de tiempo ficticia, así que entre ellos
 * se conserva el orden de registro (eventos antes que comentarios) en vez de inventar fechas.
 */
function sorted(items: TimelineItem[], order: 'asc' | 'desc'): TimelineItem[] {
  const indexed = items.map((item, i) => ({ item, i }))
  indexed.sort((a, b) => {
    if (a.item.createdAt !== b.item.createdAt) return a.item.createdAt.localeCompare(b.item.createdAt)
    return a.i - b.i
  })
  const list = indexed.map((x) => x.item)
  return order === 'asc' ? list : list.reverse()
}

/** Historia de una tarea o de un entregable: eventos y comentarios, del más antiguo al más nuevo. */
export function entityTimeline(history: HistoryEntry[], comments: Comment[]): TimelineItem[] {
  return sorted([...history.filter(isRelevant).map((h) => fromHistory(h)), ...comments.map((c) => fromComment(c))], 'asc')
}

/** Actividad del proyecto (tareas y entregables), del más reciente al más antiguo. */
export function projectTimeline(state: DemoState, projects: Project[], limit = 60): TimelineItem[] {
  const items: TimelineItem[] = []
  for (const t of tasksOfProjects(state, projects)) {
    items.push(...t.history.filter(isRelevant).map((h) => fromHistory(h, t.title)), ...t.comments.map((c) => fromComment(c, t.title)))
  }
  for (const d of deliverablesOfProjects(state, projects)) {
    items.push(...d.history.filter(isRelevant).map((h) => fromHistory(h, d.title)), ...d.comments.map((c) => fromComment(c, d.title)))
  }
  return sorted(items, 'desc').slice(0, limit)
}
