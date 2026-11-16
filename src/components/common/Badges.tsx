import type { ReviewStatus, TaskStatus } from '../../types'
import { REVIEW_ICONS, REVIEW_LABELS, TASK_STATUS_ICONS, TASK_STATUS_LABELS } from '../../utils/labels'

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`badge badge-${status}`}>
      <span aria-hidden="true">{TASK_STATUS_ICONS[status]}</span> {TASK_STATUS_LABELS[status]}
    </span>
  )
}

export function ReviewBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`badge badge-review-${status}`}>
      <span aria-hidden="true">{REVIEW_ICONS[status]}</span> {REVIEW_LABELS[status]}
    </span>
  )
}

export function SimulatedTag() {
  return <span className="badge badge-sim">Dato simulado</span>
}
