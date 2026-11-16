import { TRACKER_STEPS } from '../../utils/labels'
import type { Stage } from '../../services/applicationService'

/** Seguimiento por etapas. Cada etapa se indica con texto e ícono, no solo con color. */
export function ApplicationTracker({ stage }: { stage: Stage }) {
  return (
    <ol className="tracker" aria-label="Seguimiento de la postulación">
      {TRACKER_STEPS.map((label, i) => {
        const done = stage.stopped ? i === 0 : i < stage.index
        const current = !stage.stopped && i === stage.index
        const state = done ? 'done' : current ? 'current' : 'todo'
        const mark = done ? '✔' : current ? '●' : '○'
        const hidden = done ? 'completada' : current ? 'etapa actual' : 'pendiente'
        return (
          <li key={label} className={`tracker-step tracker-${state}`} aria-current={current ? 'step' : undefined}>
            <span className="tracker-mark" aria-hidden="true">{mark}</span>
            <span className="tracker-label">{label}</span>
            <span className="visually-hidden"> ({hidden})</span>
          </li>
        )
      })}
    </ol>
  )
}
