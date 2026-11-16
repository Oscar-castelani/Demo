import type { DemoState, Project, ProjectInterest, User } from '../types'
import { historyEntry } from './entries'

export const MAX_TEAM_SIZE = 6

// ---------- Permisos (simulados: no son seguridad real) ----------

/** Arma y modifica el equipo el docente del proyecto (y el administrador, para pruebas). */
export function canManageTeam(user: User, project: Project): boolean {
  return user.role === 'admin' || (user.role === 'supervisor' && project.supervisorId === user.id)
}

export function spotsLeft(project: Project): number {
  return project.maxMembers - project.memberIds.length
}

// ---------- Utilidades ----------

function replaceProject(state: DemoState, project: Project): DemoState {
  return { ...state, projects: state.projects.map((p) => (p.id === project.id ? project : p)) }
}

function replaceInterest(state: DemoState, interest: ProjectInterest): DemoState {
  return { ...state, interests: state.interests.map((i) => (i.id === interest.id ? interest : i)) }
}

function findManaged(state: DemoState, projectId: string, actor: User): Project | null {
  const project = state.projects.find((p) => p.id === projectId)
  return project && canManageTeam(actor, project) ? project : null
}

function isStudent(state: DemoState, userId: string): boolean {
  return state.users.some((u) => u.id === userId && u.role === 'student')
}

/** Suma al estudiante al equipo y marca como aceptadas sus postulaciones pendientes a ese proyecto. */
function withMember(state: DemoState, project: Project, studentId: string): DemoState {
  const updated: Project = { ...project, memberIds: [...project.memberIds, studentId] }
  const interests = state.interests.map((i) =>
    i.projectId === project.id && i.studentId === studentId && i.status === 'pending'
      ? { ...i, status: 'accepted' as const }
      : i,
  )
  return replaceProject({ ...state, interests }, updated)
}

// ---------- Operaciones ----------

export function respondToInterest(
  state: DemoState, interestId: string, decision: 'accepted' | 'declined', actor: User,
): DemoState {
  const interest = state.interests.find((i) => i.id === interestId)
  if (!interest || interest.status !== 'pending') return state
  const project = findManaged(state, interest.projectId, actor)
  if (!project) return state

  if (decision === 'declined') return replaceInterest(state, { ...interest, status: 'declined' })

  if (project.status !== 'active' || spotsLeft(project) <= 0) return state
  if (!isStudent(state, interest.studentId) || project.memberIds.includes(interest.studentId)) return state
  return withMember(state, project, interest.studentId)
}

/** El docente suma directamente a un estudiante que armó su perfil. */
export function addTeamMember(state: DemoState, projectId: string, studentId: string, actor: User): DemoState {
  const project = findManaged(state, projectId, actor)
  if (!project || project.status !== 'active' || spotsLeft(project) <= 0) return state
  if (!isStudent(state, studentId) || project.memberIds.includes(studentId)) return state
  return withMember(state, project, studentId)
}

/** Quita al estudiante del equipo; sus tareas quedan sin responsable. */
export function removeTeamMember(state: DemoState, projectId: string, studentId: string, actor: User): DemoState {
  const project = findManaged(state, projectId, actor)
  if (!project || !project.memberIds.includes(studentId)) return state

  const updated: Project = {
    ...project,
    memberIds: project.memberIds.filter((id) => id !== studentId),
    coordinatorId: project.coordinatorId === studentId ? undefined : project.coordinatorId,
  }
  const tasks = state.tasks.map((t) =>
    t.projectId === projectId && t.assigneeId === studentId
      ? {
          ...t,
          assigneeId: null,
          history: [...t.history, historyEntry(actor, 'La tarea quedó sin responsable (el estudiante salió del equipo)')],
        }
      : t,
  )
  const interests = state.interests.map((i) =>
    i.projectId === projectId && i.studentId === studentId && i.status === 'accepted'
      ? { ...i, status: 'removed' as const }
      : i,
  )
  return replaceProject({ ...state, tasks, interests }, updated)
}

export function setCoordinator(state: DemoState, projectId: string, studentId: string | null, actor: User): DemoState {
  const project = findManaged(state, projectId, actor)
  if (!project) return state
  if (studentId !== null && !project.memberIds.includes(studentId)) return state
  return replaceProject(state, { ...project, coordinatorId: studentId ?? undefined })
}

/** Cambia la cantidad de lugares; no puede ser menor que los integrantes actuales. */
export function setMaxMembers(state: DemoState, projectId: string, size: number, actor: User): DemoState {
  const project = findManaged(state, projectId, actor)
  if (!project || !Number.isInteger(size) || size < 1 || size > MAX_TEAM_SIZE || size < project.memberIds.length) return state
  return replaceProject(state, { ...project, maxMembers: size })
}
