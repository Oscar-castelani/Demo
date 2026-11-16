import type { DemoState, Project } from '../types'
import { countByStatus, deliverablesOfProjects, nameOf, progressPercent, tasksOfProjects } from './dashboardService'
import { projectTimeline } from './timelineService'
import {
  FULFILLMENT_LABELS, PROJECT_STATUS_LABELS, REVIEW_LABELS, ROLE_LABELS, TASK_STATUS_LABELS,
} from '../utils/labels'
import { isSafeUrl } from '../utils/url'

const SIM = ' *(dato simulado)*'

/** Una celda de tabla en una sola línea y sin romper las columnas. */
const cell = (text: string): string => text.replace(/\|/g, '\\|').replace(/\s*\n\s*/g, ' ').trim() || '—'

/** El estado de una tarea o entregable es simulado solo si su último movimiento lo es (si alguien lo cambió en la demo, ya es real). */
function lastIsSimulated(history: { simulated: boolean }[], fallback: boolean): boolean {
  return history.length > 0 ? history[history.length - 1].simulated : fallback
}

function when(simulated: boolean, iso: string): string {
  return simulated ? 'dato simulado, sin fecha' : new Date(iso).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })
}

export function summaryFileName(project: Project): string {
  const slug = project.title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 50)
  return `resumen-${slug || 'proyecto'}.md`
}

/**
 * Resumen del proyecto en Markdown. Solo incluye lo que existe en la demo en ese momento; lo simulado se
 * marca expresamente y no se muestran teléfonos ni correos.
 */
export function projectSummaryMarkdown(state: DemoState, project: Project, now: Date = new Date()): string {
  const tasks = tasksOfProjects(state, [project])
  const deliverables = deliverablesOfProjects(state, [project])
  const counts = countByStatus(tasks)
  const business = state.businesses.find((b) => b.id === project.businessId)
  const profileOf = (id: string) => state.studentProfiles.find((p) => p.userId === id)
  const L: string[] = []

  L.push(`# Resumen del proyecto: ${project.title}`, '')
  L.push(
    `Generado el ${now.toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })} desde **TUCE Conecta**, una demostración académica (TUCE, UNPAZ).`,
    '',
    '> Este resumen refleja el estado de la demo en el momento de la descarga. Es una demostración: los datos marcados como *(dato simulado)* son ficticios y no hechos históricos.',
    '',
  )

  L.push('## Datos generales', '')
  L.push(`- **Estado del proyecto:** ${PROJECT_STATUS_LABELS[project.status]}`)
  L.push(`- **Comercio:** ${business ? `${business.name} (${business.activity}; ${business.city})` : '—'}`)
  L.push(`- **Persona a cargo del comercio:** ${business?.ownerName ?? '—'}`)
  L.push(`- **Docente supervisor:** ${nameOf(state, project.supervisorId)}`)
  L.push(`- **Coordina el equipo:** ${project.coordinatorId ? nameOf(state, project.coordinatorId) : 'Sin definir'}`)
  L.push(`- **Lugares del equipo:** ${project.memberIds.length} de ${project.maxMembers}`)
  L.push('', '### Descripción', '', project.description, '', '### Objetivo', '', project.objective, '')

  L.push('## Equipo', '')
  if (project.memberIds.length === 0) L.push('Todavía no hay estudiantes en el equipo.', '')
  else {
    for (const id of project.memberIds) {
      const p = profileOf(id)
      const skills = p ? [...p.skills, ...(p.otherSkills ? [p.otherSkills] : [])].join(', ') : ''
      const role = project.coordinatorId === id ? ' (coordina)' : ''
      L.push(`- **${nameOf(state, id)}**${role}${skills ? ` — habilidades: ${skills}` : ''}${p?.simulated ? SIM : ''}`)
    }
    L.push('')
  }

  L.push('## Avance', '')
  L.push(`Tareas finalizadas: **${counts.done} de ${tasks.length}** (${progressPercent(tasks)} %).`, '')
  L.push('| Estado | Tareas |', '|---|---|')
  for (const s of ['pending', 'in_progress', 'in_review', 'done'] as const) L.push(`| ${TASK_STATUS_LABELS[s]} | ${counts[s]} |`)
  L.push('')

  L.push('## Tareas', '')
  if (tasks.length === 0) L.push('Todavía no hay tareas.', '')
  else {
    L.push('| Tarea | Responsable | Estado | Fecha límite | Comentarios |', '|---|---|---|---|---|')
    for (const t of tasks) {
      L.push(`| ${cell(t.title)} | ${cell(nameOf(state, t.assigneeId))} | ${TASK_STATUS_LABELS[t.status]}${lastIsSimulated(t.history, t.simulated) ? ' (simulado)' : ''} | ${t.dueDate ?? '—'} | ${t.comments.length} |`)
    }
    L.push('')
  }

  L.push('## Entregables', '')
  if (deliverables.length === 0) L.push('Todavía no hay entregables.', '')
  else {
    L.push('| Entregable | Tipo | Revisión | Enlace |', '|---|---|---|---|')
    for (const d of deliverables) {
      const link = isSafeUrl(d.url) ? d.url : 'enlace no válido'
      L.push(`| ${cell(d.title)} | ${cell(d.resourceType)} | ${REVIEW_LABELS[d.reviewStatus]}${lastIsSimulated(d.history, d.simulated) ? ' (simulado)' : ''} | ${cell(link)} |`)
    }
    L.push('')
  }

  const observations = [
    ...tasks.flatMap((t) => t.comments.map((c) => ({ c, context: t.title }))),
    ...deliverables.flatMap((d) => d.comments.map((c) => ({ c, context: d.title }))),
  ].filter(({ c }) => c.authorRole === 'supervisor' || c.authorRole === 'business')

  L.push('## Observaciones del docente y devoluciones del comercio', '')
  if (observations.length === 0) L.push('Todavía no hay observaciones ni devoluciones.', '')
  else {
    for (const { c, context } of observations) {
      L.push(`- **${c.authorName}** (${ROLE_LABELS[c.authorRole]}) sobre «${context}» — ${when(c.simulated, c.createdAt)}${c.simulated ? SIM : ''}`)
      L.push(`  > ${c.content.replace(/\s*\n\s*/g, ' ')}`)
    }
    L.push('')
  }

  L.push('## Evaluación final', '')
  const closure = project.closure
  if (!closure) L.push('Todavía no hay evaluación final registrada.', '')
  else {
    const mark = (f: keyof typeof closure & ('fulfillment' | 'businessFeedback' | 'supervisorNotes' | 'teamReflection')) =>
      closure.simulatedFields.includes(f) ? SIM : ''
    L.push(`- **Estado de cumplimiento:** ${FULFILLMENT_LABELS[closure.fulfillment]}${mark('fulfillment')}`)
    L.push(`- **Devolución del comercio:** ${closure.businessFeedback || 'Sin registrar'}${closure.businessFeedback ? mark('businessFeedback') : ''}`)
    L.push(`- **Observaciones del docente:** ${closure.supervisorNotes || 'Sin registrar'}${closure.supervisorNotes ? mark('supervisorNotes') : ''}`)
    L.push(`- **Reflexión del equipo:** ${closure.teamReflection || 'Sin registrar'}${closure.teamReflection ? mark('teamReflection') : ''}`)
    L.push('')
  }

  const timeline = projectTimeline(state, [project], 200).reverse()
  L.push('## Línea de tiempo', '', 'De lo más antiguo a lo más nuevo. Los eventos los registra la plataforma; los comentarios los escriben las personas.', '')
  if (timeline.length === 0) L.push('Todavía no hay movimientos.', '')
  else {
    for (const i of timeline) {
      const kind = i.kind === 'event' ? 'Evento' : 'Comentario'
      L.push(`- **${kind}** — ${i.actorName} (${ROLE_LABELS[i.actorRole]}), ${when(i.simulated, i.createdAt)}${i.simulated ? SIM : ''}: ${i.text.replace(/\s*\n\s*/g, ' ')}${i.context ? ` _(${i.context})_` : ''}`)
    }
    L.push('')
  }

  return L.join('\n')
}

/** Descarga el texto como archivo, sin servidor: se arma un Blob y se simula el clic en un enlace. */
export function downloadMarkdown(fileName: string, text: string): void {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
