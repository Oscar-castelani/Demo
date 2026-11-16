import { Link } from 'react-router-dom'
import { Stamp } from '../common/Stamp'
import { StatusCounts } from '../common/StatusCounts'
import { ProjectSummaryCard } from '../projects/ProjectSummaryCard'
import {
  countByStatus, nameOf, pendingDeliverableReviews, projectsForUser, recentActivity, tasksOfProjects,
} from '../../services/dashboardService'
import { Empty, Panel, type DashboardProps } from './shared'

export function SupervisorDashboard({ state, user }: DashboardProps) {
  const projects = projectsForUser(state, user)
  const tasks = tasksOfProjects(state, projects)
  const students = [...new Set(projects.flatMap((p) => p.memberIds))]
  const pending = pendingDeliverableReviews(state, projects)
  const activity = recentActivity(state, projects)

  return (
    <>
      <div className="actions" style={{ marginTop: 0 }}>
        <Link className="btn btn-primary" to="/app/postulaciones">
          Postulaciones para revisar ({state.applications.filter((a) => a.status === 'received' || a.status === 'in_review').length})
        </Link>
        <Link className="btn btn-outline" to="/app/equipos">
          Equipos ({state.interests.filter((i) => i.status === 'pending').length} postulaciones de estudiantes)
        </Link>
        <Link className="btn btn-outline" to="/app/supervision">Abrir panel de supervisión</Link>
      </div>
      <Panel title="Proyectos supervisados">
        {projects.length === 0 ? <Empty>No supervisás proyectos.</Empty> : (
          <div className="grid">
            {projects.map((p) => <ProjectSummaryCard key={p.id} state={state} project={p} />)}
          </div>
        )}
      </Panel>
      <Panel title="Tareas por estado" openOnMobile>
        <StatusCounts counts={countByStatus(tasks)} />
      </Panel>
      <Panel title="Estudiantes participantes">
        {students.length === 0 ? <Empty>Sin estudiantes.</Empty> : (
          <ul className="plain-list">{students.map((id) => <li key={id}>{nameOf(state, id)}</li>)}</ul>
        )}
      </Panel>
      <Panel title="Entregables pendientes de revisión" openOnMobile>
        {pending.length === 0 ? <Empty>No hay entregables pendientes de revisión.</Empty> : (
          <ul className="plain-list">{pending.map((d) => <li key={d.id}>{d.title}</li>)}</ul>
        )}
      </Panel>
      <Panel title="Actividad reciente">
        {activity.length === 0 ? <Empty>Todavía no hay actividad.</Empty> : (
          <ul className="plain-list">
            {activity.map(({ entry, context }) => (
              <li key={entry.id}>
                {entry.actorName}: {entry.action} · {context} · <Stamp simulated={entry.simulated} iso={entry.createdAt} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  )
}
