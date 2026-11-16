import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { usePresentation, usePresentationActions } from '../../hooks/usePresentation'
import { ConfirmDialog } from '../common/ConfirmDialog'

/** Activa el modo presentación. Si hay datos cargados, pide confirmación antes de reemplazarlos. */
export function StartPresentationButton({ className = 'btn btn-primary btn-sm' }: { className?: string }) {
  const { state } = useDemo()
  const { step } = usePresentation()
  const { goTo, exit } = usePresentationActions()
  const [open, setOpen] = useState(false)
  const hasData = state.applications.length > 0 || state.studentProfiles.length > 0

  if (step !== null) {
    return <button type="button" className="btn btn-outline btn-sm" onClick={exit}>Salir del modo presentación</button>
  }

  const start = () => {
    setOpen(false)
    goTo(1)
  }

  return (
    <>
      <button type="button" className={className} onClick={() => (hasData ? setOpen(true) : start())}>
        Activar modo presentación
      </button>
      <ConfirmDialog
        open={open}
        title="¿Activar el modo presentación?"
        message="Cada paso carga un escenario ficticio y reemplaza lo que cargaste en este navegador. Anterior y Siguiente no vuelven a preguntar. Podés salir cuando quieras."
        confirmLabel="Sí, activar"
        onConfirm={start}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
