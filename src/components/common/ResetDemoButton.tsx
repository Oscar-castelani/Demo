import { useState } from 'react'
import { useDemo } from '../../hooks/useDemo'
import { ConfirmDialog } from './ConfirmDialog'

export function ResetDemoButton({ className = 'btn btn-outline btn-sm' }: { className?: string }) {
  const { state, reset, dispatch } = useDemo()
  const [open, setOpen] = useState(false)

  const confirm = () => {
    const current = state.activeUserId
    reset()
    // Se conserva el usuario activo para no sacar a la persona de la demo.
    dispatch({ type: 'setActiveUser', userId: current })
    setOpen(false)
  }

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>
        Restablecer demo
      </button>
      <ConfirmDialog
        open={open}
        title="¿Restablecer la demostración?"
        message="Se borrarán las postulaciones, los proyectos y todo lo que cargaste en este navegador, y la demo volverá a estar vacía."
        confirmLabel="Sí, restablecer"
        onConfirm={confirm}
        onCancel={() => setOpen(false)}
      />
    </>
  )
}
