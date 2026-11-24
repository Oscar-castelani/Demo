import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { SCENARIOS, type Scenario } from '../../data/scenarios'
import { ConfirmDialog } from './ConfirmDialog'

// El proyecto finalizado ya tiene su propio botón ("Cargar ejemplo").
const LISTED = SCENARIOS.filter((s) => s.listed && s.id !== 'finalizado')

/** Escenarios para probar una parte del recorrido sin hacer todos los pasos anteriores. */
export function ScenarioPicker() {
  const { state, dispatch } = useDemo()
  const [pending, setPending] = useState<Scenario | null>(null)
  const [message, setMessage] = useState('')
  const hasData = state.applications.length > 0 || state.studentProfiles.length > 0

  const load = (scenario: Scenario) => {
    dispatch({ type: 'replace', state: scenario.build() })
    setPending(null)
    setMessage(`Escenario cargado: ${scenario.label}.`)
  }

  return (
    <details className="scenario-box">
      <summary>Escenarios para probar una parte del recorrido</summary>
      <p className="meta">
        Cada escenario arma, con datos ficticios, la demo en un punto del recorrido. Reemplaza lo que hayas cargado.
      </p>
      <ul className="plain-list">
        {LISTED.map((s) => (
          <li key={s.id}>
            <strong>{s.label}</strong>
            <p className="meta">{s.purpose}</p>
            <button type="button" className="btn btn-outline btn-sm" onClick={() => (hasData ? setPending(s) : load(s))}>
              Cargar<span className="visually-hidden"> el escenario {s.label}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className="meta" role="status" aria-live="polite">{message}</p>
      <ConfirmDialog
        open={pending !== null}
        title={`¿Cargar el escenario "${pending?.label ?? ''}"?`}
        message="Se reemplazarán las postulaciones y los datos que cargaste en este navegador por un escenario de ejemplo ficticio."
        confirmLabel="Sí, cargar escenario"
        onConfirm={() => pending && load(pending)}
        onCancel={() => setPending(null)}
      />
    </details>
  )
}
