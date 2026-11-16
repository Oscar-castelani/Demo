import type { TaskStatus } from '../../types'
import { TASK_STATUSES } from '../../services/dashboardService'
import { TASK_STATUS_ICONS, TASK_STATUS_LABELS } from '../../utils/labels'

export function StatusCounts({ counts }: { counts: Record<TaskStatus, number> }) {
  return (
    <ul className="stat-row" aria-label="Tareas por estado">
      {TASK_STATUSES.map((s) => (
        <li className={`stat stat-${s}`} key={s}>
          <span className="stat-value">{counts[s]}</span>
          <span className="stat-label">
            <span aria-hidden="true">{TASK_STATUS_ICONS[s]}</span> {TASK_STATUS_LABELS[s]}
          </span>
        </li>
      ))}
    </ul>
  )
}
