import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDemo } from '../../hooks/useDemo'
import { useActiveUser } from '../../hooks/useActiveUser'
import { usePresentation } from '../../hooks/usePresentation'
import { nextTourStep, TOUR_TOTAL } from '../../services/tourService'
import { ROLE_LABELS } from '../../utils/labels'

const KEY = 'tuce-tour-hidden'

function readHidden(): boolean {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

function writeHidden(value: boolean) {
  try {
    if (value) localStorage.setItem(KEY, '1')
    else localStorage.removeItem(KEY)
  } catch {
    // Sin almacenamiento, la guía se oculta solo mientras dure la pantalla.
  }
}

/** Guía del recorrido: dice qué rol debería actuar ahora y lleva a esa pantalla. Se puede ocultar. */
export function TourBanner() {
  const { state } = useDemo()
  const user = useActiveUser()
  const [hidden, setHidden] = useState(readHidden)
  const step = nextTourStep(state)
  const presenting = usePresentation().step !== null

  // Durante la presentación, la barra inferior ya guía el recorrido.
  if (presenting) return null

  if (hidden) {
    return (
      <button type="button" className="btn btn-outline btn-sm tour-show" onClick={() => { writeHidden(false); setHidden(false) }}>
        Mostrar guía del recorrido
      </button>
    )
  }

  const isMyTurn = step !== null && user?.role === step.role
  // Los formularios de postulación son públicos: no hace falta ingresar antes.
  const goDirect = isMyTurn || (step?.to.startsWith('/postular') ?? false)
  return (
    <aside className="tour" aria-label="Guía del recorrido">
      <div className="tour-head">
        <strong>Recorrido guiado{step ? ` · paso ${step.number} de ${TOUR_TOTAL}` : ''}</strong>
        <button type="button" className="tour-close" aria-label="Ocultar la guía del recorrido"
          onClick={() => { writeHidden(true); setHidden(true) }}>×</button>
      </div>
      {step ? (
        <>
          <p>{step.text}</p>
          <p className="meta">Le toca a: <strong>{ROLE_LABELS[step.role]}</strong>{isMyTurn ? ' (sos vos ahora)' : ''}</p>
          <Link className="btn btn-primary btn-sm" to={goDirect ? step.to : `/ingresar?rol=${step.role}`}>
            {goDirect ? step.cta : `Ingresar como ${ROLE_LABELS[step.role]}`}
          </Link>
        </>
      ) : (
        <p>¡Recorrido completo! El proyecto está cerrado. Probá cargar otro comercio o restablecer la demo.</p>
      )}
    </aside>
  )
}
