import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDemo } from '../../hooks/useDemo'
import { createExampleState } from '../../data/demoData'
import { ConfirmDialog } from './ConfirmDialog'
import { StartPresentationButton } from '../presentation/StartPresentationButton'

type Pending = 'example' | 'scratch' | null

/** Los dos caminos para recorrer la demo, más el modo presentación. */
export function PathCards() {
  const { state, dispatch, reset } = useDemo()
  const navigate = useNavigate()
  const [pending, setPending] = useState<Pending>(null)
  const [message, setMessage] = useState('')
  const hasData = state.applications.length > 0 || state.studentProfiles.length > 0

  const loadExample = () => {
    dispatch({ type: 'replace', state: createExampleState() })
    setPending(null)
    setMessage('Caso de ejemplo cargado. Elegí un rol para explorarlo.')
  }

  const startFromScratch = () => {
    if (hasData) reset()
    setPending(null)
    navigate('/postular/comercio')
  }

  return (
    <section aria-label="Cómo recorrer la demo" className="paths">
      <h2 className="step-title">¿Cómo querés recorrer la demo?</h2>
      <div className="path-grid">
        <article className="path-card">
          <h3>Explorar un proyecto completo</h3>
          <p>Un caso ficticio ya terminado, con equipo, tareas, entregables y evaluación final. Ideal para ver cómo queda todo.</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => (hasData ? setPending('example') : loadExample())}>
            Cargar y explorar
          </button>
        </article>
        <article className="path-card">
          <h3>Crear un proyecto desde cero</h3>
          <p>Empezás con la demo vacía: un comercio postula, el docente revisa, se arma el equipo y se trabaja paso a paso.</p>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => (hasData ? setPending('scratch') : startFromScratch())}>
            Empezar desde cero
          </button>
        </article>
      </div>
      <p className="meta" role="status" aria-live="polite">{message}</p>

      <div className="present-offer">
        <div>
          <strong>¿Vas a presentar la demo?</strong>
          <p className="meta">Modo presentación: 9 pasos con un escenario ficticio por paso, para recorrerlos sin cambiar de rol a mano.</p>
        </div>
        <StartPresentationButton className="btn btn-outline btn-sm" />
      </div>

      <ConfirmDialog
        open={pending === 'example'}
        title="¿Cargar el caso de ejemplo?"
        message="Se reemplazarán las postulaciones y los datos que cargaste en este navegador por un caso de ejemplo ficticio."
        confirmLabel="Sí, cargar ejemplo"
        onConfirm={loadExample}
        onCancel={() => setPending(null)}
      />
      <ConfirmDialog
        open={pending === 'scratch'}
        title="¿Empezar desde cero?"
        message="Se borrarán las postulaciones, los proyectos y todo lo que cargaste en este navegador, y la demo volverá a estar vacía."
        confirmLabel="Sí, empezar desde cero"
        onConfirm={startFromScratch}
        onCancel={() => setPending(null)}
      />
    </section>
  )
}
