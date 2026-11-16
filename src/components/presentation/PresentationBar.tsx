import { useState } from 'react'
import { PRESENTATION_STEPS, PRESENTATION_TOTAL } from '../../data/presentationSteps'
import { usePresentation, usePresentationActions } from '../../hooks/usePresentation'
import { ROLE_LABELS } from '../../utils/labels'

function isMobile(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
}

/** Barra del modo presentación: paso actual, rol que actúa, objetivo y botones para recorrer los 9 pasos. */
export function PresentationBar() {
  const { step } = usePresentation()
  const { goTo, showScreen, exit } = usePresentationActions()
  const [detail, setDetail] = useState(() => !isMobile())
  if (step === null) return null

  const def = PRESENTATION_STEPS[step - 1]
  const last = step === PRESENTATION_TOTAL

  return (
    <aside className="present-bar" aria-label="Modo presentación">
      <div className="present-row">
        <p className="present-title">
          <strong>Presentación · paso {step} de {PRESENTATION_TOTAL}</strong>
          <span> — {def.title}</span>
        </p>
        <button type="button" className="present-link" aria-expanded={detail} onClick={() => setDetail((d) => !d)}>
          {detail ? 'Ocultar detalle' : 'Ver detalle'}
        </button>
      </div>

      {detail && (
        <div className="present-detail">
          <p>{def.objective}</p>
          <p className="present-meta">
            Actúa: <strong>{ROLE_LABELS[def.role]}</strong>{def.userName ? ` (${def.userName})` : ''}.{' '}
            {step === 1
              ? 'Este paso parte de la demo vacía.'
              : 'Este paso parte de un escenario ficticio: lo ya cargado está marcado como simulado.'}
          </p>
        </div>
      )}

      <div className="present-actions">
        <button type="button" className="btn btn-sm present-btn" disabled={step === 1} onClick={() => goTo(step - 1)}>
          ← Anterior
        </button>
        <button type="button" className="btn btn-sm present-btn" onClick={() => showScreen(step)}>
          Ir a la pantalla
        </button>
        <button type="button" className="btn btn-sm present-btn present-primary" onClick={() => (last ? exit() : goTo(step + 1))}>
          {last ? 'Terminar' : 'Siguiente →'}
        </button>
        <button type="button" className="btn btn-sm present-btn" onClick={exit}>Salir</button>
      </div>
    </aside>
  )
}
