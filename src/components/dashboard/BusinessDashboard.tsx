import { Link } from 'react-router-dom'
import { ReviewBadge } from '../common/Badges'
import { applicationStage } from '../../services/applicationService'
import { APPLICATION_STATUS_LABELS, TRACKER_STEPS } from '../../utils/labels'
import { ProjectSummaryCard } from '../projects/ProjectSummaryCard'
import {
  deliverablesOfProjects, nameOf, pendingDeliverableReviews, progressPercent, projectsForUser, tasksOfProjects,
} from '../../services/dashboardService'
import { isSafeUrl } from '../../utils/url'
import { Empty, Panel, type DashboardProps } from './shared'

export function BusinessDashboard({ state, user }: DashboardProps) {
  const projects = projectsForUser(state, user)
  const tasks = tasksOfProjects(state, projects)
  const deliverables = deliverablesOfProjects(state, projects)
  const pending = pendingDeliverableReviews(state, projects)
  const memberIds = [...new Set(projects.flatMap((p) => p.memberIds))]
  const myApps = state.applications.filter((a) => a.applicantId === user.id)

  return (
    <>
      <Panel title="Mis postulaciones" openOnMobile>
        {myApps.length === 0 ? (
          <Empty>Todavía no postulaste ningún proyecto.</Empty>
        ) : (
          <ul className="plain-list">
            {myApps.map((a) => (
              <li key={a.id}>
                <strong>{a.projectTitle}</strong>
                <p className="meta">{APPLICATION_STATUS_LABELS[a.status]} · Etapa: {TRACKER_STEPS[applicationStage(state, a).index]}</p>
              </li>
            ))}
          </ul>
        )}
        <Link className="btn btn-outline btn-sm" style={{ marginTop: 12 }} to="/app/postulaciones">
          {myApps.length === 0 ? 'Postular un proyecto' : 'Ver seguimiento'}
        </Link>
      </Panel>
      <Panel title="Mis proyectos">
        {projects.length === 0 ? (
          <Empty>Todavía no tenés proyectos.</Empty>
        ) : (
          <div className="grid">
            {projects.map((p) => <ProjectSummaryCard key={p.id} state={state} project={p} />)}
          </div>
        )}
        <p className="meta">Estado general: {progressPercent(tasks)} % de las tareas finalizadas.</p>
      </Panel>
      <Panel title="Integrantes del equipo">
        {memberIds.length === 0 ? <Empty>Sin integrantes.</Empty> : (
          <ul className="plain-list">{memberIds.map((id) => <li key={id}>{nameOf(state, id)}</li>)}</ul>
        )}
      </Panel>
      <Panel title="Entregables disponibles">
        {deliverables.length === 0 ? <Empty>Todavía no hay entregables.</Empty> : (
          <ul className="plain-list">
            {deliverables.map((d) => (
              <li key={d.id}>
                <strong>{d.title}</strong> <ReviewBadge status={d.reviewStatus} />
                <p className="meta">{d.resourceType} · {d.description}</p>
                {isSafeUrl(d.url) && (
                  <a href={d.url} target="_blank" rel="noopener noreferrer">Abrir enlace (se abre en otra pestaña)</a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Revisiones pendientes" openOnMobile>
        {pending.length === 0 ? <Empty>No tenés entregables pendientes de revisión.</Empty> : (
          <ul className="plain-list">{pending.map((d) => <li key={d.id}>{d.title}</li>)}</ul>
        )}
      </Panel>
    </>
  )
}
