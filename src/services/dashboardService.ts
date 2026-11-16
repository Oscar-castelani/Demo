import type {
  Comment,
  Deliverable,
  DemoState,
  HistoryEntry,
  Project,
  Task,
  TaskStatus,
  User,
} from '../types'

export const TASK_STATUSES: TaskStatus[] = ['pending', 'in_progress', 'in_review', 'done']

export function projectsForUser(state: DemoState, user: User): Project[] {
  switch (user.role) {
    case 'student':
      return state.projects.filter((p) => p.memberIds.includes(user.id))
    case 'supervisor':
      return state.projects.filter((p) => p.supervisorId === user.id)
    case 'business': {
      const ids = state.businesses.filter((b) => b.ownerId === user.id).map((b) => b.id)
      return state.projects.filter((p) => ids.includes(p.businessId))
    }
    case 'admin':
      return state.projects
  }
}

export function tasksOfProjects(state: DemoState, projects: Project[]): Task[] {
  const ids = new Set(projects.map((p) => p.id))
  return state.tasks.filter((t) => ids.has(t.projectId))
}

export function deliverablesOfProjects(state: DemoState, projects: Project[]): Deliverable[] {
  const ids = new Set(projects.map((p) => p.id))
  return state.deliverables.filter((d) => ids.has(d.projectId))
}

export function countByStatus(tasks: Task[]): Record<TaskStatus, number> {
  const counts: Record<TaskStatus, number> = { pending: 0, in_progress: 0, in_review: 0, done: 0 }
  for (const t of tasks) counts[t.status] += 1
  return counts
}

export function progressPercent(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100)
}

export function nameOf(state: DemoState, userId: string | null): string {
  if (!userId) return 'Sin asignar'
  return state.users.find((u) => u.id === userId)?.name ?? 'Usuario desconocido'
}

export interface Observation {
  comment: Comment
  context: string
}

/** Comentarios de supervisores sobre tareas y entregables, del más reciente al más antiguo. */
export function supervisorObservations(state: DemoState, projects: Project[], limit = 5): Observation[] {
  const items: Observation[] = []
  for (const t of tasksOfProjects(state, projects)) {
    for (const c of t.comments) if (c.authorRole === 'supervisor') items.push({ comment: c, context: t.title })
  }
  for (const d of deliverablesOfProjects(state, projects)) {
    for (const c of d.comments) if (c.authorRole === 'supervisor') items.push({ comment: c, context: d.title })
  }
  return items.sort((a, b) => b.comment.createdAt.localeCompare(a.comment.createdAt)).slice(0, limit)
}

export interface ActivityItem {
  entry: HistoryEntry
  /** Tarea o entregable al que se refiere el movimiento. */
  context: string
}

/** Historial de tareas y entregables, del más reciente al más antiguo. */
export function recentActivity(state: DemoState, projects: Project[], limit = 5): ActivityItem[] {
  const items: ActivityItem[] = []
  for (const t of tasksOfProjects(state, projects)) {
    for (const h of t.history) items.push({ entry: h, context: t.title })
  }
  for (const d of deliverablesOfProjects(state, projects)) {
    for (const h of d.history) items.push({ entry: h, context: d.title })
  }
  return items.sort((a, b) => b.entry.createdAt.localeCompare(a.entry.createdAt)).slice(0, limit)
}

export function pendingDeliverableReviews(state: DemoState, projects: Project[]): Deliverable[] {
  return deliverablesOfProjects(state, projects).filter((d) => d.reviewStatus === 'pending')
}

export interface RecentComment {
  comment: Comment
  context: string
}

/** Últimos comentarios (de cualquier autor) sobre tareas y entregables. */
export function recentComments(state: DemoState, projects: Project[], limit = 5): RecentComment[] {
  const items: RecentComment[] = []
  for (const t of tasksOfProjects(state, projects)) {
    for (const c of t.comments) items.push({ comment: c, context: t.title })
  }
  for (const d of deliverablesOfProjects(state, projects)) {
    for (const c of d.comments) items.push({ comment: c, context: d.title })
  }
  return items.sort((a, b) => b.comment.createdAt.localeCompare(a.comment.createdAt)).slice(0, limit)
}

export interface MemberLoad {
  userId: string
  counts: Record<TaskStatus, number>
}

/** Cantidad de tareas por estado de cada integrante del proyecto. */
export function memberLoad(state: DemoState, project: Project): MemberLoad[] {
  const tasks = tasksOfProjects(state, [project])
  return project.memberIds.map((userId) => ({
    userId,
    counts: countByStatus(tasks.filter((t) => t.assigneeId === userId)),
  }))
}
