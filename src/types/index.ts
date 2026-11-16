// Tipos de datos de la demo. La demo arranca vacía; el caso de ejemplo se carga con un botón.

export type Role = 'student' | 'business' | 'supervisor' | 'admin'

export type TaskStatus = 'pending' | 'in_progress' | 'in_review' | 'done'

export type ReviewStatus = 'pending' | 'approved' | 'changes_requested'

export type ProjectStatus = 'active' | 'closed'

export type Fulfillment = 'fulfilled' | 'partial' | 'not_fulfilled'

/**
 * Marca los datos inventados para la demo (no son hechos históricos).
 * En las tareas, los títulos y responsables provienen del tablero real; lo simulado
 * es su estado, comentarios e historial.
 */
export interface Simulable {
  simulated: boolean
}

export interface User {
  id: string
  name: string
  role: Role
}

/** Red social o sitio web que la persona decide compartir (opcional). */
export interface SocialLink {
  label: string
  url: string
}

export interface Business {
  id: string
  name: string
  ownerId: string
  ownerName: string
  city: string
  activity: string
  /** Puede estar vacío (por ejemplo, en el caso de ejemplo). */
  phone: string
  email?: string
  socials: SocialLink[]
  /** Dónde vende o se muestra hoy. */
  currentChannels?: string
}

export type HelpType = 'instagram' | 'store' | 'catalog' | 'photos' | 'whatsapp' | 'marketing' | 'other'

/** Estados que guarda la postulación; las etapas siguientes se derivan del proyecto. */
export type ApplicationStatus = 'received' | 'in_review' | 'info_requested' | 'approved' | 'rejected'

/** Postulación de un comercio, emprendimiento o Pyme para recibir una ayudantía. */
export interface ProjectApplication extends Simulable {
  id: string
  businessId: string
  applicantId: string
  projectTitle: string
  description: string
  expectedResult: string
  helpTypes: HelpType[]
  timeframe: string
  contactHours: string
  status: ApplicationStatus
  /** Conversación entre el comercio y el docente (pedidos de información, respuestas, notas). */
  comments: Comment[]
  /** Proyecto creado al aprobar la postulación. */
  projectId?: string
  createdAt: string // ISO 8601
}

export interface StudentProfile extends Simulable {
  userId: string
  email: string
  phone: string
  year: string
  weeklyHours: string
  skills: string[]
  otherSkills: string
  experience: string
  motivation: string
  socials: SocialLink[]
  createdAt: string // ISO 8601
}

export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'removed'

/** Postulación de un estudiante a un proyecto abierto. */
export interface ProjectInterest extends Simulable {
  id: string
  projectId: string
  studentId: string
  message: string
  status: InterestStatus
  createdAt: string // ISO 8601
}

export interface Comment extends Simulable {
  id: string
  authorId: string
  authorName: string
  authorRole: Role
  content: string
  createdAt: string // ISO 8601
}

export interface HistoryEntry extends Simulable {
  id: string
  actorName: string
  actorRole: Role
  action: string
  createdAt: string // ISO 8601
}

export interface Task extends Simulable {
  id: string
  projectId: string
  title: string
  description: string
  assigneeId: string | null
  status: TaskStatus
  dueDate?: string // ISO 8601, opcional
  comments: Comment[]
  history: HistoryEntry[]
}

export interface Deliverable extends Simulable {
  id: string
  projectId: string
  /** Tarea a la que está vinculado; sin valor, es un entregable del proyecto. */
  taskId?: string
  history: HistoryEntry[]
  title: string
  description: string
  resourceType: string
  url: string
  ownerId: string
  registeredAt: string // ISO 8601
  reviewStatus: ReviewStatus
  comments: Comment[]
}

export type ClosureField = 'fulfillment' | 'businessFeedback' | 'supervisorNotes' | 'teamReflection'

export interface ProjectClosure {
  fulfillment: Fulfillment
  businessFeedback: string
  supervisorNotes: string
  teamReflection: string
  /** Campos que todavía son datos de ejemplo; al editarlos dejan de serlo. */
  simulatedFields: ClosureField[]
}

export interface Project {
  id: string
  title: string
  description: string
  objective: string
  businessId: string
  supervisorId: string
  memberIds: string[]
  /** Estudiante que coordina el equipo (debe ser integrante). */
  coordinatorId?: string
  /** Cantidad máxima de estudiantes; mientras haya lugar, el proyecto está abierto a postulaciones. */
  maxMembers: number
  status: ProjectStatus
  /** Postulación del comercio de la que surgió el proyecto. */
  applicationId?: string
  closure?: ProjectClosure
}

/** Estado completo persistido en localStorage. */
export interface DemoState {
  schemaVersion: number
  users: User[]
  businesses: Business[]
  projects: Project[]
  tasks: Task[]
  deliverables: Deliverable[]
  applications: ProjectApplication[]
  studentProfiles: StudentProfile[]
  interests: ProjectInterest[]
  activeUserId: string | null
}
