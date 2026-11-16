import type { DemoState, Project, Task, TaskStatus, User } from '../types'
import { historyEntry, makeComment, shortId } from './entries'
import { TASK_STATUSES } from './dashboardService'
import { TASK_STATUS_LABELS } from '../utils/labels'
import { hasErrors, validateComment, validateTaskInput, type TaskFormValues } from '../utils/validation'

export type TaskInput = TaskFormValues
export type CreateTaskInput = TaskInput & { projectId: string }

// ---------- Permisos (simulados: no son seguridad real) ----------

export function isStudentMember(user: User, project: Project): boolean {
  return user.role === 'student' && project.memberIds.includes(user.id)
}

export function canCreateTask(user: User, project: Project): boolean {
  return user.role === 'admin' || isStudentMember(user, project)
}

/** Editar título, descripción, responsable y fecha: cualquier integrante del equipo o el administrador. */
export function canEditTask(user: User, project: Project): boolean {
  return user.role === 'admin' || isStudentMember(user, project)
}

/** Estados a los que el usuario puede mover la tarea. */
export function allowedStatuses(user: User, task: Task, project: Project): TaskStatus[] {
  switch (user.role) {
    case 'admin':
      return TASK_STATUSES.filter((s) => s !== task.status)
    case 'student': {
      if (!isStudentMember(user, project)) return []
      // Un solo responsable por tarjeta: solo mueve la tarea quien la tiene asignada (o si está libre).
      if (task.assigneeId !== null && task.assigneeId !== user.id) return []
      switch (task.status) {
        case 'pending': return ['in_progress']
        case 'in_progress': return ['pending', 'in_review']
        case 'in_review': return ['in_progress']
        case 'done': return []
      }
      return []
    }
    case 'supervisor':
      // El supervisor revisa: aprueba o pide correcciones. No ejecuta las tareas del equipo.
      if (project.supervisorId === user.id && task.status === 'in_review') return ['in_progress', 'done']
      return []
    case 'business':
      return []
  }
}

export function transitionLabel(user: User, from: TaskStatus, to: TaskStatus): string {
  if (user.role === 'supervisor' && from === 'in_review') {
    return to === 'done' ? 'Aprobar y finalizar' : 'Solicitar correcciones'
  }
  if (from === 'pending' && to === 'in_progress') return 'Comenzar tarea'
  if (from === 'in_progress' && to === 'in_review') return 'Enviar a revisión'
  if (from === 'in_review' && to === 'in_progress') return 'Volver a En proceso'
  if (from === 'in_progress' && to === 'pending') return 'Volver a Pendiente'
  return `Pasar a ${TASK_STATUS_LABELS[to]}`
}

// ---------- Operaciones sobre el estado (devuelven un estado nuevo) ----------

function isMemberId(project: Project, id: string | null): boolean {
  return id === null || project.memberIds.includes(id)
}

export function createTask(state: DemoState, input: CreateTaskInput, actor: User): DemoState {
  const project = state.projects.find((p) => p.id === input.projectId)
  if (!project || !canCreateTask(actor, project)) return state
  if (hasErrors(validateTaskInput(input)) || !isMemberId(project, input.assigneeId)) return state

  const task: Task = {
    id: `t-${shortId()}`,
    projectId: project.id,
    title: input.title.trim(),
    description: input.description.trim(),
    assigneeId: input.assigneeId,
    status: 'pending',
    dueDate: input.dueDate || undefined,
    comments: [],
    history: [historyEntry(actor, 'Creó la tarea en Pendiente')],
    simulated: false,
  }
  // Agregar trabajo a un proyecto cerrado lo reabre.
  const projects =
    project.status === 'closed'
      ? state.projects.map((p) => (p.id === project.id ? { ...p, status: 'active' as const } : p))
      : state.projects
  return { ...state, projects, tasks: [...state.tasks, task] }
}

export function updateTask(state: DemoState, taskId: string, patch: TaskInput, actor: User): DemoState {
  const task = state.tasks.find((t) => t.id === taskId)
  const project = task && state.projects.find((p) => p.id === task.projectId)
  if (!task || !project || !canEditTask(actor, project)) return state
  if (hasErrors(validateTaskInput(patch)) || !isMemberId(project, patch.assigneeId)) return state

  const updated: Task = {
    ...task,
    title: patch.title.trim(),
    description: patch.description.trim(),
    assigneeId: patch.assigneeId,
    dueDate: patch.dueDate || undefined,
    history: [...task.history, historyEntry(actor, 'Editó la tarea')],
  }
  return { ...state, tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)) }
}

/** El supervisor debe dejar una observación cuando pide correcciones (devuelve la tarea a En proceso). */
export function observationRequired(user: User, to: TaskStatus): boolean {
  return user.role === 'supervisor' && to === 'in_progress'
}

export function changeTaskStatus(
  state: DemoState, taskId: string, status: TaskStatus, actor: User, observation = '',
): DemoState {
  const task = state.tasks.find((t) => t.id === taskId)
  const project = task && state.projects.find((p) => p.id === task.projectId)
  if (!task || !project || !allowedStatuses(actor, task, project).includes(status)) return state

  const text = actor.role === 'supervisor' ? observation.trim() : ''
  if (observationRequired(actor, status) && validateComment(text)) return state
  if (text && validateComment(text)) return state

  const action = `Cambió el estado de ${TASK_STATUS_LABELS[task.status]} a ${TASK_STATUS_LABELS[status]}`
  const updated: Task = {
    ...task,
    status,
    comments: text ? [...task.comments, makeComment(actor, text)] : task.comments,
    history: [...task.history, historyEntry(actor, action)],
  }
  return { ...state, tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)) }
}

// ---------- Comentarios en tareas ----------

/** Comentan en las tareas el equipo, el supervisor del proyecto y el administrador. */
export function canCommentOnTask(user: User, project: Project): boolean {
  return user.role === 'admin' || isStudentMember(user, project) || (user.role === 'supervisor' && project.supervisorId === user.id)
}

export function addTaskComment(state: DemoState, taskId: string, content: string, actor: User): DemoState {
  const task = state.tasks.find((t) => t.id === taskId)
  const project = task && state.projects.find((p) => p.id === task.projectId)
  if (!task || !project || !canCommentOnTask(actor, project) || validateComment(content)) return state

  const updated: Task = {
    ...task,
    comments: [...task.comments, makeComment(actor, content)],
    history: [...task.history, historyEntry(actor, 'Agregó un comentario')],
  }
  return { ...state, tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)) }
}
