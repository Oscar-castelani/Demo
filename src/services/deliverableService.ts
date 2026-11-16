import type { Deliverable, DemoState, Project, User } from '../types'
import { historyEntry, makeComment, shortId } from './entries'
import { isStudentMember } from './taskService'
import {
  hasErrors, validateComment, validateDeliverableInput, type DeliverableFormValues,
} from '../utils/validation'

export type RegisterDeliverableInput = DeliverableFormValues & { projectId: string }
export type ReviewDecision = 'approved' | 'changes_requested'

// ---------- Permisos (simulados: no son seguridad real) ----------

function isBusinessOwner(state: DemoState, user: User, project: Project): boolean {
  if (user.role !== 'business') return false
  return state.businesses.find((b) => b.id === project.businessId)?.ownerId === user.id
}

export function canRegisterDeliverable(user: User, project: Project): boolean {
  return user.role === 'admin' || isStudentMember(user, project)
}

/** Revisa los entregables el emprendimiento del proyecto (y el administrador, para pruebas). */
export function canReviewDeliverable(state: DemoState, user: User, project: Project): boolean {
  return user.role === 'admin' || isBusinessOwner(state, user, project)
}

export function canCommentOnDeliverable(state: DemoState, user: User, project: Project): boolean {
  return (
    user.role === 'admin' ||
    isStudentMember(user, project) ||
    (user.role === 'supervisor' && project.supervisorId === user.id) ||
    isBusinessOwner(state, user, project)
  )
}

// ---------- Operaciones ----------

function replace(state: DemoState, updated: Deliverable): DemoState {
  return { ...state, deliverables: state.deliverables.map((d) => (d.id === updated.id ? updated : d)) }
}

function find(state: DemoState, id: string) {
  const deliverable = state.deliverables.find((d) => d.id === id)
  const project = deliverable && state.projects.find((p) => p.id === deliverable.projectId)
  return deliverable && project ? { deliverable, project } : null
}

export function registerDeliverable(state: DemoState, input: RegisterDeliverableInput, actor: User): DemoState {
  const project = state.projects.find((p) => p.id === input.projectId)
  if (!project || !canRegisterDeliverable(actor, project)) return state
  if (hasErrors(validateDeliverableInput(input))) return state
  if (input.taskId && !state.tasks.some((t) => t.id === input.taskId && t.projectId === project.id)) return state

  const deliverable: Deliverable = {
    id: `d-${shortId()}`,
    projectId: project.id,
    taskId: input.taskId ?? undefined,
    title: input.title.trim(),
    description: input.description.trim(),
    resourceType: input.resourceType,
    url: input.url.trim(),
    ownerId: actor.id,
    registeredAt: new Date().toISOString(),
    reviewStatus: 'pending',
    comments: [],
    history: [historyEntry(actor, 'Registró el entregable')],
    simulated: false,
  }
  return { ...state, deliverables: [...state.deliverables, deliverable] }
}

/** El emprendimiento aprueba o pide modificaciones. Para pedir modificaciones el comentario es obligatorio. */
export function reviewDeliverable(
  state: DemoState, id: string, decision: ReviewDecision, comment: string, actor: User,
): DemoState {
  const found = find(state, id)
  if (!found || !canReviewDeliverable(state, actor, found.project)) return state
  const { deliverable } = found
  if (deliverable.reviewStatus !== 'pending') return state
  const text = comment.trim()
  if (decision === 'changes_requested' && validateComment(text)) return state
  if (text && validateComment(text)) return state

  const action = decision === 'approved' ? 'Aprobó el entregable' : 'Solicitó modificaciones del entregable'
  return replace(state, {
    ...deliverable,
    reviewStatus: decision,
    comments: text ? [...deliverable.comments, makeComment(actor, text)] : deliverable.comments,
    history: [...deliverable.history, historyEntry(actor, action)],
  })
}

/** Quien registró el entregable (o el administrador) lo vuelve a enviar a revisión tras las correcciones. */
export function resubmitDeliverable(state: DemoState, id: string, actor: User): DemoState {
  const found = find(state, id)
  if (!found) return state
  const { deliverable, project } = found
  if (deliverable.reviewStatus !== 'changes_requested') return state
  if (!(actor.role === 'admin' || (isStudentMember(actor, project) && deliverable.ownerId === actor.id))) return state

  return replace(state, {
    ...deliverable,
    reviewStatus: 'pending',
    history: [...deliverable.history, historyEntry(actor, 'Volvió a enviar el entregable a revisión')],
  })
}

export function addDeliverableComment(state: DemoState, id: string, content: string, actor: User): DemoState {
  const found = find(state, id)
  if (!found || !canCommentOnDeliverable(state, actor, found.project) || validateComment(content)) return state
  const { deliverable } = found
  return replace(state, {
    ...deliverable,
    comments: [...deliverable.comments, makeComment(actor, content)],
    history: [...deliverable.history, historyEntry(actor, 'Agregó un comentario')],
  })
}
