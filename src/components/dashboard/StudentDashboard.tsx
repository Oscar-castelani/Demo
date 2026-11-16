import { Link } from 'react-router-dom'
import { StatusBadge } from '../common/Badges'
import { StatusCounts } from '../common/StatusCounts'
import { ProjectSummaryCard } from '../projects/ProjectSummaryCard'
import { countByStatus, projectsForUser, supervisorObservations, tasksOfProjects } from '../../services/dashboardService'
import { Empty, ObservationList, Panel, type DashboardProps } from './shared'

export function StudentDashboard({ state, user }: DashboardProps) {
  const projects = projectsForUser(state, user)
  const myTasks = tasksOfProjects(state, projects).filter((t) => t.assigneeId === user.id)
  const open = myTasks.filter((t) => t.status !== 'done')

  return (
    <>
      <Link className="btn btn-primary" to="/app/abiertos">Ver proyectos abiertos</Link>
      <Panel title="Mis proyectos" openOnMobile>
        {projects.length === 0 ? (
          <Empty>Todavía no estás en ningún equipo. Postulate a un proyecto abierto.</Empty>
        ) : (
          <div className="grid">
            {projects.map((p) => <ProjectSummaryCard key={p.id} state={state} project={p} />)}
          </div>
        )}
      </Panel>
      <Panel title="Mis tareas" openOnMobile>
        <StatusCounts counts={countByStatus(myTasks)} />
        {open.length === 0 ? (
          <Empty>No tenés tareas pendientes, en proceso ni en revisión.</Empty>
        ) : (
          <ul className="plain-list">
            {open.map((t) => (
              <li key={t.id}>{t.title} <StatusBadge status={t.status} /></li>
            ))}
          </ul>
        )}
      </Panel>
      <Panel title="Últimas observaciones docentes">
        <ObservationList items={supervisorObservations(state, projects)} />
      </Panel>
    </>
  )
}
