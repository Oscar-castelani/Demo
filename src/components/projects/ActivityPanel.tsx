import { useDemo } from '../../hooks/useDemo'
import { Timeline } from '../common/Timeline'
import { projectTimeline } from '../../services/timelineService'
import type { Project } from '../../types'

export function ActivityPanel({ project }: { project: Project }) {
  const { state } = useDemo()
  const items = projectTimeline(state, [project])
  return (
    <section className="panel" aria-label="Actividad reciente">
      <h2>Actividad reciente</h2>
      <p className="meta">Del movimiento más nuevo al más antiguo. Los eventos los registra la plataforma; los comentarios los escriben las personas.</p>
      <Timeline items={items} empty="Todavía no hay actividad." />
    </section>
  )
}
