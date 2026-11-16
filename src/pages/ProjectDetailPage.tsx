import { useState } from 'react'
import { Collapsible } from '../components/common/Collapsible'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ClosurePanel } from '../components/projects/ClosurePanel'
import { useDemo } from '../hooks/useDemo'
import { useActiveUser } from '../hooks/useActiveUser'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { TaskBoard } from '../components/tasks/TaskBoard'
import { DeliverablesPanel } from '../components/deliverables/DeliverablesPanel'
import { ActivityPanel } from '../components/projects/ActivityPanel'
import { ProjectSummaryCard } from '../components/projects/ProjectSummaryCard'
import { nameOf, projectsForUser } from '../services/dashboardService'

type Tab = 'summary' | 'board' | 'deliverables' | 'activity' | 'closure'

const TAB_IDS: Tab[] = ['summary', 'board', 'deliverables', 'activity', 'closure']

const TABS: { id: Tab; label: string }[] = [
  { id: 'summary', label: 'Resumen' },
  { id: 'board', label: 'Tablero de tareas' },
  { id: 'deliverables', label: 'Entregables' },
  { id: 'activity', label: 'Actividad' },
  { id: 'closure', label: 'Cierre y evaluación' },
]

export function ProjectDetailPage() {
  const { projectId } = useParams()
  const { state } = useDemo()
  const user = useActiveUser()
  const [params] = useSearchParams()
  const requested = params.get('tab') as Tab | null
  const [tab, setTab] = useState<Tab>(requested && TAB_IDS.includes(requested) ? requested : 'summary')
  const project = user ? projectsForUser(state, user).find((p) => p.id === projectId) : undefined
  useDocumentTitle(project ? project.title : 'Proyecto no disponible')
  if (!user) return null

  if (!project) {
    return (
      <div className="dashboard">
        <h1>Proyecto no disponible</h1>
        <p className="intro">El proyecto no existe o tu usuario no tiene acceso.</p>
        <Link className="btn btn-primary" to="/app/proyectos">Volver a proyectos</Link>
      </div>
    )
  }

  const business = state.businesses.find((b) => b.id === project.businessId)

  return (
    <div className="dashboard">
      <Link to="/app/proyectos" className="back-link">← Proyectos</Link>
      <h1>{project.title}</h1>

      <div role="tablist" aria-label="Secciones del proyecto" className="tabs">
        {TABS.map((t) => (
          <button key={t.id} role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`}
            className={tab === t.id ? 'tab active' : 'tab'} onClick={() => setTab(t.id)}>{t.label}</button>
        ))}
      </div>

      {tab === 'summary' ? (
        <div role="tabpanel" id="panel-summary" aria-labelledby="tab-summary">
          <Collapsible title="Descripción y objetivos" headingLevel={2} openOnMobile>
            <p>{project.description}</p>
            <p style={{ marginTop: 12 }}><strong>Objetivo:</strong> {project.objective}</p>
          </Collapsible>
          <Collapsible title="Emprendimiento" headingLevel={2}>
            <p><strong>{business?.name}</strong> · {business?.city}</p>
            <p className="meta">Responsable: {business?.ownerName} · Actividad: {business?.activity}</p>
          </Collapsible>
          <Collapsible title="Equipo y supervisión" headingLevel={2}>
            <ul className="plain-list">
              {project.memberIds.length === 0 && <li className="empty">Todavía no hay estudiantes en el equipo.</li>}
              {project.memberIds.map((id) => (
                <li key={id}>
                  {nameOf(state, id)}{' '}
                  <span className="meta">({project.coordinatorId === id ? 'estudiante, coordina el equipo' : 'estudiante'})</span>
                </li>
              ))}
              <li>{nameOf(state, project.supervisorId)} <span className="meta">(supervisor docente)</span></li>
            </ul>
          </Collapsible>
          <Collapsible title="Estado general" headingLevel={2} openOnMobile>
            <div className="grid"><ProjectSummaryCard state={state} project={project} hideLink /></div>
          </Collapsible>
        </div>
      ) : (
        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} style={{ marginTop: 24 }}>
          {tab === 'board' && <TaskBoard project={project} user={user} initialTaskId={params.get('task')} />}
          {tab === 'closure' && <ClosurePanel project={project} user={user} />}
          {tab === 'deliverables' && <DeliverablesPanel project={project} user={user} />}
          {tab === 'activity' && <ActivityPanel project={project} />}
        </div>
      )}
    </div>
  )
}
