import { Link } from 'react-router-dom'
import type { DemoState, Project } from '../../types'
import { nameOf, progressPercent, tasksOfProjects } from '../../services/dashboardService'
import { PROJECT_STATUS_LABELS } from '../../utils/labels'

interface Props {
  state: DemoState
  project: Project
  hideLink?: boolean
}

export function ProjectSummaryCard({ state, project, hideLink = false }: Props) {
  const business = state.businesses.find((b) => b.id === project.businessId)
  const pct = progressPercent(tasksOfProjects(state, [project]))
  return (
    <article className="card project-card">
      <span className="badge badge-project">{PROJECT_STATUS_LABELS[project.status]}</span>
      <h3>{project.title}</h3>
      <p>{business?.name} · {business?.city}</p>
      <p className="meta">Supervisor: {nameOf(state, project.supervisorId)}</p>
      <p className="meta">Equipo: {project.memberIds.map((id) => nameOf(state, id)).join(', ')}</p>
      <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Avance del proyecto">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="meta">Avance: {pct} %</p>
      {!hideLink && (
        <Link className="btn btn-outline btn-sm" style={{ marginTop: 14 }} to={`/app/proyectos/${project.id}`}>
          Ver detalle<span className="visually-hidden"> de {project.title}</span>
        </Link>
      )}
    </article>
  )
}
