import type {
  ApplicationStatus, Business, DemoState, Project, ProjectApplication, ProjectInterest, SocialLink, StudentProfile,
  User,
} from '../types'
import { makeComment, shortId } from './entries'
import {
  validateNote, validateProjectInfo, validateBusinessInfo, validateStudent,
  type BusinessInfoValues, type ProjectInfoValues, type StudentValues,
} from '../utils/applicationValidation'
import { hasErrors } from '../utils/validation'

export type BusinessApplicationInput = BusinessInfoValues & ProjectInfoValues

// ---------- Utilidades ----------

function socials(entries: [string, string][]): SocialLink[] {
  return entries.filter(([, url]) => url.trim()).map(([label, url]) => ({ label, url: url.trim() }))
}

function newApplication(business: Business, applicantId: string, v: ProjectInfoValues): ProjectApplication {
  return {
    id: `a-${shortId()}`,
    businessId: business.id,
    applicantId,
    projectTitle: v.projectTitle.trim(),
    description: v.description.trim(),
    expectedResult: v.expectedResult.trim(),
    helpTypes: v.helpTypes,
    timeframe: v.timeframe,
    contactHours: v.contactHours.trim(),
    status: 'received',
    comments: [],
    createdAt: new Date().toISOString(),
    simulated: false,
  }
}

export function ownBusiness(state: DemoState, user: User): Business | undefined {
  return state.businesses.find((b) => b.ownerId === user.id)
}

// ---------- Postulación de un comercio ----------

/** Crea la persona a cargo, el comercio y la postulación; deja a esa persona como usuario activo. */
export function submitBusinessApplication(state: DemoState, input: BusinessApplicationInput): DemoState {
  if (hasErrors(validateBusinessInfo(input)) || hasErrors(validateProjectInfo(input))) return state

  const user: User = { id: `u-${shortId()}`, name: input.ownerName.trim(), role: 'business' }
  const business: Business = {
    id: `b-${shortId()}`,
    name: input.businessName.trim(),
    ownerId: user.id,
    ownerName: user.name,
    city: input.city.trim(),
    activity: input.activity.trim(),
    phone: input.phone.trim(),
    email: input.email.trim() || undefined,
    socials: socials([['Instagram', input.instagram], ['Facebook', input.facebook], ['Sitio web', input.website]]),
    currentChannels: input.currentChannels.trim() || undefined,
  }
  return {
    ...state,
    users: [...state.users, user],
    businesses: [...state.businesses, business],
    applications: [...state.applications, newApplication(business, user.id, input)],
    activeUserId: user.id,
  }
}

/** Un comercio que ya está en la demo postula otro proyecto. */
export function submitAnotherApplication(state: DemoState, input: ProjectInfoValues, actor: User): DemoState {
  const business = ownBusiness(state, actor)
  if (actor.role !== 'business' || !business || hasErrors(validateProjectInfo(input))) return state
  return { ...state, applications: [...state.applications, newApplication(business, actor.id, input)] }
}

// ---------- Revisión del docente ----------

export type ReviewAction = 'start_review' | 'request_info' | 'approve' | 'reject'

function canReviewApplications(user: User): boolean {
  return user.role === 'supervisor' || user.role === 'admin'
}

const NEXT: Record<ReviewAction, { from: ApplicationStatus[]; to: ApplicationStatus; note: 'none' | 'required' | 'optional' }> = {
  start_review: { from: ['received'], to: 'in_review', note: 'none' },
  request_info: { from: ['in_review'], to: 'info_requested', note: 'required' },
  approve: { from: ['in_review'], to: 'approved', note: 'optional' },
  reject: { from: ['in_review', 'info_requested'], to: 'rejected', note: 'required' },
}

/** Una nota es obligatoria al pedir información o al rechazar. */
export function reviewNoteRequired(action: ReviewAction): boolean {
  return NEXT[action].note === 'required'
}

export function reviewActionsFor(status: ApplicationStatus): ReviewAction[] {
  return (Object.keys(NEXT) as ReviewAction[]).filter((a) => NEXT[a].from.includes(status))
}

export function reviewApplication(
  state: DemoState, applicationId: string, action: ReviewAction, note: string, maxMembers: number, actor: User,
): DemoState {
  const app = state.applications.find((a) => a.id === applicationId)
  if (!app || !canReviewApplications(actor) || !NEXT[action].from.includes(app.status)) return state
  const rule = NEXT[action]
  if (validateNote(note, rule.note === 'required')) return state

  const comments = note.trim() ? [...app.comments, makeComment(actor, note)] : app.comments
  let updated: ProjectApplication = { ...app, status: rule.to, comments }
  let projects = state.projects

  if (action === 'approve') {
    const supervisor = actor.role === 'supervisor' ? actor : state.users.find((u) => u.role === 'supervisor')
    const business = state.businesses.find((b) => b.id === app.businessId)
    if (!supervisor || !business) return state
    const project: Project = {
      id: `p-${shortId()}`,
      title: app.projectTitle,
      description: app.description,
      objective: app.expectedResult || 'A definir con el equipo y el comercio.',
      businessId: business.id,
      supervisorId: supervisor.id,
      memberIds: [],
      maxMembers: Math.min(Math.max(Math.round(maxMembers) || 3, 1), 6),
      status: 'active',
      applicationId: app.id,
    }
    projects = [...projects, project]
    updated = { ...updated, projectId: project.id }
  }
  return {
    ...state,
    projects,
    applications: state.applications.map((a) => (a.id === applicationId ? updated : a)),
  }
}

/** Mensaje en la conversación de una postulación: el comercio (respuesta) o el docente. */
export function addApplicationComment(state: DemoState, applicationId: string, content: string, actor: User): DemoState {
  const app = state.applications.find((a) => a.id === applicationId)
  if (!app || validateNote(content, true)) return state
  const isOwner = actor.role === 'business' && app.applicantId === actor.id
  if (!isOwner && !canReviewApplications(actor)) return state

  // Si el docente pidió información y el comercio responde, la postulación vuelve a revisión.
  const status: ApplicationStatus = isOwner && app.status === 'info_requested' ? 'in_review' : app.status
  const updated: ProjectApplication = { ...app, status, comments: [...app.comments, makeComment(actor, content)] }
  return { ...state, applications: state.applications.map((a) => (a.id === applicationId ? updated : a)) }
}

// ---------- Etapas visibles para el comercio ----------

export interface Stage {
  /** Índice (0 a 5) en TRACKER_STEPS de la etapa en que está la postulación. */
  index: number
  /** Si la postulación no continúa. */
  stopped: boolean
  /** Si el docente está esperando una respuesta del comercio. */
  waitingForBusiness: boolean
}

/** Las etapas posteriores a la aprobación se derivan del proyecto, no se guardan aparte. */
export function applicationStage(state: DemoState, app: ProjectApplication): Stage {
  if (app.status === 'rejected') return { index: 0, stopped: true, waitingForBusiness: false }
  if (app.status === 'received') return { index: 0, stopped: false, waitingForBusiness: false }
  if (app.status === 'in_review') return { index: 1, stopped: false, waitingForBusiness: false }
  if (app.status === 'info_requested') return { index: 1, stopped: false, waitingForBusiness: true }

  const project = state.projects.find((p) => p.id === app.projectId)
  if (!project) return { index: 2, stopped: false, waitingForBusiness: false }
  if (project.status === 'closed') return { index: 5, stopped: false, waitingForBusiness: false }
  const tasks = state.tasks.filter((t) => t.projectId === project.id)
  if (tasks.some((t) => t.status !== 'pending')) return { index: 4, stopped: false, waitingForBusiness: false }
  if (project.memberIds.length > 0) return { index: 3, stopped: false, waitingForBusiness: false }
  return { index: 2, stopped: false, waitingForBusiness: false }
}

// ---------- Postulación de un estudiante ----------

/** Crea al estudiante con su perfil y lo deja como usuario activo. */
export function submitStudentProfile(state: DemoState, v: StudentValues): DemoState {
  if (hasErrors(validateStudent(v))) return state
  const user: User = { id: `u-${shortId()}`, name: v.name.trim(), role: 'student' }
  const profile: StudentProfile = {
    userId: user.id,
    email: v.email.trim(),
    phone: v.phone.trim(),
    year: v.year,
    weeklyHours: v.weeklyHours,
    skills: v.skills,
    otherSkills: v.otherSkills.trim(),
    experience: v.experience.trim(),
    motivation: v.motivation.trim(),
    socials: socials([['Instagram', v.instagram], ['LinkedIn', v.linkedin], ['Sitio web', v.website]]),
    createdAt: new Date().toISOString(),
    simulated: false,
  }
  return {
    ...state,
    users: [...state.users, user],
    studentProfiles: [...state.studentProfiles, profile],
    activeUserId: user.id,
  }
}

/** Proyectos aprobados, en curso y con lugar para más estudiantes. */
export function openProjects(state: DemoState): Project[] {
  return state.projects.filter((p) => p.status === 'active' && p.memberIds.length < p.maxMembers)
}

export function applyToProject(state: DemoState, projectId: string, message: string, actor: User): DemoState {
  const project = state.projects.find((p) => p.id === projectId)
  if (actor.role !== 'student' || !project || !openProjects(state).some((p) => p.id === projectId)) return state
  if (project.memberIds.includes(actor.id)) return state
  const active = (s: string) => s === 'pending' || s === 'accepted'
  if (state.interests.some((i) => i.projectId === projectId && i.studentId === actor.id && active(i.status))) return state
  if (validateNote(message, false)) return state

  const interest: ProjectInterest = {
    id: `i-${shortId()}`,
    projectId,
    studentId: actor.id,
    message: message.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    simulated: false,
  }
  return { ...state, interests: [...state.interests, interest] }
}
