import { Link } from 'react-router-dom'
import { Collapsible } from '../common/Collapsible'
import { ALERT_LABELS, ALERT_ORDER, teacherAlerts } from '../../services/alertsService'
import type { DemoState, Project } from '../../types'

const ICONS = { overdue: '⏰', changes: '↺', review: '◎', unassigned: '?' } as const

interface Props {
  state: DemoState
  projects: Project[]
  /** Nivel del encabezado (2 en el panel de inicio, 3 dentro de cada proyecto). */
  headingLevel?: 2 | 3
  showProject?: boolean
  className?: string
}

/** Qué requiere atención hoy: cada alerta enlaza a la tarea o al listado de entregables. */
export function AlertsPanel({ state, projects, headingLevel = 2, showProject = true, className = 'panel' }: Props) {
  const alerts = teacherAlerts(state, projects)

  return (
    <Collapsible title={`Alertas (${alerts.length})`} headingLevel={headingLevel} className={className} openOnMobile>
      {alerts.length === 0 ? (
        <p className="empty">Sin alertas: no hay tareas vencidas, sin responsable ni esperando revisión, ni entregables con cambios pedidos.</p>
      ) : (
        ALERT_ORDER.map((kind) => {
          const items = alerts.filter((a) => a.kind === kind)
          if (items.length === 0) return null
          return (
            <section key={kind} className="alert-group" aria-label={ALERT_LABELS[kind]}>
              <h4 className="alert-title">
                <span aria-hidden="true">{ICONS[kind]}</span> {ALERT_LABELS[kind]} ({items.length})
              </h4>
              <ul className="plain-list">
                {items.map((a) => (
                  <li key={a.id}>
                    <Link to={a.to}>{a.title}</Link>
                    <p className="meta">{a.detail}{showProject && a.projectTitle ? ` · ${a.projectTitle}` : ''}</p>
                  </li>
                ))}
              </ul>
            </section>
          )
        })
      )}
    </Collapsible>
  )
}
