import { useEffect, useId, useRef, useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { SCENARIOS, type Scenario } from '../../data/scenarios'
import { ConfirmDialog } from './ConfirmDialog'

// El proyecto finalizado ya tiene su propio botón ("Cargar ejemplo").
const LISTED = SCENARIOS.filter((s) => s.listed && s.id !== 'finalizado')

/** Escenarios para probar una parte del recorrido sin hacer todos los pasos anteriores. */
export function ScenarioPicker({ onChooseRole }: { onChooseRole: () => void }) {
  const { state, dispatch } = useDemo()
  const [pending, setPending] = useState<Scenario | null>(null)
  const [message, setMessage] = useState('')
  const [loaded, setLoaded] = useState<Scenario | null>(null)
  const hasData = state.applications.length > 0 || state.studentProfiles.length > 0

  const load = (scenario: Scenario) => {
    dispatch({ type: 'replace', state: scenario.build() })
    setPending(null)
    setMessage(`Escenario cargado: ${scenario.label}.`)
    setLoaded(scenario)
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
      <LoadedDialog
        scenario={loaded}
        onChooseRole={() => { setLoaded(null); onChooseRole() }}
        onClose={() => setLoaded(null)}
      />
    </details>
  )
}

/** Aviso emergente tras cargar un escenario: explica qué se cargó, dónde verlo y lleva a elegir el rol. */
function LoadedDialog({ scenario, onChooseRole, onClose }: { scenario: Scenario | null; onChooseRole: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const open = scenario !== null

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog ref={ref} className="dialog" aria-labelledby={titleId} onClose={onClose}>
      <h2 id={titleId}>Datos de ejemplo cargados</h2>
      <p>
        Se cargó el escenario <strong>«{scenario?.label}»</strong>. Son datos ficticios, marcados como «Dato simulado»,
        y reemplazan lo que hubiera en este navegador: no se envían a ningún lado.
      </p>
      <p>
        <strong>Para verlos, elegí un rol.</strong> Vas a encontrar a las personas del ejemplo en la lista de usuarios y, al
        ingresar, los datos cargados en el panel, en Postulaciones, Equipos o Proyectos, según el rol.
      </p>
      <div className="dialog-actions">
        <button className="btn btn-primary" type="button" onClick={onChooseRole}>Elegir rol</button>
      </div>
    </dialog>
  )
}
