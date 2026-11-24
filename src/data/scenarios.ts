import type { DemoState, Project, User } from '../types'
import { createEmptyState, createExampleState } from './demoData'
import {
  addApplicationComment, applyToProject, reviewApplication, submitBusinessApplication, submitStudentProfile,
} from '../services/applicationService'
import { respondToInterest, setCoordinator } from '../services/teamService'
import { changeTaskStatus, createTask } from '../services/taskService'
import { todayString } from '../services/alertsService'
import { registerDeliverable, reviewDeliverable } from '../services/deliverableService'
import type { StudentValues } from '../utils/applicationValidation'

/**
 * Escenarios reproducibles: estados de la demo armados paso a paso con la misma lógica que usa la
 * aplicación. Todo es ficticio y queda marcado como simulado.
 */
export interface Scenario {
  id: string
  /** Paso del recorrido guiado en el que queda la demo (1 a 9); 10 = proyecto finalizado. */
  step: number
  label: string
  /** Para qué sirve cargarlo. */
  purpose: string
  /** Si se ofrece en la pantalla de ingreso (los demás quedan sin ofrecer). */
  listed: boolean
  build: () => DemoState
}

const BUSINESS = {
  businessName: 'Vivero Raíces (ejemplo)', activity: 'Venta de plantas, macetas e insumos de jardinería',
  city: 'Provincia de Buenos Aires', instagram: '', facebook: '', website: '', currentChannels: '',
  ownerName: 'Carolina Vega', phone: '11 5555 0100', email: '',
  projectTitle: 'Catálogo digital de productos',
  description: 'Armar un catálogo digital con fotos, descripciones y categorías, para que los clientes conozcan los productos y hagan sus pedidos por mensaje.',
  expectedResult: 'Disponer de un catálogo digital publicado y una forma simple de recibir pedidos.',
  helpTypes: ['catalog' as const, 'photos' as const], timeframe: 'En un mes', contactHours: '', accepted: true,
}

const student = (name: string, skills: string[]): StudentValues => ({
  name, email: `${name.split(' ')[0].toLowerCase()}@ejemplo.com`, phone: '', year: '2.º año', weeklyHours: '5 a 8 horas',
  skills, otherSkills: '', experience: '', motivation: '', instagram: '', linkedin: '', website: '', accepted: true,
})

// Marca todo como simulado: no muestra fechas y lleva la etiqueta "Dato simulado".
function simulated(state: DemoState): DemoState {
  const mark = <T extends { simulated: boolean }>(items: T[]): T[] => items.map((i) => ({ ...i, simulated: true }))
  return {
    ...state,
    applications: state.applications.map((a) => ({ ...a, simulated: true, comments: mark(a.comments) })),
    studentProfiles: mark(state.studentProfiles),
    interests: mark(state.interests),
    tasks: state.tasks.map((t) => ({ ...t, simulated: true, comments: mark(t.comments), history: mark(t.history) })),
    deliverables: state.deliverables.map((d) => ({ ...d, simulated: true, comments: mark(d.comments), history: mark(d.history) })),
    activeUserId: null,
  }
}

const user = (s: DemoState, name: string): User => s.users.find((u) => u.name === name)!
const project = (s: DemoState): Project => s.projects[s.projects.length - 1]

/** Avanza la demo hasta el paso pedido (1 a 9). */
function upTo(step: number): DemoState {
  let s = createEmptyState()
  if (step <= 1) return s
  const docente = user(s, 'Docente de demostración')

  // 2. Un comercio postuló.
  s = submitBusinessApplication(s, BUSINESS)
  const appId = s.applications[0].id
  if (step <= 2) return simulated(s)

  // 3. El docente revisó, pidió información, el comercio respondió y se aprobó: proyecto abierto.
  s = reviewApplication(s, appId, 'start_review', '', 3, docente)
  s = reviewApplication(s, appId, 'request_info', '¿Tienen fotos de los productos?', 3, docente)
  s = addApplicationComment(s, appId, 'Sí, tenemos fotos de casi todos los productos.', user(s, 'Carolina Vega'))
  s = reviewApplication(s, appId, 'approve', 'Aprobado: buscamos un equipo de tres estudiantes.', 3, docente)
  if (step <= 3) return simulated(s)

  // 4. Hay estudiantes con perfil, todavía sin postularse al proyecto.
  s = submitStudentProfile(s, student('Lucía Fernández', ['Diseño gráfico', 'Canva']))
  s = submitStudentProfile(s, student('Mateo Gómez', ['Organización de proyectos', 'Redacción de contenidos']))
  s = submitStudentProfile(s, student('Sofía Ledesma', ['Fotografía y video', 'Redes sociales']))
  if (step <= 4) return simulated(s)

  // 5. Dos estudiantes se postularon al proyecto; el docente todavía no armó el equipo.
  s = applyToProject(s, project(s).id, 'Me interesa diseñar el catálogo.', user(s, 'Lucía Fernández'))
  s = applyToProject(s, project(s).id, 'Puedo coordinar y redactar las descripciones.', user(s, 'Mateo Gómez'))
  if (step <= 5) return simulated(s)

  // 6. Equipo armado, con coordinador y todavía sin tareas.
  for (const i of s.interests) s = respondToInterest(s, i.id, 'accepted', docente)
  s = setCoordinator(s, project(s).id, user(s, 'Mateo Gómez').id, docente)
  if (step <= 6) return simulated(s)

  // 7. El equipo trabaja: una tarea finalizada, una esperando revisión, una en proceso y una pendiente.
  const lucia = user(s, 'Lucía Fernández')
  const mateo = user(s, 'Mateo Gómez')
  const pid = project(s).id
  // La tercera tiene fecha límite vencida y la cuarta no tiene responsable: así el docente ve alertas.
  const tareas: [string, User | null, string | undefined][] = [
    ['Juntar fotos y datos de los productos', mateo, undefined],
    ['Definir categorías del catálogo', lucia, undefined],
    ['Diseñar las piezas del catálogo', lucia, daysAgo(2)],
    ['Redactar las descripciones', null, undefined],
  ]
  for (const [title, who, due] of tareas) {
    s = addTask(s, pid, title, who, due, who ?? mateo)
  }
  const ids = s.tasks.map((t) => t.id)
  s = move(s, ids[0], ['in_progress', 'in_review'], mateo)
  s = move(s, ids[0], ['done'], docente)
  s = move(s, ids[1], ['in_progress', 'in_review'], lucia)
  s = move(s, ids[2], ['in_progress'], lucia)
  if (step <= 7) return simulated(s)

  // 8. Todas las tareas finalizadas; falta registrar entregables.
  s = move(s, ids[1], ['done'], docente)
  s = move(s, ids[2], ['in_review'], lucia)
  s = move(s, ids[2], ['done'], docente)
  s = move(s, ids[3], ['in_progress', 'in_review'], mateo)
  s = move(s, ids[3], ['done'], docente)
  if (step <= 8) return simulated(s)

  // 9. Entregable aprobado por el comercio: listo para que el docente cierre el proyecto.
  s = registerDeliverable(s, {
    projectId: pid, taskId: null, title: 'Catálogo digital', description: 'Catálogo con las categorías y las piezas diseñadas.',
    resourceType: 'Google Drive', url: 'https://drive.google.com',
  }, lucia)
  s = reviewDeliverable(s, s.deliverables[0].id, 'approved', 'Se ve muy bien.', user(s, 'Carolina Vega'))
  return simulated(s)
}

function addTask(s: DemoState, projectId: string, title: string, who: User | null, dueDate: string | undefined, creator: User): DemoState {
  return createTask(s, { projectId, title, description: '', assigneeId: who?.id ?? null, dueDate }, creator)
}

/** Fecha de hace `n` días (AAAA-MM-DD), para que la fecha límite del escenario esté vencida al cargarlo. */
function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return todayString(d)
}

function move(s: DemoState, taskId: string, path: ('in_progress' | 'in_review' | 'done')[], actor: User): DemoState {
  for (const status of path) s = changeTaskStatus(s, taskId, status, actor)
  return s
}

export const SCENARIOS: Scenario[] = [
  { id: 'vacio', step: 1, label: 'Demo vacía', listed: false, purpose: 'Empezar desde cero: el comercio todavía no postuló.', build: () => upTo(1) },
  { id: 'postulado', step: 2, label: 'Proyecto recién postulado', listed: true, purpose: 'Probar la revisión del docente: pedir información, aprobar o no aprobar.', build: () => upTo(2) },
  { id: 'abierto', step: 3, label: 'Proyecto aprobado y abierto', listed: false, purpose: 'Un estudiante crea su perfil.', build: () => upTo(3) },
  { id: 'perfiles', step: 4, label: 'Estudiantes con perfil', listed: false, purpose: 'Un estudiante se postula al proyecto abierto.', build: () => upTo(4) },
  { id: 'postulantes', step: 5, label: 'Estudiantes postulados', listed: true, purpose: 'Probar cómo el docente acepta estudiantes y arma el equipo.', build: () => upTo(5) },
  { id: 'equipo', step: 6, label: 'Equipo armado, sin tareas', listed: true, purpose: 'Probar el tablero: crear tareas y moverlas.', build: () => upTo(6) },
  { id: 'revision', step: 7, label: 'Tareas esperando revisión', listed: true, purpose: 'Probar la revisión del docente: observaciones, correcciones y aprobación.', build: () => upTo(7) },
  { id: 'sin-entregables', step: 8, label: 'Tareas listas, sin entregables', listed: false, purpose: 'Registrar entregables y que el comercio los revise.', build: () => upTo(8) },
  { id: 'listo-cierre', step: 9, label: 'Listo para cerrar', listed: true, purpose: 'Probar la evaluación final y el cierre del proyecto.', build: () => upTo(9) },
  { id: 'finalizado', step: 10, label: 'Proyecto finalizado (ejemplo)', listed: true, purpose: 'Ver cómo queda un proyecto terminado, con evaluación final.', build: () => createExampleState() },
]

export function scenarioForStep(step: number): Scenario | undefined {
  return SCENARIOS.find((s) => s.step === step)
}
