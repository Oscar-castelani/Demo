import { Stamp } from './Stamp'
import { ROLE_LABELS } from '../../utils/labels'
import type { TimelineItem } from '../../services/timelineService'

/**
 * Línea de tiempo: diferencia con texto y forma los eventos automáticos de la plataforma ("Evento")
 * de los comentarios escritos por personas ("Comentario").
 */
export function Timeline({ items, empty = 'Todavía no hay movimientos.' }: { items: TimelineItem[]; empty?: string }) {
  if (items.length === 0) return <p className="empty">{empty}</p>
  return (
    <ol className="timeline">
      {items.map((i) => (
        <li key={i.id} className={`timeline-item timeline-${i.kind}`}>
          <span className="timeline-dot" aria-hidden="true">{i.kind === 'event' ? '●' : '✎'}</span>
          <div className="timeline-body">
            <p className="timeline-head">
              <span className="timeline-kind">{i.kind === 'event' ? 'Evento' : 'Comentario'}</span>{' '}
              <span className="meta">
                {i.actorName} ({ROLE_LABELS[i.actorRole]}) · <Stamp simulated={i.simulated} iso={i.createdAt} />
              </span>
            </p>
            <p className={i.kind === 'comment' ? 'timeline-comment' : 'timeline-event'}>{i.text}</p>
            {i.context && <p className="meta">{i.context}</p>}
          </div>
        </li>
      ))}
    </ol>
  )
}
