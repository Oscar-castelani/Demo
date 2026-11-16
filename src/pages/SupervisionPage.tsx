import { Link } from 'react-router-dom'
import { Collapsible } from '../components/common/Collapsible'
import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ReviewBadge } from '../components/common/Badges'
import { Stamp } from '../components/common/Stamp'
import { StatusCounts } from '../components/common/StatusCounts'
import {
  TASK_STATUSES, countByStatus, deliverablesOfProjects, memberLoad, nameOf, progressPercent, projectsForUser,
  recentComments, tasksOfProjects,
} from '../services/dashboardService'
import { projectTimeline } from '../services/timelineService'
import { Timeline } from '../components/common/Timeline'
import { AlertsPanel } from '../components/dashboard/AlertsPanel'
import { PROJECT_STATUS_LABELS, ROLE_LABELS, TASK_STATUS_LABELS } from '../utils/labels'
import { isSafeUrl } from '../utils/url'
import type { Project } from '../types'

function ProjectSupervision({ project }: { project: Project }) {
  const { state } = useDemo()
  const tasks = tasksOfProjects(state, [project])
  const inReview = tasks.filter((t) => t.status === 'in_review')
  const deliverables = deliverablesOfProjects(state, [project])
  const comments = recentComments(state, [project], 5)
  const activity = projectTimeline(state, [project], 8)
  const base = `/app/proyectos/${project.id}`

  return (
    <section className="supervision" aria-label={project.title}>
      <h2 className="project-title">{project.title}</h2>
      <p className="meta">
        <span className="badge badge-project">{PROJECT_STATUS_LABELS[project.status]}</span>{' '}
        Avance: {progressPercent(tasks)} % · <Link to={`${base}?tab=closure`}>Cierre y evaluación final</Link>
      </p>

      <AlertsPanel state={state} projects={[project]} headingLevel={3} showProject={false} className="panel" />

      <Collapsible title="Tareas por estado" headingLevel={3} openOnMobile>
        <StatusCounts counts={countByStatus(tasks)} />
      </Collapsible>

      <Collapsible title="Integrantes y su avance" headingLevel={3} openOnMobile>
        <div className="table-wrap">
          <table className="table">
            <caption className="visually-hidden">Tareas por estado de cada integrante</caption>
            <thead>
              <tr>
                <th scope="col">Estudiante</th>
                {TASK_STATUSES.map((s) => <th scope="col" key={s}>{TASK_STATUS_LABELS[s]}</th>)}
              </tr>
            </thead>
            <tbody>
              {memberLoad(state, project).map((m) => (
                <tr key={m.userId}>
                  <th scope="row">{nameOf(state, m.userId)}</th>
                  {TASK_STATUSES.map((s) => <td key={s}>{m.counts[s]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Collapsible>

      <Collapsible title={`Tareas pendientes de revisión (${inReview.length})`} headingLevel={3} openOnMobile>
        {inReview.length === 0 ? (
          <p className="empty">No hay tareas esperando revisión.</p>
        ) : (
          <ul className="plain-list">
            {inReview.map((t) => (
              <li key={t.id}>
                <strong>{t.title}</strong>
                <p className="meta">Responsable: {nameOf(state, t.assigneeId)}</p>
                <Link className="btn btn-primary btn-sm" to={`${base}?tab=board&task=${t.id}`}>
                  Revisar<span className="visually-hidden"> {t.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Collapsible>

      <Collapsible title={`Entregables (${deliverables.length})`} headingLevel={3}>
        {deliverables.length === 0 ? (
          <p className="empty">Todavía no hay entregables.</p>
        ) : (
          <ul className="plain-list">
            {deliverables.map((d) => (
              <li key={d.id}>
                <strong>{d.title}</strong> <ReviewBadge status={d.reviewStatus} />
                <p className="meta">{d.resourceType}</p>
                {isSafeUrl(d.url) && (
                  <a href={d.url} target="_blank" rel="noopener noreferrer">Abrir enlace (se abre en otra pestaña)</a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Collapsible>

      <Collapsible title="Comentarios recientes" headingLevel={3}>
        {comments.length === 0 ? (
          <p className="empty">Todavía no hay comentarios.</p>
        ) : (
          <ul className="plain-list">
            {comments.map(({ comment, context }) => (
              <li key={comment.id}>
                <p>{comment.content}</p>
                <p className="meta">
                  {comment.authorName} ({ROLE_LABELS[comment.authorRole]}) · {context} ·{' '}
                  <Stamp simulated={comment.simulated} iso={comment.createdAt} />
                </p>
              </li>
            ))}
          </ul>
        )}
      </Collapsible>

      <Collapsible title="Actividad del equipo" headingLevel={3}>
        <Timeline items={activity} empty="Todavía no hay actividad." />
      </Collapsible>
    </section>
  )
}

export function SupervisionPage() {
  const { state } = useDemo()
  const user = useActiveUser()
  useDocumentTitle('Supervisión docente')
  if (!user) return null

  if (user.role !== 'supervisor' && user.role !== 'admin') {
    return (
      <div className="dashboard">
        <h1>Supervisión docente</h1>
        <p className="intro">Esta pantalla es para supervisores docentes.</p>
        <Link className="btn btn-primary" to="/app">Volver al panel</Link>
      </div>
    )
  }

  const projects = projectsForUser(state, user)
  return (
    <div className="dashboard">
      <h1>Supervisión docente</h1>
      <p className="intro">Estado de los proyectos de un vistazo, sin pedir información al equipo.</p>
      {projects.length === 0 ? (
        <p className="empty">No hay proyectos para supervisar.</p>
      ) : (
        projects.map((p) => <ProjectSupervision key={p.id} project={p} />)
      )}
    </div>
  )
}
