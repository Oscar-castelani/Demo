import type { DemoState, Project } from '../types'
import { deliverablesOfProjects, tasksOfProjects } from './dashboardService'

export type AlertKind = 'overdue' | 'changes' | 'review' | 'unassigned'

export interface Alert {
  id: string
  kind: AlertKind
  /** Tarea o entregable que requiere atención. */
  title: string
  projectTitle: string
  detail: string
  /** Pantalla donde se atiende (abre la tarea o el listado de entregables). */
  to: string
}

export const ALERT_LABELS: Record<AlertKind, string> = {
  overdue: 'Tareas vencidas',
  changes: 'Entregables con cambios solicitados',
  review: 'Tareas esperando revisión',
  unassigned: 'Tareas sin responsable',
}

/** Orden de aparición: de lo más urgente a lo menos. */
export const ALERT_ORDER: AlertKind[] = ['overdue', 'changes', 'review', 'unassigned']

/** Fecha local de hoy como AAAA-MM-DD (las fechas límite se guardan en ese formato). */
export function todayString(now: Date = new Date()): string {
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${m}-${d}`
}

/**
 * Alertas calculadas solo con datos que existen: fecha límite, responsable, estado de la tarea y estado de
 * revisión del entregable. No se estima actividad ni se inventan cifras.
 */
export function teacherAlerts(state: DemoState, projects: Project[], now: Date = new Date()): Alert[] {
  const today = todayString(now)
  const titleOf = (projectId: string) => projects.find((p) => p.id === projectId)?.title ?? ''
  const alerts: Alert[] = []

  for (const t of tasksOfProjects(state, projects)) {
    const to = `/app/proyectos/${t.projectId}?tab=board&task=${t.id}`
    if (t.status !== 'done' && t.dueDate && t.dueDate < today) {
      alerts.push({ id: `o-${t.id}`, kind: 'overdue', title: t.title, projectTitle: titleOf(t.projectId), detail: `Venció el ${t.dueDate}`, to })
    }
    if (t.status === 'in_review') {
      alerts.push({ id: `r-${t.id}`, kind: 'review', title: t.title, projectTitle: titleOf(t.projectId), detail: 'Espera la revisión del docente', to })
    }
    if (t.status !== 'done' && t.assigneeId === null) {
      alerts.push({ id: `u-${t.id}`, kind: 'unassigned', title: t.title, projectTitle: titleOf(t.projectId), detail: 'No tiene responsable', to })
    }
  }
  for (const d of deliverablesOfProjects(state, projects)) {
    if (d.reviewStatus === 'changes_requested') {
      alerts.push({
        id: `c-${d.id}`, kind: 'changes', title: d.title, projectTitle: titleOf(d.projectId),
        detail: 'El comercio pidió modificaciones', to: `/app/proyectos/${d.projectId}?tab=deliverables`,
      })
    }
  }
  return alerts.sort((a, b) => ALERT_ORDER.indexOf(a.kind) - ALERT_ORDER.indexOf(b.kind))
}
