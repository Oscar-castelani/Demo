import { useDemo } from '../../hooks/useDemo'
import { Stamp } from '../common/Stamp'
import { recentActivity } from '../../services/dashboardService'
import { ROLE_LABELS } from '../../utils/labels'
import type { Project } from '../../types'

export function ActivityPanel({ project }: { project: Project }) {
  const { state } = useDemo()
  const items = recentActivity(state, [project], 50)
  return (
    <section className="panel" aria-label="Actividad reciente">
      <h2>Actividad reciente</h2>
      {items.length === 0 ? (
        <p className="empty">Todavía no hay actividad.</p>
      ) : (
        <ul className="plain-list">
          {items.map(({ entry, context }) => (
            <li key={entry.id}>
              <p>{entry.actorName} ({ROLE_LABELS[entry.actorRole]}): {entry.action}</p>
              <p className="meta">{context} · <Stamp simulated={entry.simulated} iso={entry.createdAt} /></p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
