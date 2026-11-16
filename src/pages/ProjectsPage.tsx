import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { ProjectSummaryCard } from '../components/projects/ProjectSummaryCard'
import { projectsForUser } from '../services/dashboardService'

export function ProjectsPage() {
  const { state } = useDemo()
  const user = useActiveUser()
  useDocumentTitle('Proyectos')
  if (!user) return null
  const projects = projectsForUser(state, user)

  return (
    <div className="dashboard">
      <h1>Proyectos</h1>
      <p className="intro">Proyectos disponibles para tu usuario.</p>
      {projects.length === 0 ? (
        <p className="empty">Todavía no hay proyectos para mostrar.</p>
      ) : (
        <div className="grid" style={{ marginTop: 24 }}>
          <h2 className="visually-hidden">Listado de proyectos</h2>
          {projects.map((p) => <ProjectSummaryCard key={p.id} state={state} project={p} />)}
        </div>
      )}
    </div>
  )
}
