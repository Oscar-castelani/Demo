import type { ReactNode } from 'react'
import type { DemoState, User } from '../../types'
import type { Observation } from '../../services/dashboardService'
import { Collapsible } from '../common/Collapsible'
import { Stamp } from '../common/Stamp'
import { ROLE_LABELS } from '../../utils/labels'

export interface DashboardProps {
  state: DemoState
  user: User
}

export function Panel({ title, children, openOnMobile = false }: { title: string; children: ReactNode; openOnMobile?: boolean }) {
  return (
    <Collapsible title={title} openOnMobile={openOnMobile}>
      {children}
    </Collapsible>
  )
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="empty">{children}</p>
}

export function ObservationList({ items }: { items: Observation[] }) {
  if (items.length === 0) return <Empty>Todavía no hay observaciones docentes.</Empty>
  return (
    <ul className="plain-list">
      {items.map(({ comment, context }) => (
        <li key={comment.id}>
          <p>{comment.content}</p>
          <p className="meta">
            {comment.authorName} ({ROLE_LABELS[comment.authorRole]}) · {context} · <Stamp simulated={comment.simulated} iso={comment.createdAt} />
          </p>
        </li>
      ))}
    </ul>
  )
}
