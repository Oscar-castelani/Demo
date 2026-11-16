import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { WarningBanner } from '../common/WarningBanner'

interface Props {
  title: string
  intro: string
  children: ReactNode
}

/** Estructura común de las pantallas con formulario de postulación. */
export function FormPage({ title, intro, children }: Props) {
  return (
    <main className="select-page" tabIndex={-1}>
      <WarningBanner />
      <div className="select-card form-card">
        <Link to="/ingresar" className="back-link">← Volver</Link>
        <h1>{title}</h1>
        <p className="intro">{intro}</p>
        <p className="notice" role="note">
          <strong>Es una demostración, no una postulación real.</strong> Lo que escribas se guarda solo en este navegador
          y no se envía a ningún servidor. No uses datos personales reales: usá datos ficticios.
        </p>
        {children}
      </div>
    </main>
  )
}
