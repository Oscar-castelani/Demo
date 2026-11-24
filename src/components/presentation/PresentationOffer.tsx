import { StartPresentationButton } from './StartPresentationButton'

/** Invitación a activar el modo presentación. */
export function PresentationOffer() {
  return (
    <div className="present-offer">
      <div>
        <strong>¿Vas a presentar la demo?</strong>
        <p className="meta">Modo presentación: 9 pasos con un escenario ficticio por paso, para recorrerlos sin cambiar de rol a mano.</p>
      </div>
      <StartPresentationButton className="btn btn-outline btn-sm" />
    </div>
  )
}
