import type {
  Business,
  Comment,
  DemoState,
  Deliverable,
  HistoryEntry,
  Project,
  ProjectApplication,
  StudentProfile,
  Task,
  User,
} from '../types'

/** Versión de la estructura de datos. Subirla descarta lo guardado en localStorage. */
export const SCHEMA_VERSION = 5

// Marca de tiempo fija de ejemplo (dato simulado).
const T = '2026-11-15T09:00:00.000Z'

const PROJECT_ID = 'p-ejemplo-vivero'

// Caso de ejemplo 100 % ficticio: ninguna persona, comercio ni enlace es real.
export const USERS: User[] = [
  { id: 'u-lucia', name: 'Lucía Fernández', role: 'student' },
  { id: 'u-mateo', name: 'Mateo Gómez', role: 'student' },
  { id: 'u-sofia', name: 'Sofía Ledesma', role: 'student' },
  { id: 'u-carolina', name: 'Carolina Vega', role: 'business' },
  { id: 'u-alejandra', name: 'Alejandra Núñez', role: 'supervisor' },
  { id: 'u-admin', name: 'Administrador de demostración', role: 'admin' },
]

export const BUSINESSES: Business[] = [
  {
    id: 'b-ejemplo-vivero',
    name: 'Vivero Raíces (ejemplo)',
    ownerId: 'u-carolina',
    ownerName: 'Carolina Vega',
    city: 'Provincia de Buenos Aires',
    activity: 'Venta de plantas, macetas e insumos de jardinería',
    phone: '',
    socials: [],
  },
]

export const PROJECTS: Project[] = [
  {
    id: PROJECT_ID,
    title: 'Catálogo digital de productos',
    description:
      'Armar un catálogo digital con fotos, descripciones y categorías, para que los clientes conozcan los productos y hagan sus pedidos por mensaje.',
    objective:
      'Disponer de un catálogo digital publicado, con identidad visual coherente y una forma simple de recibir pedidos.',
    businessId: 'b-ejemplo-vivero',
    supervisorId: 'u-alejandra',
    memberIds: ['u-lucia', 'u-mateo', 'u-sofia'],
    maxMembers: 3,
    coordinatorId: 'u-mateo',
    applicationId: 'a-ejemplo-vivero',
    status: 'closed',
    closure: {
      simulatedFields: ['fulfillment', 'businessFeedback', 'supervisorNotes', 'teamReflection'],
      fulfillment: 'fulfilled',
      businessFeedback:
        'Devolución simulada: el comercio valora el catálogo entregado y la forma de recibir pedidos.',
      supervisorNotes:
        'Observación simulada: el equipo organizó bien el trabajo y cumplió los objetivos del proyecto.',
      teamReflection:
        'Reflexión simulada: trabajar con un comercio ayudó a aplicar lo aprendido en la carrera.',
    },
  },
]

function hist(id: string, actorId: string): HistoryEntry {
  const actor = USERS.find((u) => u.id === actorId)!
  return {
    id,
    simulated: true,
    actorName: actor.name,
    actorRole: actor.role,
    action: 'Tarea finalizada (dato simulado)',
    createdAt: T,
  }
}

function deliverableHist(id: string, actorId: string): HistoryEntry {
  const actor = USERS.find((u) => u.id === actorId)!
  return {
    id,
    simulated: true,
    actorName: actor.name,
    actorRole: actor.role,
    action: 'Registró el entregable (dato simulado)',
    createdAt: T,
  }
}

function comment(id: string, authorId: string, content: string): Comment {
  const author = USERS.find((u) => u.id === authorId)!
  return {
    id,
    simulated: true,
    authorId,
    authorName: author.name,
    authorRole: author.role,
    content,
    createdAt: T,
  }
}

interface TaskSeed {
  n: number
  title: string
  description: string
  assigneeId: string
  comments?: Comment[]
}

const TASK_SEEDS: TaskSeed[] = [
  {
    n: 1,
    title: 'Reunión con el comercio: acuerdos y permisos',
    description: 'Acordar con el comercio los objetivos, los permisos de uso de fotos y logo, y el estilo del catálogo.',
    assigneeId: 'u-mateo',
    comments: [comment('c-1', 'u-alejandra', 'Observación simulada: buen registro de los acuerdos de la reunión.')],
  },
  {
    n: 2,
    title: 'Juntar fotos, logo y datos de los productos',
    description: 'Reunir las fotos, el logo y los datos de los productos que van en el catálogo.',
    assigneeId: 'u-sofia',
  },
  {
    n: 3,
    title: 'Definir categorías y estructura del catálogo',
    description: 'Ordenar los productos en categorías y definir cómo se va a mostrar cada uno.',
    assigneeId: 'u-lucia',
  },
  {
    n: 4,
    title: 'Redactar las descripciones de los productos',
    description: 'Escribir descripciones claras y breves para cada producto.',
    assigneeId: 'u-mateo',
  },
  {
    n: 5,
    title: 'Diseñar las piezas del catálogo',
    description: 'Diseñar las piezas gráficas del catálogo con la identidad del comercio.',
    assigneeId: 'u-lucia',
  },
  {
    n: 6,
    title: 'Revisar todo y pedir la aprobación del comercio',
    description: 'Revisar el catálogo completo y pedir la aprobación del comercio antes de publicar.',
    assigneeId: 'u-mateo',
    comments: [comment('c-6', 'u-carolina', 'Devolución simulada: aprobado, se puede publicar.')],
  },
  {
    n: 7,
    title: 'Publicar el catálogo y revisarlo desde otro dispositivo',
    description: 'Publicar el catálogo aprobado y comprobar que se vea bien en el celular y en la computadora.',
    assigneeId: 'u-sofia',
  },
  {
    n: 8,
    title: 'Entrega al comercio, reunión final y cierre',
    description: 'Entregar el catálogo al comercio, hacer la reunión final y registrar el cierre del proyecto.',
    assigneeId: 'u-mateo',
  },
]

export const TASKS: Task[] = TASK_SEEDS.map((s) => ({
  id: `t-${s.n}`,
  projectId: PROJECT_ID,
  title: s.title,
  description: s.description,
  assigneeId: s.assigneeId,
  status: 'done',
  comments: s.comments ?? [],
  history: [hist(`h-${s.n}`, s.assigneeId)],
  simulated: true,
}))

// Los enlaces apuntan a las páginas de inicio de cada herramienta, no a ningún proyecto real.
export const DELIVERABLES: Deliverable[] = [
  {
    id: 'd-tablero',
    projectId: PROJECT_ID,
    title: 'Tablero de tareas del proyecto',
    description: 'Tablero donde el equipo organizó y siguió las tareas.',
    resourceType: 'Trello',
    url: 'https://trello.com',
    ownerId: 'u-mateo',
    registeredAt: T,
    reviewStatus: 'approved',
    comments: [],
    history: [deliverableHist('hd-tablero', 'u-mateo')],
    simulated: true,
  },
  {
    id: 'd-diseno',
    projectId: PROJECT_ID,
    title: 'Plantilla de diseño del catálogo',
    description: 'Plantilla con el estilo visual de las piezas del catálogo.',
    resourceType: 'Canva',
    url: 'https://www.canva.com',
    ownerId: 'u-lucia',
    registeredAt: T,
    reviewStatus: 'approved',
    comments: [comment('c-diseno', 'u-carolina', 'Devolución simulada: el estilo refleja bien la marca.')],
    history: [deliverableHist('hd-diseno', 'u-lucia')],
    simulated: true,
  },
]

const EXAMPLE_PROFILES: StudentProfile[] = [
  { id: 'u-lucia', skills: ['Diseño gráfico', 'Canva'] },
  { id: 'u-mateo', skills: ['Organización de proyectos', 'Redacción de contenidos'] },
  { id: 'u-sofia', skills: ['Fotografía y video', 'Redes sociales'] },
].map(({ id, skills }) => ({
  userId: id,
  email: '',
  phone: '',
  year: '',
  weeklyHours: '',
  skills,
  otherSkills: '',
  experience: '',
  motivation: '',
  socials: [],
  createdAt: T,
  simulated: true,
}))

const EXAMPLE_APPLICATION: ProjectApplication = {
  id: 'a-ejemplo-vivero',
  businessId: 'b-ejemplo-vivero',
  applicantId: 'u-carolina',
  projectTitle: PROJECTS[0].title,
  description: PROJECTS[0].description,
  expectedResult: PROJECTS[0].objective,
  helpTypes: ['catalog', 'photos'],
  timeframe: 'En un mes',
  contactHours: '',
  status: 'approved',
  comments: [],
  projectId: PROJECT_ID,
  createdAt: T,
  simulated: true,
}

/**
 * Estado inicial: la demo arranca vacía. Solo existen los perfiles que no se postulan:
 * el docente (entra directo) y el administrador de demostración.
 */
export function createEmptyState(): DemoState {
  return {
    schemaVersion: SCHEMA_VERSION,
    users: [
      { id: 'u-docente', name: 'Docente de demostración', role: 'supervisor' },
      { id: 'u-admin', name: 'Administrador de demostración', role: 'admin' },
    ],
    businesses: [],
    projects: [],
    tasks: [],
    deliverables: [],
    applications: [],
    studentProfiles: [],
    interests: [],
    activeUserId: null,
  }
}

/** Caso de ejemplo ficticio (Vivero Raíces) para presentar la demo rápido. Copia nueva cada vez. */
export function createExampleState(): DemoState {
  return structuredClone({
    schemaVersion: SCHEMA_VERSION,
    users: USERS,
    businesses: BUSINESSES,
    projects: PROJECTS,
    tasks: TASKS,
    deliverables: DELIVERABLES,
    applications: [EXAMPLE_APPLICATION],
    studentProfiles: EXAMPLE_PROFILES,
    interests: [],
    activeUserId: null,
  })
}

/** Estado al abrir la demo por primera vez o al restablecerla. */
export const createInitialState = createEmptyState
