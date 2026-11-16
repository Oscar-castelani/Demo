import type { ClosureField, DemoState, Fulfillment, Project, ProjectClosure, ProjectStatus, User } from '../types'
import { isStudentMember } from './taskService'
import { validateClosureText } from '../utils/validation'

const FULFILLMENTS: Fulfillment[] = ['fulfilled', 'partial', 'not_fulfilled']

const EMPTY_CLOSURE: ProjectClosure = {
  fulfillment: 'partial',
  businessFeedback: '',
  supervisorNotes: '',
  teamReflection: '',
  simulatedFields: [],
}

// ---------- Permisos (simulados: no son seguridad real) ----------

function isSupervisorOf(user: User, project: Project): boolean {
  return user.role === 'supervisor' && project.supervisorId === user.id
}

/** Quién puede completar cada parte del cierre. */
export function canEditClosureField(state: DemoState, user: User, project: Project, field: ClosureField): boolean {
  if (user.role === 'admin') return true
  switch (field) {
    case 'fulfillment':
    case 'supervisorNotes':
      return isSupervisorOf(user, project)
    case 'businessFeedback':
      return (
        user.role === 'business' &&
        state.businesses.find((b) => b.id === project.businessId)?.ownerId === user.id
      )
    case 'teamReflection':
      return isStudentMember(user, project)
  }
}

export function canChangeProjectStatus(user: User, project: Project): boolean {
  return user.role === 'admin' || isSupervisorOf(user, project)
}

// ---------- Operaciones ----------

export function updateClosureField(
  state: DemoState, projectId: string, field: ClosureField, value: string, actor: User,
): DemoState {
  const project = state.projects.find((p) => p.id === projectId)
  if (!project || !canEditClosureField(state, actor, project, field)) return state

  if (field === 'fulfillment') {
    if (!FULFILLMENTS.includes(value as Fulfillment)) return state
  } else if (validateClosureText(value)) {
    return state
  }

  const base = project.closure ?? EMPTY_CLOSURE
  const closure: ProjectClosure = {
    ...base,
    [field]: field === 'fulfillment' ? (value as Fulfillment) : value.trim(),
    simulatedFields: base.simulatedFields.filter((f) => f !== field),
  }
  return { ...state, projects: state.projects.map((p) => (p.id === projectId ? { ...p, closure } : p)) }
}

/** Cerrar exige que todas las tareas estén Finalizadas. Reabrir no tiene condiciones. */
export function closeBlocker(state: DemoState, project: Project): string | null {
  const tasks = state.tasks.filter((t) => t.projectId === project.id)
  const open = tasks.filter((t) => t.status !== 'done').length
  return open > 0 ? `Para cerrar el proyecto, las tareas deben estar Finalizadas (faltan ${open}).` : null
}

export function setProjectStatus(state: DemoState, projectId: string, status: ProjectStatus, actor: User): DemoState {
  const project = state.projects.find((p) => p.id === projectId)
  if (!project || !canChangeProjectStatus(actor, project) || project.status === status) return state
  if (status === 'closed' && closeBlocker(state, project)) return state
  return { ...state, projects: state.projects.map((p) => (p.id === projectId ? { ...p, status } : p)) }
}
