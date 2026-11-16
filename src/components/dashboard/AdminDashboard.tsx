import { ResetDemoButton } from '../common/ResetDemoButton'
import { ProjectSummaryCard } from '../projects/ProjectSummaryCard'
import { ROLE_LABELS, ROLE_ORDER } from '../../utils/labels'
import { Empty, Panel, type DashboardProps } from './shared'

export function AdminDashboard({ state }: DashboardProps) {
  return (
    <>
      <Panel title="Resumen de usuarios" openOnMobile>
        <ul className="plain-list">
          {ROLE_ORDER.map((r) => {
            const names = state.users.filter((u) => u.role === r).map((u) => u.name)
            return <li key={r}><strong>{ROLE_LABELS[r]}</strong> ({names.length}): {names.join(', ')}</li>
          })}
        </ul>
      </Panel>
      <Panel title="Proyectos registrados">
        {state.projects.length === 0 ? <Empty>No hay proyectos.</Empty> : (
          <div className="grid">
            {state.projects.map((p) => <ProjectSummaryCard key={p.id} state={state} project={p} />)}
          </div>
        )}
      </Panel>
      <Panel title="Herramientas de demostración">
        <p>Restablece los datos originales de la demo en este navegador.</p>
        <ResetDemoButton className="btn btn-primary" />
      </Panel>
    </>
  )
}
